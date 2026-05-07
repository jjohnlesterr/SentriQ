"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Eye, EyeOff, LockKeyhole, ShieldCheck } from "lucide-react";
import PageShell from "@/components/layout/PageShell";
import { GlassCard } from "@/components/shared/GlassCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function TeacherLoginPage() {
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
    <PageShell>
      <section className="flex min-h-screen items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <Button
            variant="ghost"
            className="mb-6"
            onClick={() => router.push("/")}
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>

          <GlassCard className="p-8">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1.5 text-xs text-cyan-200">
              <ShieldCheck className="h-3.5 w-3.5" />
              Teacher Access Portal
            </div>

            <h1 className="bg-gradient-to-r from-cyan-300 via-blue-400 to-violet-400 bg-clip-text text-3xl font-extrabold text-transparent">
              Teacher Login
            </h1>

            <p className="mt-3 text-sm leading-6 text-slate-300">
              Sign in to manage quizzes, monitor assessments, and access your dashboard.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div className="space-y-2">
                <label className="text-sm text-slate-200">Email Address</label>
                <Input
                  type="email"
                  placeholder="teacher@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                    className="pl-11 pr-12"
                    required
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <Button type="submit" variant="primary" className="w-full">
                Sign In
              </Button>
            </form>
          </GlassCard>
        </div>
      </section>
    </PageShell>
  );
}