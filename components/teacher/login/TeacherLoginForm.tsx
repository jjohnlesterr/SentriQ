"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Eye, EyeOff, LockKeyhole, ShieldCheck } from "lucide-react";

import SectionHeading from "@/components/shared/SectionHeading";
import { GlassCard } from "@/components/shared/GlassCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function TeacherLoginForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    sessionStorage.setItem("teacherId", "demo-teacher");
    sessionStorage.setItem("teacherName", email || "Teacher");

    router.push("/teacher/dashboard");
  }

  return (
    <section className="flex min-h-screen items-center justify-center px-4 py-5 sm:px-6 md:py-12">
      <div className="w-full max-w-md">
        <Button
          variant="ghost"
          className="mb-4 h-10 border border-white/10 bg-white/5 px-4 text-sm md:mb-6"
          onClick={() => router.push("/")}
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>

        <GlassCard className="p-5 sm:p-6 md:p-8">
          <SectionHeading
            icon={ShieldCheck}
            badge="Teacher Access Portal"
            title="Teacher Login"
            description="Sign in to manage quizzes, monitor assessments, and access your dashboard."
            variant="page"
            className="mb-6 md:mb-8"
            badgeClassName="mb-4 border-cyan-400/20 bg-cyan-400/10 px-3 py-1.5 text-xs text-cyan-200 md:mb-4"
            iconClassName="h-3.5 w-3.5"
            titleClassName="text-3xl md:text-4xl"
            descriptionClassName="mt-2 text-sm leading-6 text-slate-300 md:mt-3"
          />

          <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
            <div className="space-y-2">
              <label className="text-sm text-slate-200">Email Address</label>

              <Input
                type="email"
                placeholder="teacher@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-11"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-slate-200">Password</label>

              <div className="relative">
                <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />

                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11 pl-11 pr-12"
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <Button type="submit" variant="primary" className="h-11 w-full">
              Sign In
            </Button>
          </form>
        </GlassCard>
      </div>
    </section>
  );
}