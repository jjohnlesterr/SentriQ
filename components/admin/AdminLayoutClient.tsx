"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import { Menu } from "lucide-react";
import { useRouter } from "next/navigation";

import AdminAppSidebar from "@/components/admin/AdminAppSidebar";
import GradientBackground from "@/components/layout/GradientBackground";
import { Button } from "@/components/ui/button";
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
        <div className="sticky top-0 z-30 border-b border-white/10 bg-slate-950/70 px-4 py-3 backdrop-blur-xl lg:hidden">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-4 w-4" />
            Menu
          </Button>
        </div>

        <main className="px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
