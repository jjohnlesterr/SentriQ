"use client";

import { navLinks } from "@/constants/navigation";
import { useAuthModal } from "@/store/useAuthModal";

type MobileMenuProps = {
  open: boolean;
  onClose: () => void;
};

export default function MobileMenu({ open, onClose }: MobileMenuProps) {
  const { open: openModal } = useAuthModal();

  function handleNavClick(
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) {
    e.preventDefault();
    onClose();

    const target = document.querySelector(href);

    target?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  if (!open) return null;

  return (
    <div className="mt-4 space-y-2 border-t border-white/10 pt-4 lg:hidden">
      {navLinks.map((link) => (
        <a
          key={link.href}
          href={link.href}
          onClick={(e) => handleNavClick(e, link.href)}
          className="block rounded-xl px-4 py-3 text-sm font-medium text-slate-300 transition-all duration-300 hover:bg-white/5 hover:text-white"
        >
          {link.label}
        </a>
      ))}

      <div className="mt-4 grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => {
            openModal("login");
            onClose();
          }}
          className="flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-200 transition-all duration-300 hover:bg-white/10"
        >
          Login
        </button>

        <button
          type="button"
          onClick={() => {
            openModal("signup");
            onClose();
          }}
          className="flex items-center justify-center rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-4 py-2 text-sm font-semibold text-white transition-all duration-300 hover:opacity-90"
        >
          Sign Up
        </button>
      </div>
    </div>
  );
}