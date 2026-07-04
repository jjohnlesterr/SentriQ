"use client";

import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/shared/utils";

type SidebarButtonProps = {
  children: ReactNode;
  active?: boolean;
  icon?: LucideIcon;
  onClick?: () => void;
  sidebarVariant?: "main" | "sub" | "logout";
  className?: string;
  collapsed?: boolean;
  title?: string;
};

export default function SidebarButton({
  children,
  active = false,
  icon: Icon,
  onClick,
  sidebarVariant = "main",
  className,
  collapsed = false,
  title,
}: SidebarButtonProps) {
  return (
    <button
      type="button"
      title={collapsed ? title : undefined}
      aria-label={title}
      onClick={onClick}
      className={cn(
        "group relative flex w-full min-w-0 items-center overflow-visible transition",
        collapsed && "justify-center",
        sidebarVariant === "main" &&
          "gap-3 rounded-2xl px-4 py-3 text-sm font-semibold",
        sidebarVariant === "sub" && "gap-2 rounded-xl px-3 py-2 text-sm",
        sidebarVariant === "logout" &&
          "gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm",
        collapsed && "h-11 px-0",
        active
          ? "bg-white/10 font-semibold text-white"
          : sidebarVariant === "sub"
            ? "font-medium text-cyan-200 hover:bg-white/10 hover:text-white"
            : "text-slate-300 hover:bg-white/10 hover:text-white",
        className,
      )}
    >
      {Icon && <Icon className="h-4 w-4 shrink-0" />}
      {!collapsed && children}

      {collapsed && title && (
        <span className="pointer-events-none absolute left-full top-1/2 z-[80] ml-3 hidden -translate-y-1/2 whitespace-nowrap rounded-xl border border-white/10 bg-slate-950/95 px-3 py-2 text-xs font-semibold text-white shadow-xl backdrop-blur-xl group-hover:block">
          {title}
        </span>
      )}
    </button>
  );
}