"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useRef } from "react";
import { Product } from "@/frontend/types/product";

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItemsCount: number;
  subtotal: number;
  isSyncing: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

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

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  // Restore cart from localStorage & sync from MongoDB API on mount
  useEffect(() => {
    const initCart = async () => {
      let localItems: CartItem[] = [];
      try {
        const savedCart = localStorage.getItem("keshar_cart_items");
        if (savedCart) {
          localItems = JSON.parse(savedCart);
          setCartItems(localItems);
        }
      } catch (e) {
        console.error("Failed to load cart from localStorage", e);
      }

      const sessionId = getOrCreateSessionId();

      try {
        setIsSyncing(true);
        const res = await fetch(`/api/cart?sessionId=${sessionId}`, {
          headers: getAuthHeaders(),
        });

        if (!res.ok) {
          return;
        }

        const contentType = res.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          return;
        }

        const data = await res.json();

        if (data.success && data.cart && Array.isArray(data.cart.items)) {
          const dbItems: CartItem[] = data.cart.items.map((item: any) => ({
            product: item.product,
            quantity: item.quantity,
          }));

          if (dbItems.length > 0) {
            setCartItems(dbItems);
            safeSetItem("keshar_cart_items", JSON.stringify(dbItems));
          } else if (localItems.length > 0) {
            // If DB cart is empty but local cart has items, sync local items to DB
            await fetch("/api/cart", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                ...getAuthHeaders(),
              },
              body: JSON.stringify({ items: localItems, sessionId }),
            });
          }
        }
      } catch (err) {
        console.warn("Cart sync note (backend server offline):", err);
      } finally {
        setIsLoaded(true);
        setIsSyncing(false);
      }
    };

    initCart();
  }, []);

  // Save cart to localStorage & MongoDB whenever cartItems changes
  useEffect(() => {
    if (!isLoaded) return;

    // Save to localStorage immediately
    safeSetItem("keshar_cart_items", JSON.stringify(cartItems));

    // Debounced sync to MongoDB database
    const sessionId = getOrCreateSessionId();
    const syncTimeout = setTimeout(async () => {
      try {
        setIsSyncing(true);
        await fetch("/api/cart", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...getAuthHeaders(),
          },
          body: JSON.stringify({ items: cartItems, sessionId }),
        });
      } catch (err) {
        console.warn("Failed to persist cart into database:", err);
      } finally {
        setIsSyncing(false);
      }
    }, 600);

    return () => clearTimeout(syncTimeout);
  }, [cartItems, isLoaded]);

  const addToCart = (product: Product, quantity: number = 1) => {
    setCartItems((prevItems) => {
      const existingIndex = prevItems.findIndex((item) => item.product.id === product.id);
      if (existingIndex > -1) {
        const updated = [...prevItems];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity,
        };
        return updated;
      } else {
        return [...prevItems, { product, quantity }];
      }
    });
  };

  const removeFromCart = (productId: string) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
    const sessionId = getOrCreateSessionId();
    fetch(`/api/cart?sessionId=${sessionId}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    }).catch((err) => console.warn("Failed to clear DB cart", err));
  };

  const totalItemsCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const subtotal = cartItems.reduce(
    (acc, item) => acc + (item.product?.sellingPrice || 0) * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItemsCount,
        subtotal,
        isSyncing,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
