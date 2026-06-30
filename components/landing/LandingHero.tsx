"use client";

import Image from "next/image";
import { Play, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function LandingHero() {
  function openTeacherLoginModal() {
    window.dispatchEvent(
      new CustomEvent("open-auth-modal", {
        detail: "login",
      })
    );
  }

  function openQuizModal() {
    window.dispatchEvent(
      new CustomEvent("open-auth-modal", {
        detail: "quiz",
      })
    );
  }

  return (
    <section className="relative grid min-h-[calc(100vh-104px)] items-center gap-8 overflow-hidden lg:grid-cols-[0.9fr_1fr]">
      <div className="pointer-events-auto relative z-20 pb-4">
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm font-medium text-cyan-200">
          <ShieldCheck className="h-4 w-4" />
          Secure Quiz Monitoring Platform
        </div>

        <h1 className="text-5xl font-extrabold leading-[0.98] tracking-tight text-white md:text-7xl">
          Create.
          <br />
          Monitor.
          <br />
          <span className="bg-gradient-to-r from-cyan-300 via-blue-400 to-violet-400 bg-clip-text text-transparent">
            Achieve.
          </span>
        </h1>

        <p className="mt-6 max-w-xl text-base leading-7 text-slate-300 md:text-lg">
          Build quizzes in minutes, monitor assessments in real time, and
          protect academic integrity through one secure platform.
        </p>

        <div className="pointer-events-auto relative z-30 mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Button
            type="button"
            onClick={openTeacherLoginModal}
            size="lg"
            className="h-13 w-full px-8 text-base font-semibold sm:w-auto"
          >
            Get Started
          </Button>

          <Button
            type="button"
            onClick={openQuizModal}
            variant="ghost"
            size="lg"
            className="
              h-13 w-full justify-center
              border border-cyan-400/40
              bg-cyan-400/10
              px-8 text-base font-semibold
              text-cyan-100
              shadow-lg shadow-cyan-500/10
              transition-all duration-300
              hover:border-cyan-300/70
              hover:bg-cyan-400/20
              hover:text-white
              hover:shadow-cyan-400/20
              sm:w-auto
            "
          >
            <Play className="mr-2 h-5 w-5" />
            Enter Quiz Code
          </Button>
        </div>
      </div>

      <div className="pointer-events-none relative flex items-center justify-center">
        <Image
          src="/hero.png"
          alt="SentriQ mascot background"
          width={540}
          height={540}
          priority
          className="
            pointer-events-none
            absolute
            bottom-[-70px]
            right-[-40px]
            w-[250px]
            select-none
            opacity-40
            lg:hidden
          "
        />

        <Image
          src="/hero.png"
          alt="SentriQ mascot"
          width={540}
          height={540}
          priority
          className="
            pointer-events-none
            relative z-10 hidden h-auto w-[430px] lg:block xl:w-[470px]
          "
        />
      </div>
    </section>
  );
}