"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: "user" | "admin";
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (name: string, email: string, password: string, phone?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Restore session on mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        const savedToken = localStorage.getItem("keshar_auth_token");
        if (savedToken) {
          setToken(savedToken);
        }

        const res = await fetch("/api/auth/me", {
          headers: savedToken ? { Authorization: `Bearer ${savedToken}` } : {},
        });

        if (!res.ok) {
          // If server is unavailable or returned non-200, keep local token if present or soft handle
          setIsLoading(false);
          return;
        }

        const contentType = res.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          setIsLoading(false);
          return;
        }

        const data = await res.json();
        if (data.success && data.user) {
          setUser(data.user);
          if (data.user.token) {
            setToken(data.user.token);
            localStorage.setItem("keshar_auth_token", data.user.token);
          }
        } else {
          // Token invalid or expired
          localStorage.removeItem("keshar_auth_token");
          setUser(null);
          setToken(null);
        }
      } catch (err) {
        console.warn("Auth initialization note:", err);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        let errorMsg = "Login failed";
        try {
          const errData = await res.json();
          errorMsg = errData.error || errorMsg;
        } catch {}
        return { success: false, error: errorMsg };
      }

      const data = await res.json();
      if (!data.success) {
        return { success: false, error: data.error || "Login failed" };
      }

      setUser(data.user);
      if (data.user.token) {
        setToken(data.user.token);
        localStorage.setItem("keshar_auth_token", data.user.token);
      }
      return { success: true };
    } catch (err) {
      return { success: false, error: (err as Error).message };
    }
  };

  const signup = async (name: string, email: string, password: string, phone?: string) => {
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, phone }),
      });

      if (!res.ok) {
        let errorMsg = "Signup failed";
        try {
          const errData = await res.json();
          errorMsg = errData.error || errorMsg;
        } catch {}
        return { success: false, error: errorMsg };
      }

      const data = await res.json();
      if (!data.success) {
        return { success: false, error: data.error || "Signup failed" };
      }

      setUser(data.user);
      if (data.user.token) {
        setToken(data.user.token);
        localStorage.setItem("keshar_auth_token", data.user.token);
      }
      return { success: true };
    } catch (err) {
      return { success: false, error: (err as Error).message };
    }
  };

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setUser(null);
      setToken(null);
      localStorage.removeItem("keshar_auth_token");
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
