"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Product } from "@/frontend/types/product";

interface WishlistContextType {
  wishlistItems: Product[];
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;
  removeFromWishlist: (productId: string) => void;
  clearWishlist: () => void;
  wishlistCount: number;
  isSyncing: boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

function safeSetItem(key: string, value: string) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, value);
  } catch (e: any) {
    if (
      e.name === "QuotaExceededError" ||
      e.code === 22 ||
      e.number === -2147024882 ||
      (e.message && e.message.includes("quota"))
    ) {
      console.warn(`localStorage quota exceeded for key "${key}". Clearing stored cache.`);
      try {
        localStorage.removeItem("keshar_wishlist_items");
        localStorage.removeItem("keshar_cart_items");
        localStorage.setItem(key, value);
      } catch (retryErr) {
        console.warn(`Unable to write to localStorage for "${key}". App will use in-memory state.`);
      }
    } else {
      console.warn(`Failed to save "${key}" to localStorage:`, e);
    }
  }
}

function getOrCreateSessionId(): string {
  if (typeof window === "undefined") return "";
  let sessionId = localStorage.getItem("keshar_guest_cart_session");
  if (!sessionId) {
    sessionId = "guest_" + Math.random().toString(36).substring(2, 9) + "_" + Date.now();
    safeSetItem("keshar_guest_cart_session", sessionId);
  }
  return sessionId;
}

function getAuthHeaders(): Record<string, string> {
  if (typeof window === "undefined") return {};
  const token = localStorage.getItem("keshar_auth_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const [wishlistItems, setWishlistItems] = useState<Product[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  // Restore wishlist from localStorage & sync from MongoDB on mount
  useEffect(() => {
    const initWishlist = async () => {
      let localItems: Product[] = [];
      try {
        const saved = localStorage.getItem("keshar_wishlist_items");
        if (saved) {
          localItems = JSON.parse(saved);
          setWishlistItems(localItems);
        }
      } catch (e) {
        console.error("Failed to load wishlist from localStorage", e);
      }

      const sessionId = getOrCreateSessionId();

      try {
        setIsSyncing(true);
        const res = await fetch(`/api/wishlist?sessionId=${sessionId}`, {
          headers: getAuthHeaders(),
        });

        if (!res.ok) return;

        const contentType = res.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) return;

        const data = await res.json();

        if (data.success && data.wishlist && Array.isArray(data.wishlist.items)) {
          const dbItems: Product[] = data.wishlist.items
            .map((item: any) => item.product)
            .filter(Boolean);

          if (dbItems.length > 0) {
            setWishlistItems(dbItems);
            safeSetItem("keshar_wishlist_items", JSON.stringify(dbItems));
          } else if (localItems.length > 0) {
            // Sync local wishlist to DB
            const formatted = localItems.map((p) => ({ productId: p.id, product: p }));
            await fetch("/api/wishlist", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                ...getAuthHeaders(),
              },
              body: JSON.stringify({ items: formatted, sessionId }),
            });
          }
        }
      } catch (err) {
        console.warn("Wishlist sync note (backend server offline):", err);
      } finally {
        setIsLoaded(true);
        setIsSyncing(false);
      }
    };

    initWishlist();
  }, []);

  // Save wishlist to localStorage & MongoDB whenever wishlistItems changes
  useEffect(() => {
    if (!isLoaded) return;

    safeSetItem("keshar_wishlist_items", JSON.stringify(wishlistItems));

    const sessionId = getOrCreateSessionId();
    const syncTimeout = setTimeout(async () => {
      try {
        setIsSyncing(true);
        const formatted = wishlistItems.map((p) => ({ productId: p.id, product: p }));
        await fetch("/api/wishlist", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...getAuthHeaders(),
          },
          body: JSON.stringify({ items: formatted, sessionId }),
        });
      } catch (err) {
        console.warn("Failed to persist wishlist into database:", err);
      } finally {
        setIsSyncing(false);
      }
    }, 600);

    return () => clearTimeout(syncTimeout);
  }, [wishlistItems, isLoaded]);

  const toggleWishlist = (product: Product) => {
    setWishlistItems((prev) => {
      const exists = prev.some((item) => item.id === product.id);
      if (exists) {
        return prev.filter((item) => item.id !== product.id);
      } else {
        return [...prev, product];
      }
    });
  };

  const isInWishlist = (productId: string): boolean => {
    return wishlistItems.some((item) => item.id === productId);
  };

  const removeFromWishlist = (productId: string) => {
    setWishlistItems((prev) => prev.filter((item) => item.id !== productId));
  };

  const clearWishlist = () => {
    setWishlistItems([]);
    const sessionId = getOrCreateSessionId();
    fetch(`/api/wishlist?sessionId=${sessionId}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    }).catch((err) => console.warn("Failed to clear DB wishlist", err));
  };

  const wishlistCount = wishlistItems.length;

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        toggleWishlist,
        isInWishlist,
        removeFromWishlist,
        clearWishlist,
        wishlistCount,
        isSyncing,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
};
