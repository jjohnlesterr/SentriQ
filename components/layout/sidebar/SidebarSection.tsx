"use client";

import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/shared/utils";

type SidebarSectionProps = {
  title: string;
  icon: LucideIcon;
  active?: boolean;
  open: boolean;
  onToggle: () => void;
  children: ReactNode;
  contentClassName?: string;
};

export default function SidebarSection({
  title,
  icon: Icon,
  active = false,
  open,
  onToggle,
  children,
  contentClassName,
}: SidebarSectionProps) {
  return (
    <div
      className={cn(
        "rounded-2xl p-2",
        active
          ? "border border-cyan-400/20 bg-cyan-500/10"
          : "transition hover:bg-white/[0.03]"
      )}
    >
      <button
        type="button"
        onClick={onToggle}
        className={cn(
          "flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm font-semibold transition",
          active ? "text-white" : "text-slate-300 hover:text-white"
        )}
      >
        <div className="flex items-center gap-3">
          <Icon className="h-4 w-4 shrink-0" />
          {title}
        </div>

        <ChevronDown
          className={cn("h-4 w-4 shrink-0 transition", open && "rotate-180")}
        />
      </button>

      {open && (
        <div className={cn("mt-2 space-y-1 pl-6", contentClassName)}>
          {children}
        </div>
      )}
    </div>
  );
}