"use client";

import Image from "next/image";
import { useAuth } from "@/lib/auth";

export function MobileHeader() {
  const { logout } = useAuth();
  
  return (
    <header className="md:hidden bg-[#131313] fixed top-0 w-full z-40 border-none bg-gradient-to-b from-[#1c1b1b] to-transparent">
      <div className="flex justify-between items-center w-full px-6 py-4">
        <h1 className="text-xl font-black text-[#e5e2e1] tracking-tighter">Vault</h1>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => logout()}
            className="material-symbols-outlined text-[#c3c6d6] hover:text-error transition-colors"
          >
            logout
          </button>
          <div className="w-8 h-8 rounded-full bg-surface-container-highest overflow-hidden flex items-center justify-center text-xs font-bold text-white bg-[#0058cb]">
            {/* Fallback avatar if no image */}
            JD
          </div>
        </div>
      </div>
    </header>
  );
}
