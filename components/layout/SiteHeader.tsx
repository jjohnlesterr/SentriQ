"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import AppLogo from "@/components/shared/AppLogo";
import { Button } from "@/components/ui/button";
import { navLinks } from "@/constants/navigation";
import { cn } from "@/lib/shared/utils";
import { useAuthModal } from "@/store/useAuthModal";
import BurgerButton from "./BurgerButton";
import MobileMenu from "./MobileMenu";

type SiteHeaderProps = {
  className?: string;
};

export default function SiteHeader({ className }: SiteHeaderProps) {
  const [open, setOpen] = useState(false);
  const { open: openAuthModal } = useAuthModal();

  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b border-line bg-canvas/90 backdrop-blur supports-[backdrop-filter]:bg-canvas/75",
        className,
      )}
    >
      <nav className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-6">
          <Link href="/" className="flex items-center gap-2.5">
            <Image
              src="/logo-final.png"
              alt=""
              width={28}
              height={28}
              className="h-7 w-7 object-contain"
              priority
            />
            <AppLogo className="text-lg" />
          </Link>

          <div className="hidden items-center gap-8 lg:flex">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-sm text-slate-400 transition-colors hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden items-center gap-2 lg:flex">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-9 border-transparent px-3.5 text-sm"
              onClick={() => openAuthModal("login")}
            >
              Log in
            </Button>

            <Button
              type="button"
              size="sm"
              className="h-9 px-3.5 text-sm"
              onClick={() => openAuthModal("signup")}
            >
              Sign up
            </Button>
          </div>

          <BurgerButton open={open} onClick={() => setOpen((p) => !p)} />
        </div>

        <MobileMenu open={open} onClose={() => setOpen(false)} />
      </nav>
    </header>
  );
}
