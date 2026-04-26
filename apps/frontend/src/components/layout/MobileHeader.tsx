"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth";

export function MobileHeader() {
  const { user, logout } = useAuth();

  const initials = (user?.displayName || user?.nome || user?.email || "?")
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  
  return (
    <header className="md:hidden bg-[#131313] fixed top-0 w-full z-40 border-none bg-gradient-to-b from-[#1c1b1b] to-transparent">
      <div className="flex justify-between items-center w-full px-6 py-4">
        <h1 className="text-xl font-black text-[#e5e2e1] tracking-tighter">Finança Pró</h1>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => logout()}
            className="material-symbols-outlined text-[#c3c6d6] hover:text-error transition-colors"
          >
            logout
          </button>
          <Link href="/profile">
            {user?.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt="Perfil"
                className="w-8 h-8 rounded-full object-cover border-2 border-[#b0c6ff]/30"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#b0c6ff] to-[#0058cb] overflow-hidden flex items-center justify-center text-xs font-bold text-[#001945]">
                {initials}
              </div>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
