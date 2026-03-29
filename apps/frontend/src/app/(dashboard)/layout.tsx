import { Sidebar } from "@/components/layout/Sidebar";
import { MobileHeader } from "@/components/layout/MobileHeader";
import { BottomNav } from "@/components/layout/BottomNav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-background antialiased">
      <Sidebar />
      <MobileHeader />
      <main className="flex-1 overflow-y-auto w-full pt-20 pb-28 md:pt-12 md:pb-12 px-6 md:px-12 bg-[#131313]">
        <div className="max-w-[1440px] mx-auto">
          {children}
        </div>
      </main>
      <BottomNav />
      {/* Floating Action Button for Mobile */}
      <button className="md:hidden fixed bottom-24 right-6 w-14 h-14 bg-gradient-to-br from-[#b0c6ff] to-[#0058cb] text-[#001945] rounded-full shadow-lg flex items-center justify-center z-50 active:scale-90 transition-transform">
        <span className="material-symbols-outlined text-2xl">add</span>
      </button>
    </div>
  );
}
