import Link from "next/link";

import { navLinks } from "@/constants/navigation";

export default function DesktopNav() {
  return (
    <div className="hidden items-center gap-8 text-sm font-medium text-slate-300 md:flex">
      {navLinks.map((link) => (
        <Link key={link.href} href={link.href} className="transition hover:text-white">
          {link.label}
        </Link>
      ))}
    </div>
  );
}