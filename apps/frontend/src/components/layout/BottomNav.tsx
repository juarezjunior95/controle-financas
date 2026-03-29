"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const BOTTOM_MENU_ITEMS = [
  { href: "/dashboard", icon: "home", label: "Home" },
  { href: "/transactions", icon: "list_alt", label: "Activity" },
  { href: "/new-transaction", icon: "add_circle", label: "Add" },
  { href: "/goals", icon: "stars", label: "Goals" },
  { href: "/categories", icon: "pie_chart", label: "Budgets" },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 w-full flex justify-around items-center px-4 pt-3 pb-6 bg-[#1c1b1b]/90 backdrop-blur-xl border-t border-[#424654]/20 z-50 rounded-t-[1.5rem] shadow-[0_-8px_24px_rgba(0,0,0,0.3)]">
      {BOTTOM_MENU_ITEMS.map((item) => {
        const isActive = pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={
              isActive
                ? "flex flex-col items-center justify-center bg-[#b0c6ff]/10 text-[#b0c6ff] rounded-2xl px-4 py-1 transition-transform duration-300 ease-out scale-110"
                : "flex flex-col items-center justify-center text-[#c3c6d6] opacity-60 active:bg-[#353534]"
            }
          >
            <span
              className="material-symbols-outlined text-2xl"
              style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}
            >
              {item.icon}
            </span>
            <span className="font-source-sans-3 text-[10px] font-medium">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
