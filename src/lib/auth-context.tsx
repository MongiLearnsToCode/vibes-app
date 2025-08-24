// src/lib/auth-context.tsx
"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/lib/convex";

type User = {
  _id: string;
  name: string;
  email: string;
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // In a real implementation, we would check for an existing session
  useEffect(() => {
    // Simulate checking for an existing session
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  }, []);

  const loginUser = useMutation(api.functions.auth.loginUser);
  const registerUser = useMutation(api.functions.auth.registerUser);
  const logoutUser = useMutation(api.functions.auth.logoutUser);

  const login = async (email: string, password: string) => {
    try {
      const userId = await loginUser({ email, password });
      // In a real implementation, we would fetch the full user object
      setUser({ _id: userId as unknown as string, name: "User", email });
    } catch (error) {
      throw error;
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    try {
      await registerUser({ name, email, password });
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await logoutUser();
      setUser(null);
    } catch (error) {
      throw error;
    }
  };

  const value = {
    user,
    isLoading,
    login,
    signup,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}