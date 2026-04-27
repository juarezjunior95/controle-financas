"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth";

const MENU_ITEMS = [
  { href: "/dashboard", icon: "dashboard", label: "Dashboard" },
  { href: "/transactions", icon: "account_balance_wallet", label: "Transações" },
  { href: "/categories", icon: "pie_chart", label: "Categorias" },
  { href: "/goals", icon: "flag", label: "Metas" },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const initials = (user?.displayName || user?.nome || user?.email || "?")
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <aside className="h-screen w-64 hidden md:flex flex-col bg-[#1c1b1b] py-8 space-y-2 shadow-[24px_0_48px_rgba(0,0,0,0.4)] z-50 shrink-0">
      <div className="px-6 mb-8">
        <h1 className="text-[#e5e2e1] text-xl font-black tracking-tighter">Finança Pró</h1>
        <p className="text-[#c3c6d6] font-source-sans-3 text-xs opacity-60">Assinatura Premium</p>
      </div>

      <nav className="flex-1 space-y-1">
        {MENU_ITEMS.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={
                isActive
                  ? "bg-[#353534] text-[#b0c6ff] rounded-r-full mr-4 py-3 pl-6 border-l-4 border-[#b0c6ff] flex items-center space-x-3 transition-all scale-[0.98]"
                  : "text-[#c3c6d6] py-3 pl-6 hover:bg-[#353534]/50 transition-all flex items-center space-x-3"
              }
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              <span className="font-source-sans-3 text-sm">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="px-6 mt-auto space-y-4">
        <Link 
          href="/new-transaction"
          className="w-full bg-gradient-to-br from-[#b0c6ff] to-[#0058cb] text-[#001945] font-bold py-3 px-4 rounded-full text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-all active:scale-95 text-center"
        >
          <span className="material-symbols-outlined text-lg">add</span>
          Novo Lançamento
        </Link>

        <div className="pt-4 border-t border-[#424654]/20">
          {/* Profile Link with Avatar */}
          <Link
            href="/profile"
            className={`w-full py-2.5 flex items-center space-x-3 transition-colors rounded-lg px-2 ${
              pathname === "/profile"
                ? "text-[#b0c6ff] bg-[#353534]/50"
                : "text-[#c3c6d6] hover:text-[#e5e2e1] hover:bg-[#353534]/30"
            }`}
          >
            {user?.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt=""
                className="w-7 h-7 rounded-full object-cover"
              />
            ) : (
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#b0c6ff] to-[#0058cb] flex items-center justify-center text-[10px] font-bold text-[#001945]">
                {initials}
              </div>
            )}
            <div className="flex flex-col">
              <span className="font-source-sans-3 text-sm leading-tight">
                {user?.displayName || user?.nome || "Meu Perfil"}
              </span>
              <span className="font-source-sans-3 text-[10px] opacity-50 leading-tight">
                Minha Conta
              </span>
            </div>
          </Link>

          <Link
            href="/help"
            className={`py-2 flex items-center space-x-3 transition-colors ${
              pathname === "/help"
                ? "text-[#b0c6ff]"
                : "text-[#c3c6d6] hover:text-[#e5e2e1]"
            }`}
          >
            <span className="material-symbols-outlined">help</span>
            <span className="font-source-sans-3 text-sm">Ajuda</span>
          </Link>
          <button
            onClick={() => logout()}
            className="w-full text-[#c3c6d6] py-2 flex items-center space-x-3 hover:text-error transition-colors"
          >
            <span className="material-symbols-outlined">logout</span>
            <span className="font-source-sans-3 text-sm">Sair</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
