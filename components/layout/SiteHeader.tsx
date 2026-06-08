"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import AppLogo from "@/components/shared/AppLogo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/shared/utils";
import BurgerButton from "./BurgerButton";
import MobileMenu from "./MobileMenu";

type SiteHeaderProps = {
  className?: string;
};

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Roles", href: "#features" },
  { label: "About", href: "#about" },
];

export default function SiteHeader({ className }: SiteHeaderProps) {
  const [open, setOpen] = useState(false);

  return (
    <header
      className={cn(
        "mx-auto w-full max-w-7xl px-4 pt-4 sm:px-6 md:px-10 lg:px-16",
        className,
      )}
    >
      <nav className="relative rounded-3xl border border-white/10 bg-white/[0.03] px-4 py-3 shadow-[0_20px_80px_rgba(0,0,0,0.25)] backdrop-blur-xl md:px-6">
        <div className="flex items-center justify-between gap-6">
          <Link href="/" className="flex items-center gap-3">
            <div className="relative h-10 w-10 overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-1.5">
              <Image
                src="/logo.png"
                alt="SentriQ Logo"
                fill
                sizes="40px"
                className="object-contain p-1"
                priority
              />
            </div>

            <AppLogo className="text-xl tracking-tight sm:text-2xl" />
          </Link>

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

          <div className="hidden items-center gap-3 lg:flex">
            <Link href="/teacher/login">
              <Button variant="ghost" size="sm">
                Login
              </Button>
            </Link>

            <Link href="/teacher/register">
              <Button size="sm">Sign Up</Button>
            </Link>
          </div>

          <BurgerButton open={open} onClick={() => setOpen((prev) => !prev)} />
        </div>

        <MobileMenu open={open} onClose={() => setOpen(false)} />
      </nav>
    </header>
  );
}