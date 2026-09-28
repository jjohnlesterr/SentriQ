"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { navLinks } from "@/constants/navigation";
import { useAuthModal } from "@/store/useAuthModal";

type MobileMenuProps = {
  open: boolean;
  onClose: () => void;
};

export default function MobileMenu({ open, onClose }: MobileMenuProps) {
  const { open: openModal } = useAuthModal();

  if (!open) return null;

  return (
    <div className="border-t border-line pb-4 pt-2 lg:hidden">
      {navLinks.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          onClick={onClose}
          className="block rounded-md px-2 py-2.5 text-sm text-slate-300 transition-colors hover:bg-white/[0.04] hover:text-white"
        >
          {link.label}
        </Link>
      ))}

      <div className="mt-3 grid grid-cols-2 gap-2">
        <Button
          type="button"
          variant="ghost"
          onClick={() => {
            openModal("login");
            onClose();
          }}
        >
          Log in
        </Button>

        <Button
          type="button"
          onClick={() => {
            openModal("signup");
            onClose();
          }}
        >
          Sign up
        </Button>
      </div>
    </div>
  );
}
