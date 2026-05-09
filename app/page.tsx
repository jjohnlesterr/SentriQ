"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { BookOpen, Users } from "lucide-react";

import PageShell from "@/components/layout/PageShell";
import PortalCard from "@/components/home/PortalCard";
import SectionHeading from "@/components/shared/SectionHeading";

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
      <section className="relative mx-auto flex min-h-screen max-w-7xl items-center justify-center overflow-hidden px-4 py-4 sm:px-6 md:px-10 lg:px-16">
        <div className="w-full">
          <div className="mx-auto max-w-5xl">
            <div className="mb-4 flex justify-center md:mb-6">
              <div className="flex w-full items-center gap-4 md:w-auto md:gap-6">
                <div className="relative flex-shrink-0">
                  <div className="absolute inset-0 rounded-3xl bg-blue-500/20 blur-xl" />

                  <div className="relative flex h-20 w-20 items-center justify-center overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-3 shadow-2xl backdrop-blur-md sm:h-24 sm:w-24 md:h-28 md:w-28">
                    <Image
                      src="/logo.png"
                      alt="SentriQ Logo"
                      fill
                      sizes="96px"
                      priority
                      className="object-contain p-2"
                    />
                  </div>
                </div>

                <div className="min-w-0 flex-1 md:max-w-3xl">
                  <SectionHeading
                    title="SentriQ"
                    description="A modern platform for digital assessments, real-time monitoring, and seamless academic experiences."
                    variant="hero"
                    align="left"
                    titleClassName="text-4xl sm:text-5xl md:text-6xl"
                    descriptionClassName="mt-2 text-sm leading-6 sm:text-base md:mt-4 md:text-lg"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mx-auto mt-4 grid max-w-5xl grid-cols-2 gap-3 sm:gap-4 md:mt-5 md:gap-5">
            <PortalCard
              icon={BookOpen}
              title="Teacher Portal"
              description="Create quizzes, manage assessments, and monitor student activity with a secure and streamlined dashboard."
              buttonText="Teacher Login"
              variant="primary"
              glowClass="bg-blue-500/10"
              iconClass="border border-blue-400/20 bg-blue-500/10 text-blue-300"
              loading={loadingTarget === "teacher"}
              disabled={loadingTarget !== null}
              onClick={handleTeacherClick}
            />

            <PortalCard
              icon={Users}
              title="Student Portal"
              description="Request access using a quiz code and complete your exam in a focused, monitored environment."
              buttonText="Request Access"
              variant="secondary"
              glowClass="bg-violet-500/10"
              iconClass="border border-violet-400/20 bg-violet-500/10 text-violet-300"
              loading={loadingTarget === "student"}
              disabled={loadingTarget !== null}
              onClick={handleStudentClick}
            />
          </div>

          <div className="mx-auto mt-4 max-w-5xl md:mt-6">
            <div className="rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-center shadow-xl backdrop-blur-md md:px-6 md:py-4">
              <div className="mx-auto mb-3 h-px w-32 bg-gradient-to-r from-transparent via-slate-400 to-transparent md:mb-4 md:w-40" />

              <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-blue-300 md:text-xs md:tracking-[0.35em]">
                Web Developer
              </p>

              <p className="mt-2 text-sm text-slate-300 md:mt-3 md:text-base">
                <span className="font-bold text-white">John Lester Tan</span> •
                BSIT Student
              </p>
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}