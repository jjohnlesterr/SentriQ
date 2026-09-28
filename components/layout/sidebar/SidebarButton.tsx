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
      aria-current={active ? "page" : undefined}
      onClick={onClick}
      className={cn(
        "group relative flex w-full min-w-0 items-center overflow-visible transition-colors",
        collapsed && "justify-center",
        sidebarVariant === "main" &&
          "gap-3 rounded-md px-3 py-2 text-sm font-medium",
        sidebarVariant === "sub" && "gap-2 rounded-md px-2.5 py-1.5 text-sm",
        sidebarVariant === "logout" &&
          "gap-3 rounded-md px-3 py-2 text-sm",
        collapsed && "h-10 px-0",
        active
          ? "bg-white/[0.06] text-white"
          : sidebarVariant === "sub"
            ? "text-slate-400 hover:bg-white/[0.04] hover:text-white"
            : "text-slate-400 hover:bg-white/[0.04] hover:text-white",
        className,
      )}
    >
      {Icon && <Icon className="h-4 w-4 shrink-0" />}
      {!collapsed && children}

      {collapsed && title && (
        <span className="pointer-events-none absolute left-full top-1/2 z-[80] ml-3 hidden -translate-y-1/2 whitespace-nowrap rounded-md border border-line-strong bg-surface-raised px-2.5 py-1.5 text-xs font-medium text-white group-hover:block">
          {title}
        </span>
      )}
    </button>
  );
}