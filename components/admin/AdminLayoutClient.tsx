"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import { Menu } from "lucide-react";
import { useRouter } from "next/navigation";

import AdminAppSidebar from "@/components/admin/AdminAppSidebar";
import GradientBackground from "@/components/layout/GradientBackground";
import AppLogo from "@/components/shared/AppLogo";
import { supabaseBrowser } from "@/lib/supabase/browser";
import { cn } from "@/lib/shared/utils";

type Props = {
  children: ReactNode;
  adminEmail?: string;
};

export default function AdminLayoutClient({ children, adminEmail }: Props) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  async function handleLogout() {
    await supabaseBrowser.auth.signOut();
    router.push("/teacher/login");
    router.refresh();
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      <GradientBackground />

      <AdminAppSidebar
        adminEmail={adminEmail}
        open={sidebarOpen}
        collapsed={collapsed}
        onToggleCollapsed={() => setCollapsed((prev) => !prev)}
        onClose={() => setSidebarOpen(false)}
        onLogout={handleLogout}
      />

      <div
        className={cn(
          "relative z-10 min-h-screen transition-[padding] duration-300",
          collapsed ? "lg:pl-20" : "lg:pl-64",
        )}
      >
        <div className="mb-4 flex items-center justify-between px-4 pt-4 lg:hidden">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open sidebar"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-200 transition hover:bg-white/10"
          >
            <Menu className="h-5 w-5" />
          </button>

          <AppLogo className="text-2xl" />

          <div className="h-10 w-10" />
        </div>

        <main className="px-4 pb-6 sm:px-6 lg:px-8 lg:py-6">{children}</main>
      </div>
    </div>
  );
}
