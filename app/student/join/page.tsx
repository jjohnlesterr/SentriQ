"use client";

import Image from "next/image";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2, Sparkles } from "lucide-react";

import PageShell from "@/components/layout/PageShell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { joinQuiz } from "@/lib/actions";

export default function StudentJoinPage() {
  const router = useRouter();

  const [studentName, setStudentName] = useState("");
  const [quizCode, setQuizCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!studentName.trim() || !quizCode.trim()) {
      setError("Please enter your name and quiz code.");
      return;
    }

    setIsLoading(true);

    try {
      const { session, quiz } = await joinQuiz(
        studentName.trim(),
        quizCode.trim().toUpperCase()
      );

      sessionStorage.setItem("sessionId", session.id);
      sessionStorage.setItem("studentName", studentName.trim());
      sessionStorage.setItem("quizId", quiz.id);

      router.push(`/student/quiz/${session.id}`);
    } catch {
      setError("Invalid quiz code or quiz is not published.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <PageShell>
      <section className="mx-auto flex min-h-screen max-w-7xl items-center justify-center px-6 py-12 md:px-10 lg:px-16">
        <div className="w-full max-w-md">
          <Button
            type="button"
            variant="ghost"
            className="mb-6 border border-white/10 bg-white/5"
            onClick={() => router.push("/")}
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>

          <Card className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-0 shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl">
            <div className="relative p-8">
              <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-violet-500/10 blur-2xl" />

              <div className="relative z-10">
                <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-500/10 px-4 py-2 text-sm text-violet-200">
                  <Sparkles className="h-4 w-4" />
                  Student Access
                </div>

                <div className="mb-8">
                  <h1 className="bg-gradient-to-r from-violet-300 via-fuchsia-300 to-cyan-300 bg-clip-text text-3xl font-extrabold text-transparent md:text-4xl">
                    Join Quiz
                  </h1>

                  <p className="mt-3 text-sm leading-6 text-slate-300 md:text-base">
                    Enter your name and quiz code to begin your monitored
                    assessment.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Your Name</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Enter your full name"
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="code">Quiz Code</Label>
                    <Input
                      id="code"
                      type="text"
                      placeholder="ABC123"
                      value={quizCode}
                      onChange={(e) =>
                        setQuizCode(e.target.value.toUpperCase())
                      }
                      className="text-center font-mono uppercase tracking-[0.3em]"
                      required
                    />
                  </div>

                  {error && (
                    <div className="rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                      {error}
                    </div>
                  )}

                  <Button
                    type="submit"
                    variant="secondary"
                    className="h-12 w-full"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Joining...
                      </>
                    ) : (
                      "Join Quiz"
                    )}
                  </Button>
                </form>

                <div className="mt-6 border-t border-white/10 pt-6">
                  <p className="text-center text-xs text-slate-400">
                    Ask your teacher for the quiz code.
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>
    </PageShell>
  );
}