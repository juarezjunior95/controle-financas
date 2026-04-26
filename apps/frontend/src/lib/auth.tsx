"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useAuth as useClerkAuth, useUser as useClerkUser } from "@clerk/nextjs";

interface User {
  id: string;
  clerkId: string;
  email: string;
  displayName: string | null;
  nome: string | null;
  sobrenome: string | null;
  avatarUrl: string | null;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  logout: () => void;
  updateDisplayName: (name: string) => void;
  updateAvatarUrl: (url: string | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Provider de autenticação que integra com o Clerk.
 * Serve como ponte para que o resto da app continue usando useAuth() de forma transparente.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { isLoaded: authLoaded, userId, getToken, signOut } = useClerkAuth();
  const { isLoaded: userLoaded, user: clerkUser } = useClerkUser();
  
  const [token, setToken] = useState<string | null>(null);
  const [internalUser, setInternalUser] = useState<User | null>(null);

  // Sincronizar Token do Clerk
  useEffect(() => {
    const refreshToken = async () => {
      if (userId) {
        try {
          const t = await getToken();
          setToken((prev) => (prev !== t ? t : prev));
        } catch (e) {
          console.error("[Auth] Erro ao obter token do Clerk:", e);
          setToken(null);
        }
      } else {
        setToken(null);
      }
    };

    refreshToken();
    
    // Atualiza o token a cada 30 segundos usando o getToken do Clerk,
    // que fará o refresh automático caso esteja expirando
    const intervalId = setInterval(refreshToken, 30000);
    
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        refreshToken();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      clearInterval(intervalId);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [userId, getToken]);

  // Sincronizar Usuário do Clerk para o formato interno
  useEffect(() => {
    if (clerkUser) {
      const fullName = [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(' ');
      setInternalUser((prev) => ({
        id: clerkUser.id,
        clerkId: clerkUser.id,
        email: clerkUser.primaryEmailAddress?.emailAddress || "",
        displayName: prev?.displayName || fullName || null,
        nome: clerkUser.firstName,
        sobrenome: clerkUser.lastName,
        avatarUrl: clerkUser.imageUrl,
      }));
    } else {
      setInternalUser(null);
    }
  }, [clerkUser]);

  const logout = useCallback(async () => {
    await signOut();
    setToken(null);
    setInternalUser(null);
  }, [signOut]);

  /**
   * Atualiza o displayName no estado global imediatamente.
   * Permite que Header, Dashboard, etc. reflitam a mudança sem reload.
   */
  const updateDisplayName = useCallback((name: string) => {
    setInternalUser((prev) => prev ? { ...prev, displayName: name } : prev);
  }, []);

  /**
   * Atualiza o avatarUrl no estado global imediatamente.
   * Usado após upload/remoção de foto de perfil.
   */
  const updateAvatarUrl = useCallback((url: string | null) => {
    setInternalUser((prev) => prev ? { ...prev, avatarUrl: url } : prev);
  }, []);

  // Só consideramos carregado quando:
  // 1. Clerk auth está carregado
  // 2. Se há um userId, o perfil do usuário E o token devem estar carregados
  const isLoading = Boolean(!authLoaded || (!!userId && (!userLoaded || !token)));

  return (
    <AuthContext.Provider
      value={{
        user: internalUser,
        token,
        isLoading,
        isAuthenticated: !!userId && !!token,
        logout,
        updateDisplayName,
        updateAvatarUrl,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Hook para acessar o contexto de autenticação customizado (agora via Clerk).
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider.");
  }
  return context;
}
