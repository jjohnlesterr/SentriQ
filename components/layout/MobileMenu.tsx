import Link from "next/link";
import { navLinks } from "@/constants/navigation";

type MobileMenuProps = {
  open: boolean;
  onClose: () => void;
};

export default function MobileMenu({ open, onClose }: MobileMenuProps) {
  if (!open) return null;

  return (
    <div className="mt-4 space-y-2 border-t border-white/10 pt-4 lg:hidden">

      {/* NAV LINKS */}
      {navLinks.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          onClick={onClose}
          className="block rounded-xl px-4 py-3 text-sm font-medium text-slate-300 transition hover:bg-white/5 hover:text-white"
        >
          {link.label}
        </Link>
      ))}

      {/* AUTH BUTTONS - 1 ROW */}
      <div className="mt-4 grid grid-cols-2 gap-2">

        <Link
          href="/teacher/login"
          onClick={onClose}
          className="flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-200 hover:bg-white/10 transition"
        >
          Login
        </Link>

        <Link
          href="/teacher/register"
          onClick={onClose}
          className="flex items-center justify-center rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-4 py-2 text-sm font-semibold text-white hover:opacity-90 transition"
        >
          Sign Up
        </Link>

      </div>

    </div>
  );
}