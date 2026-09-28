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
    <div>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className={cn(
          "flex w-full items-center justify-between rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-white/[0.04]",
          active ? "text-white" : "text-slate-400 hover:text-white"
        )}
      >
        <div className="flex items-center gap-3">
          <Icon className="h-4 w-4 shrink-0" />
          {title}
        </div>

        <ChevronDown
          className={cn("h-4 w-4 shrink-0 text-slate-500 transition-transform", open && "rotate-180")}
        />
      </button>

      {open && (
        <div className={cn("ml-5 mt-1 space-y-0.5 border-l border-line pl-2.5", contentClassName)}>
          {children}
        </div>
      )}
    </div>
  );
}