"use client";

import { useAuth } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

/**
 * Guard de autenticação.
 * Redireciona para /login se o usuário não estiver autenticado.
 * Exibe loading spinner durante verificação.
 * Em desenvolvimento, permite bypass com ?demo=true na URL.
 */
export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [isDemoMode, setIsDemoMode] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const demoParam = params.get("demo");
      if (demoParam === "true") {
        setIsDemoMode(true);
      }
    }
  }, []);

  useEffect(() => {
    if (!isLoading && !isAuthenticated && !isDemoMode) {
      router.replace("/login");
    }
  }, [isAuthenticated, isLoading, isDemoMode, router]);

  if (isLoading && !isDemoMode) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#131313]">
        <div className="flex flex-col items-center gap-4">
          <span className="material-symbols-outlined text-4xl text-primary animate-spin" translate="no">
            progress_activity
          </span>
          <p className="text-on-surface-variant text-sm font-medium">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated && !isDemoMode) {
    return null;
  }

  return <>{children}</>;
}
