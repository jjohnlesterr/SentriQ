"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Activity,
  BookOpen,
  LayoutDashboard,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  ShieldCheck,
  Users,
  X,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

import AppLogo from "@/components/shared/AppLogo";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import SidebarButton from "@/components/layout/sidebar/SidebarButton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/shared/utils";

type Props = {
  adminEmail?: string;
  open?: boolean;
  collapsed?: boolean;
  onToggleCollapsed?: () => void;
  onClose?: () => void;
  onLogout: () => void;
};

const navItems = [
  { title: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { title: "Users", href: "/admin/users", icon: Users },
  { title: "Quizzes", href: "/admin/quizzes", icon: BookOpen },
  { title: "Sessions", href: "/admin/sessions", icon: Activity },
  { title: "Activity Logs", href: "/admin/events", icon: ShieldCheck },
];

export default function AdminAppSidebar({
  adminEmail,
  open = false,
  collapsed = false,
  onToggleCollapsed,
  onClose,
  onLogout,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [logoutOpen, setLogoutOpen] = useState(false);

  const isCollapsed = collapsed && !open;

  function closeSidebar() {
    onClose?.();
  }

  function navigate(path: string) {
    router.push(path);
    closeSidebar();
  }

  function handleLogout() {
    onLogout();
    closeSidebar();
    setLogoutOpen(false);
  }

  return (
    <>
      {open && (
        <button
          type="button"
          aria-label="Close sidebar overlay"
          onClick={closeSidebar}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        className={cn(
          "fixed left-0 top-0 flex h-screen flex-col border-r border-white/10 py-5 text-white transition-[width] duration-300",
          open
            ? "z-50 w-[88%] max-w-sm bg-slate-950/95 px-5 shadow-2xl backdrop-blur-2xl lg:hidden"
            : cn(
                "z-40 hidden bg-slate-950/60 backdrop-blur-xl lg:flex",
                isCollapsed ? "w-20 px-3" : "w-64 px-4",
              ),
        )}
      >
        <div
          className={cn(
            "mb-6 flex shrink-0 items-center",
            isCollapsed ? "justify-center" : "justify-between",
          )}
        >
          {isCollapsed ? (
            <button
              type="button"
              title="Open sidebar"
              aria-label="Open sidebar"
              onClick={onToggleCollapsed}
              className="group relative flex h-10 w-10 items-center justify-center rounded-2xl transition hover:bg-white/10"
            >
              <Image
                src="/logo.png"
                alt="SentriQ Logo"
                width={36}
                height={36}
                className="object-contain transition group-hover:opacity-0"
                priority
              />

              <PanelLeftOpen className="absolute h-4 w-4 text-slate-200 opacity-0 transition group-hover:opacity-100" />
            </button>
          ) : (
            <>
              <div className="flex min-w-0 items-center gap-3">
                <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-xl">
                  <Image
                    src="/logo.png"
                    alt="SentriQ Logo"
                    fill
                    sizes="36px"
                    className="object-contain"
                    priority
                  />
                </div>

                <div>
                  <AppLogo className="text-xl" />
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
                    Admin
                  </p>
                </div>
              </div>

              {open ? (
                <button
                  type="button"
                  aria-label="Close sidebar"
                  onClick={closeSidebar}
                  className="rounded-xl border border-white/10 bg-white/5 p-2 text-slate-300 transition hover:bg-white/10 hover:text-white lg:hidden"
                >
                  <X className="h-4 w-4" />
                </button>
              ) : (
                <button
                  type="button"
                  title="Close sidebar"
                  aria-label="Close sidebar"
                  onClick={onToggleCollapsed}
                  className="hidden rounded-xl border border-white/10 bg-white/5 p-2 text-slate-300 transition hover:bg-white/10 hover:text-white lg:inline-flex"
                >
                  <PanelLeftClose className="h-4 w-4" />
                </button>
              )}
            </>
          )}
        </div>

        <ScrollArea className="min-h-0 flex-1 pr-2">
          <nav className="space-y-2 pb-4">
            {navItems.map((item) => (
              <SidebarButton
                key={item.href}
                icon={item.icon}
                active={pathname === item.href}
                onClick={() => navigate(item.href)}
                collapsed={isCollapsed}
                title={item.title}
              >
                {item.title}
              </SidebarButton>
            ))}
          </nav>
        </ScrollArea>

        <div className="mt-4 shrink-0 space-y-3">
          {!isCollapsed && (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-violet-500 text-sm font-bold text-white">
                  {adminEmail?.charAt(0)?.toUpperCase() || "A"}
                </div>

                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-white">
                    Administrator
                  </p>
                  <p className="truncate text-xs text-slate-500">
                    {adminEmail || "Admin Account"}
                  </p>
                </div>
              </div>
            </div>
          )}

          <SidebarButton
            sidebarVariant="logout"
            icon={LogOut}
            onClick={() => setLogoutOpen(true)}
            collapsed={isCollapsed}
            title="Logout"
          >
            Logout
          </SidebarButton>
        </div>
      </aside>

      <ConfirmDialog
        open={logoutOpen}
        title="Logout?"
        description="Are you sure you want to logout from your admin account?"
        confirmText="Logout"
        confirmVariant="destructive"
        onOpenChange={setLogoutOpen}
        onConfirm={handleLogout}
      />
    </>
  );
}
