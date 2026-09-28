"use client";

import { Menu, X } from "lucide-react";

type BurgerButtonProps = {
  open: boolean;
  onClick: () => void;
};

export default function BurgerButton({ open, onClick }: BurgerButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={open ? "Close menu" : "Open menu"}
      aria-expanded={open}
      className="-mr-2 flex h-10 w-10 items-center justify-center rounded-md text-slate-300 transition-colors hover:bg-white/[0.05] hover:text-white lg:hidden"
    >
      {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
    </button>
  );
}