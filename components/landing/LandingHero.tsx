"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Play, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function LandingHero() {
  return (
    <section className="relative grid min-h-[calc(100vh-104px)] items-center gap-8 overflow-hidden lg:grid-cols-[0.9fr_1fr]">
      <div className="relative z-10 pb-4">
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm font-medium text-cyan-200">
          <ShieldCheck className="h-4 w-4" />
          Secure Quiz Monitoring Platform
        </div>

        <h1 className="text-5xl font-extrabold leading-[0.98] tracking-tight text-white md:text-7xl">
          Create.
          <br />
          Monitor.
          <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 via-blue-400 to-violet-400">
            Achieve.
          </span>
        </h1>

        <p className="mt-6 max-w-xl text-base leading-7 text-slate-300 md:text-lg">
          Build quizzes in minutes, monitor assessments in real time, and
          protect academic integrity through one secure platform.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Link href="/teacher/register" className="w-full sm:w-auto">
            <Button
              size="lg"
              className="h-13 w-full sm:w-auto px-8 text-base font-semibold"
            >
              Get Started
            </Button>
          </Link>

          <a href="#how-it-works" className="w-full sm:w-auto">
            <Button
              variant="ghost"
              size="lg"
              className="
                h-13 w-full sm:w-auto
                border border-white/10
                px-8 text-base font-semibold
                justify-center
              "
            >
              <Play className="h-5 w-5" />
              How It Works
              <ArrowRight className="h-5 w-5" />
            </Button>
          </a>
        </div>
      </div>

      <div className="relative flex items-center justify-center">
        <Image
          src="/hero.png"
          alt="SentriQ mascot background"
          width={540}
          height={540}
          priority
          className="
            pointer-events-none
            absolute
            right-[-40px]
            bottom-[-70px]
            w-[250px]
            opacity-40
            select-none
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
            relative z-10 hidden h-auto w-[430px] xl:w-[470px] lg:block
          "
        />
      </div>
    </section>
  );
}
