"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { cn } from "@/lib/utils";
import DesktopNav from "./DesktopNav";
import MobileMenu from "./MobileMenu";
import BurgerButton from "./BurgerButton";

type SiteHeaderProps = {
  className?: string;
};

export default function SiteHeader({ className }: SiteHeaderProps) {
  const [open, setOpen] = useState(false);

  return (
    <header
      className={cn(
        "mx-auto w-full max-w-7xl px-4 pt-4 sm:px-6 md:px-10 lg:px-16",
        className
      )}
    >
      <nav className="relative rounded-3xl border border-white/10 bg-white/[0.03] px-4 py-3 shadow-[0_20px_80px_rgba(0,0,0,0.25)] backdrop-blur-xl md:px-6">
        <div className="flex items-center justify-between">
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

            <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-400 bg-clip-text text-xl font-extrabold tracking-tight text-transparent sm:text-2xl">
              SentriQ
            </span>
          </Link>

          <DesktopNav />

          <BurgerButton
            open={open}
            onClick={() => setOpen((prev) => !prev)}
          />
        </div>

        <MobileMenu open={open} onClose={() => setOpen(false)} />
      </nav>
    </header>
  );
}