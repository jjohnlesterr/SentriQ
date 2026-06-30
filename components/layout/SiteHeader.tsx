"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

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
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(true);

  const lastScrollY = useRef(0);
  const { open: openAuthModal } = useAuthModal();

  useEffect(() => {
    function handleScroll() {
      const currentScrollY = window.scrollY;
      const isScrolled = currentScrollY > 120;

      setScrolled(isScrolled);

      if (currentScrollY <= 120) {
        setVisible(true);
      } else if (currentScrollY < lastScrollY.current) {
        setVisible(true);
      } else if (currentScrollY > lastScrollY.current + 8) {
        setVisible(false);
        setOpen(false);
      }

      lastScrollY.current = currentScrollY;
    }

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        scrolled
          ? "fixed left-1/2 top-0 z-40 w-full max-w-7xl -translate-x-1/2 px-4 pt-4 transition-all duration-300 sm:px-6 md:px-10 lg:px-16"
          : "relative z-30 mx-auto w-full max-w-7xl px-4 pt-4 transition-all duration-300 sm:px-6 md:px-10 lg:px-16",
        scrolled && !visible && "pointer-events-none -translate-y-full opacity-0",
        scrolled && visible && "translate-y-0 opacity-100",
        className
      )}
    >
      <nav
        className={cn(
          "pointer-events-auto relative rounded-3xl border px-4 py-3 backdrop-blur-xl transition-all duration-300 md:px-6",
          scrolled
            ? "border-cyan-400/20 bg-slate-950/80 shadow-[0_18px_70px_rgba(0,0,0,0.45)]"
            : "border-white/10 bg-white/[0.03] shadow-[0_20px_80px_rgba(0,0,0,0.25)]"
        )}
      >
        <div className="flex items-center justify-between gap-6">
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

          <div className="hidden items-center gap-8 lg:flex">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="relative text-sm font-medium text-slate-300 transition duration-300 hover:text-white after:absolute after:-bottom-2 after:left-0 after:h-px after:w-0 after:bg-cyan-300 after:transition-all after:duration-300 hover:after:w-full"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden items-center gap-3 lg:flex">
            <Button
              type="button"
              variant="ghost"
              className="h-10 rounded-xl px-5 text-sm font-medium transition-all duration-300 hover:bg-white/10"
              onClick={() => openAuthModal("login")}
            >
              Login
            </Button>

            <Button
              type="button"
              className="h-10 rounded-xl px-5 text-sm font-medium transition-all duration-300 hover:-translate-y-0.5"
              onClick={() => openAuthModal("signup")}
            >
              Sign Up
            </Button>
          </div>

          <BurgerButton open={open} onClick={() => setOpen((p) => !p)} />
        </div>

        <MobileMenu open={open} onClose={() => setOpen(false)} />
      </nav>
    </header>
  );
}