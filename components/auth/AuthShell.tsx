"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, BookOpen, ChevronRight, Users } from "lucide-react";

import AppLogo from "@/components/shared/AppLogo";

type AuthShellProps = {
  children: React.ReactNode;
};

const portals = [
  {
    title: "Student Portal",
    description: "Enter a quiz code and request access to your assessment.",
    icon: Users,
    href: "/student/join",
    color: "border-cyan-400/20 bg-cyan-500/10 text-cyan-300",
  },
  {
    title: "Teacher Portal",
    description: "Manage quizzes, students, monitoring, and reports.",
    icon: BookOpen,
    href: "/teacher/login",
    color: "border-violet-400/20 bg-violet-500/10 text-violet-300",
  },
];

export default function AuthShell({ children }: AuthShellProps) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.14),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.16),transparent_35%)]" />

      <section className="relative mx-auto grid min-h-screen w-full max-w-7xl items-center gap-10 px-4 py-8 sm:px-6 md:px-10 lg:grid-cols-[0.9fr_1.1fr] lg:px-16">
        <div className="hidden lg:block">
          <Link
            href="/"
            className="mb-8 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300 transition hover:border-cyan-400/20 hover:bg-white/10 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>

          <Link href="/" className="mb-16 flex items-center gap-4">
            <div className="relative h-16 w-16 overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-2">
              <Image
                src="/logo.png"
                alt="SentriQ Logo"
                fill
                sizes="64px"
                className="object-contain p-2"
                priority
              />
            </div>

            <div>
              <AppLogo className="text-3xl tracking-tight" />
              <p className="mt-1 text-base text-slate-400">
                Secure • Monitor • Assess
              </p>
            </div>
          </Link>

          <h1 className="text-4xl font-extrabold text-white">Welcome!</h1>

          <p className="mt-3 text-base text-slate-400">
            Please select your portal to continue.
          </p>

          <div className="mt-10 space-y-5">
            {portals.map((portal) => {
              const Icon = portal.icon;

              return (
                <Link
                  key={portal.title}
                  href={portal.href}
                  className={`group flex items-center gap-5 rounded-3xl border p-5 transition hover:-translate-y-1 hover:bg-white/[0.08] ${portal.color}`}
                >
                  <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl bg-white/5">
                    <Icon className="h-10 w-10" />
                  </div>

                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-white">
                      {portal.title}
                    </h2>

                    <p className="mt-1 text-sm leading-6 text-slate-300">
                      {portal.description}
                    </p>
                  </div>

                  <ChevronRight className="h-6 w-6 transition group-hover:translate-x-1" />
                </Link>
              );
            })}
          </div>
        </div>

        <div className="mx-auto w-full max-w-2xl">
          <div className="mb-6 flex items-center justify-between lg:hidden">
            <Link href="/" className="flex items-center gap-3">
              <div className="relative h-12 w-12 overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-1.5">
                <Image
                  src="/logo.png"
                  alt="SentriQ Logo"
                  fill
                  sizes="48px"
                  className="object-contain p-1.5"
                  priority
                />
              </div>

            </Link>

            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-300 transition hover:bg-white/10 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Link>
          </div>

          {children}
        </div>
      </section>

      <p className="absolute bottom-5 left-1/2 hidden -translate-x-1/2 text-sm text-slate-500 lg:block">
        © 2026 SentriQ. All rights reserved.
      </p>
    </main>
  );
}