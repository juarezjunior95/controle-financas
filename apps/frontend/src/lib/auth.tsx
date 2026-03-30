"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { fetchAPI } from "./api";

interface User {
  id: string;
  clerkId: string;
  email: string;
  nome: string | null;
  sobrenome: string | null;
  avatarUrl: string | null;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (email: string, password: string, firstName?: string, lastName?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = "vault_auth_token";

/**
 * Provider de autenticação.
 * Gerencia estado do usuário e token via backend API (sem dependência do Clerk no frontend).
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Salva o token no localStorage e no state.
   */
  const saveToken = useCallback((newToken: string) => {
    localStorage.setItem(TOKEN_KEY, newToken);
    setToken(newToken);
  }, []);

  /**
   * Remove o token e limpa o estado.
   */
  const clearAuth = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
  }, []);

  /**
   * Busca os dados do usuário autenticado no backend.
   */
  const fetchUser = useCallback(async (authToken: string) => {
    const { data, error } = await fetchAPI<User>("/auth/me", { token: authToken });

    if (error) {
      console.warn("[Auth] Token inválido ou expirado:", error.message);
      clearAuth();
      return null;
    }

    setUser(data!);
    return data;
  }, [clearAuth]);

  /**
   * Restaura a sessão ao carregar a página (se houver token salvo).
   */
  useEffect(() => {
    const storedToken = localStorage.getItem(TOKEN_KEY);
    if (storedToken) {
      setToken(storedToken);
      fetchUser(storedToken).finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, [fetchUser]);

  /**
   * Login via backend API.
   */
  const login = useCallback(async (email: string, password: string) => {
    const { data, error } = await fetchAPI<{ user: User; token: string }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    if (error) {
      return { success: false, error: error.message };
    }

    saveToken(data!.token);
    setUser(data!.user);
    return { success: true };
  }, [saveToken]);

  /**
   * Registro via backend API.
   */
  const register = useCallback(async (
    email: string,
    password: string,
    firstName?: string,
    lastName?: string,
  ) => {
    const { data, error } = await fetchAPI<{ user: User; token: string }>("/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password, firstName, lastName }),
    });

    if (error) {
      return { success: false, error: error.message };
    }

    saveToken(data!.token);
    setUser(data!.user);
    return { success: true };
  }, [saveToken]);

  /**
   * Logout — limpa dados locais.
   */
  const logout = useCallback(() => {
    clearAuth();
  }, [clearAuth]);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated: !!user && !!token,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Hook para acessar o contexto de autenticação.
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider.");
  }
  return context;
}
