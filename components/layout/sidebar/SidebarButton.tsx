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
};

export default function SidebarButton({
  children,
  active = false,
  icon: Icon,
  onClick,
  sidebarVariant = "main",
  className,
}: SidebarButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-center transition",
        sidebarVariant === "main" &&
          "gap-3 rounded-2xl px-4 py-3 text-sm font-semibold",
        sidebarVariant === "sub" && "gap-2 rounded-xl px-3 py-2 text-sm",
        sidebarVariant === "logout" &&
          "gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm",
        active
          ? "bg-white/10 font-semibold text-white"
          : sidebarVariant === "sub"
            ? "font-medium text-cyan-200 hover:bg-white/10 hover:text-white"
            : "text-slate-300 hover:bg-white/10 hover:text-white",
        className
      )}
    >
      {Icon && <Icon className="h-3.5 w-3.5 shrink-0" />}
      {children}
    </button>
  );
}