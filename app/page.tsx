"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  BookOpen,
  Loader2,
  ShieldCheck,
  Users,
} from "lucide-react";

import PageShell from "@/components/layout/PageShell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function LandingPage() {
  const router = useRouter();

  const [loadingTarget, setLoadingTarget] = useState<
    "teacher" | "student" | null
  >(null);

  function handleTeacherClick() {
    setLoadingTarget("teacher");
    router.push("/teacher/login");
  }

  function handleStudentClick() {
    setLoadingTarget("student");
    router.push("/student/join");
  }

  return (
    <PageShell>
      <section className="relative mx-auto flex min-h-screen max-w-7xl items-center justify-center px-6 py-10 md:px-10 lg:px-16">
        <div className="w-full">
          {/* Hero */}
          <div className="mx-auto max-w-5xl">
            <div className="mb-8 flex justify-center">
              <div className="flex flex-col items-center gap-6 md:flex-row md:items-center">
                {/* Logo */}
                <div className="relative flex-shrink-0">
                  <div className="absolute inset-0 rounded-3xl bg-blue-500/20 blur-xl" />

                  <div className="relative flex h-24 w-24 items-center justify-center overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-3 shadow-2xl backdrop-blur-md sm:h-28 sm:w-28">
                    <Image
                      src="/logo.png"
                      alt="SentriQ Logo"
                      fill
                      priority
                      className="object-contain p-2"
                    />
                  </div>
                </div>

                {/* Text */}
                <div className="max-w-3xl text-center md:text-left">
                  <h1 className="bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-400 bg-clip-text text-5xl font-extrabold tracking-tight text-transparent md:text-7xl">
                    SentriQ
                  </h1>

                  <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300 md:text-xl">
                    A smart quiz and monitoring platform designed to ensure
                    integrity and fairness during digital assessments.
                  </p>

                  <div className="mt-6 flex flex-wrap items-center justify-center gap-3 md:justify-start">
                    <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-sm text-emerald-200">
                      <ShieldCheck className="h-4 w-4" />
                      Real-time monitoring
                    </div>

                    <div className="inline-flex items-center gap-2 rounded-full border border-sky-400/20 bg-sky-400/10 px-4 py-2 text-sm text-sky-200">
                      <BookOpen className="h-4 w-4" />
                      Digital assessment support
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Portal Cards */}
          <div className="mx-auto mt-6 grid max-w-5xl gap-6 md:grid-cols-2">
            <Card className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-0 shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl">
              <div className="relative h-full p-8">
                <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-blue-500/10 blur-2xl" />

                <div className="relative z-10">
                  <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl border border-blue-400/20 bg-blue-500/10 text-blue-300 shadow-lg">
                    <BookOpen className="h-8 w-8" />
                  </div>

                  <h2 className="text-3xl font-extrabold text-white">
                    Teacher Portal
                  </h2>

                  <p className="mt-5 max-w-md text-lg leading-7 text-slate-300">
                    Create quizzes, manage assessments, and monitor student
                    activity with a secure and streamlined dashboard.
                  </p>

                  <Button
                    type="button"
                    variant="primary"
                    onClick={handleTeacherClick}
                    className="mt-8 h-12 w-full cursor-pointer text-base transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed"
                    disabled={loadingTarget !== null}
                  >
                    {loadingTarget === "teacher" ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Redirecting...
                      </>
                    ) : (
                      <>
                        Teacher Login
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </Card>

            <Card className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-0 shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl">
              <div className="relative h-full p-8">
                <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-violet-500/10 blur-2xl" />

                <div className="relative z-10">
                  <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl border border-violet-400/20 bg-violet-500/10 text-violet-300 shadow-lg">
                    <Users className="h-8 w-8" />
                  </div>

                  <h2 className="text-3xl font-extrabold text-white">
                    Student Portal
                  </h2>

                  <p className="mt-5 max-w-md text-lg leading-7 text-slate-300">
                    Join assessments quickly using a quiz code and complete your
                    exam in a focused, monitored environment.
                  </p>

                  <Button
                    type="button"
                    variant="secondary"
                    onClick={handleStudentClick}
                    className="mt-8 h-12 w-full cursor-pointer text-base transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed"
                    disabled={loadingTarget !== null}
                  >
                    {loadingTarget === "student" ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Redirecting...
                      </>
                    ) : (
                      <>
                        Join Quiz
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {/* Footer */}
          <div className="mx-auto mt-10 max-w-5xl">
            <div className="rounded-3xl border border-white/10 bg-white/5 px-6 py-6 text-center shadow-xl backdrop-blur-md">
              <div className="mx-auto mb-4 h-px w-40 bg-gradient-to-r from-transparent via-slate-400 to-transparent" />

              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-blue-300">
                Web Developer
              </p>

              <p className="mt-3 text-base text-slate-300">
                <span className="font-bold text-white">John Lester Tan</span>{" "}
                • BSIT Student
              </p>
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}