"use client";

import Image from "next/image";

import GradientBackground from "@/components/layout/GradientBackground";

export default function LoginTransitionLoader() {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Preparing your dashboard"
      className="fixed inset-0 z-[9999] flex min-h-screen items-center justify-center overflow-hidden px-6"
    >
      <GradientBackground />

      <div className="relative z-10 flex w-full max-w-sm flex-col items-center text-center">
        {/* Logo glow */}
        <div className="absolute top-4 h-28 w-28 rounded-full bg-cyan-400/20 blur-3xl" />

        {/* SentriQ logo */}
        <div className="relative mb-5 h-28 w-28 sm:h-32 sm:w-32">
          <Image
            src="/logo-final.png"
            alt="SentriQ"
            fill
            priority
            sizes="128px"
            className="object-contain drop-shadow-[0_0_30px_rgba(56,189,248,0.25)]"
          />
        </div>

        {/* Brand name */}
        <h1 className="bg-gradient-to-r from-cyan-300 via-blue-400 to-violet-400 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent">
          SentriQ
        </h1>

        <p className="mt-4 text-sm font-medium text-slate-400">
          Preparing your dashboard...
        </p>

        {/* Loading progress */}
        <div className="mt-8 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
          <div className="sentriq-loading-bar h-full w-1/2 rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-500 shadow-[0_0_14px_rgba(59,130,246,0.6)]" />
        </div>

        <p className="mt-4 text-xs text-slate-600">
          Loading your workspace securely
        </p>

        <span className="sr-only">Loading</span>
      </div>
    </div>
  );
}