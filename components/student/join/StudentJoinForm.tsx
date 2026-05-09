"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Clock3,
  Loader2,
  ShieldCheck,
  Sparkles,
  XCircle,
} from "lucide-react";

import SectionHeading from "@/components/shared/SectionHeading";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getSessionById, joinQuiz } from "@/lib/actions";

export default function StudentJoinForm() {
  const router = useRouter();

  const [studentName, setStudentName] = useState("");
  const [quizCode, setQuizCode] = useState("");
  const [sessionId, setSessionId] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isWaitingApproval, setIsWaitingApproval] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!sessionId || !isWaitingApproval) return;

    const interval = setInterval(async () => {
      const session = await getSessionById(sessionId);

      if (!session) {
        setIsWaitingApproval(false);
        setError("Join request was not found. Please try again.");
        clearInterval(interval);
        return;
      }

      if (session.approvalStatus === "approved") {
        clearInterval(interval);
        router.push(`/student/quiz/${session.id}`);
        return;
      }

      if (session.approvalStatus === "rejected") {
        clearInterval(interval);
        setIsWaitingApproval(false);
        setError("Your join request was rejected by the teacher.");
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [sessionId, isWaitingApproval, router]);

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

      setSessionId(session.id);
      setIsWaitingApproval(true);
    } catch {
      setError("Invalid quiz code or quiz is not published.");
    } finally {
      setIsLoading(false);
    }
  }

  function resetRequest() {
    setSessionId(null);
    setIsWaitingApproval(false);
    setError("");
  }

  return (
    <section className="mx-auto flex min-h-screen max-w-7xl items-center justify-center px-4 py-5 sm:px-6 md:px-10 md:py-12 lg:px-16">
      <div className="w-full max-w-md">
        <Button
          type="button"
          variant="ghost"
          className="mb-4 h-10 border border-white/10 bg-white/5 px-4 text-sm md:mb-6"
          onClick={() => router.push("/")}
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>

        <Card className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-0 shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl">
          <div className="relative p-5 sm:p-6 md:p-8">
            <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-violet-500/10 blur-2xl md:h-32 md:w-32" />

            <div className="relative z-10">
              {isWaitingApproval ? (
                <div className="text-center">
                  <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-500/10 text-cyan-300">
                    <Clock3 className="h-8 w-8 animate-pulse" />
                  </div>

                  <h1 className="bg-gradient-to-r from-violet-300 via-fuchsia-300 to-cyan-300 bg-clip-text text-3xl font-extrabold text-transparent md:text-4xl">
                    Waiting for Approval
                  </h1>

                  <p className="mt-3 text-sm leading-6 text-slate-300">
                    Your request has been sent. Please wait for your teacher to
                    approve your entry.
                  </p>

                  <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-left">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                      Student
                    </p>

                    <p className="mt-1 font-semibold text-white">
                      {studentName}
                    </p>

                    <p className="mt-4 text-xs uppercase tracking-[0.2em] text-slate-500">
                      Quiz Code
                    </p>

                    <p className="mt-1 font-mono font-semibold text-cyan-200">
                      {quizCode}
                    </p>
                  </div>

                  <Button
                    type="button"
                    variant="secondary"
                    onClick={resetRequest}
                    className="mt-6 h-11 w-full border-white/10 bg-white/5 hover:bg-white/10 hover:text-white"
                  >
                    <XCircle className="h-4 w-4" />
                    Cancel Request
                  </Button>
                </div>
              ) : (
                <>
                  <SectionHeading
                    icon={Sparkles}
                    badge="Student Access"
                    title="Request Access"
                    description="Enter your name and quiz code to request access to the assessment."
                    variant="page"
                    className="mb-6 md:mb-8"
                    badgeClassName="mb-4 border border-violet-400/20 bg-violet-500/10 px-3 py-1.5 text-xs text-violet-200"
                    iconClassName="h-3.5 w-3.5"
                    titleClassName="text-3xl md:text-4xl"
                    descriptionClassName="mt-2 text-sm leading-6 text-slate-300 md:mt-3 md:text-base"
                  />

                  <form
                    onSubmit={handleSubmit}
                    className="space-y-4 md:space-y-6"
                  >
                    <div className="space-y-2">
                      <Label htmlFor="name">Your Name</Label>

                      <Input
                        id="name"
                        type="text"
                        placeholder="Enter your full name"
                        value={studentName}
                        onChange={(e) => setStudentName(e.target.value)}
                        className="h-11"
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
                        className="h-11 text-center font-mono uppercase tracking-[0.25em]"
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
                      className="h-11 w-full"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Sending Request...
                        </>
                      ) : (
                        <>
                          <ShieldCheck className="h-4 w-4" />
                          Request to Join
                        </>
                      )}
                    </Button>
                  </form>

                  <div className="mt-5 border-t border-white/10 pt-5 md:mt-6 md:pt-6">
                    <p className="text-center text-xs text-slate-400">
                      Your teacher must approve your request before you can
                      start.
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}