"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import AppLogo from "@/components/shared/AppLogo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/shared/utils";
import BurgerButton from "./BurgerButton";
import MobileMenu from "./MobileMenu";
import { useAuthModal } from "@/store/useAuthModal";

type SiteHeaderProps = {
  className?: string;
};

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Roles", href: "#roles" },
];

export default function SiteHeader({ className }: SiteHeaderProps) {
  const [open, setOpen] = useState(false);

  const { open: openAuthModal } = useAuthModal();

  return (
    <header
      className={cn(
        "mx-auto w-full max-w-7xl px-4 pt-4 sm:px-6 md:px-10 lg:px-16",
        className
      )}
    >
      <nav className="relative rounded-3xl border border-white/10 bg-white/[0.03] px-4 py-3 shadow-[0_20px_80px_rgba(0,0,0,0.25)] backdrop-blur-xl md:px-6">
        
        <div className="flex items-center justify-between gap-6">
          
          {/* LOGO */}
          <Link href="/" className="flex items-center gap-3">
            <div className="relative h-10 w-10 overflow-hidden">
              <Image
                src="/logoo.png"
                alt="SentriQ Logo"
                fill
                sizes="40px"
                className="object-contain"
                priority
              />
            </div>

            <AppLogo className="text-xl tracking-tight sm:text-2xl" />
          </Link>

          {/* NAV LINKS */}
          <div className="hidden items-center gap-8 lg:flex">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-sm font-medium text-slate-300 transition hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* AUTH BUTTONS */}
          <div className="hidden items-center gap-3 lg:flex">
            <Button
              variant="ghost"
              className="h-10 rounded-xl px-5 text-sm font-medium"
              onClick={() => openAuthModal("login")}
            >
              Login
            </Button>

            <Button
              className="h-10 rounded-xl px-5 text-sm font-medium"
              onClick={() => openAuthModal("signup")}
            >
              Sign Up
            </Button>
          </div>

          {/* MOBILE */}
          <BurgerButton open={open} onClick={() => setOpen((p) => !p)} />
        </div>

        <MobileMenu open={open} onClose={() => setOpen(false)} />
      </nav>
    </header>
  );
}