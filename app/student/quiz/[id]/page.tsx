"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  AlertTriangle,
  CheckCircle2,
  Loader2,
  Send,
  ShieldAlert,
} from "lucide-react";

import PageShell from "@/components/layout/PageShell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  completeSession,
  getQuizById,
  getSessionById,
  recordTabSwitch,
  updateSessionAnswer,
} from "@/lib/actions";
import type { Quiz, QuizSession } from "@/lib/types";

export default function StudentQuizPage() {
  const router = useRouter();
  const params = useParams();
  const sessionId = params.id as string;

  const [session, setSession] = useState<QuizSession | null>(null);
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [tabWarnings, setTabWarnings] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function loadQuiz() {
      const sessionData = await getSessionById(sessionId);

      if (!sessionData) {
        router.push("/student/join");
        return;
      }

      const quizData = await getQuizById(sessionData.quizId);

      if (!quizData) {
        router.push("/student/join");
        return;
      }

      setSession(sessionData);
      setQuiz(quizData);
      setCurrentIndex(sessionData.currentQuestion || 0);
      setAnswers(sessionData.answers || {});
      setTabWarnings(sessionData.tabSwitches || 0);
      setIsLoading(false);
    }

    loadQuiz();
  }, [sessionId, router]);

  useEffect(() => {
    async function handleVisibilityChange() {
      if (document.hidden && sessionId) {
        setTabWarnings((prev) => prev + 1);

        try {
          await recordTabSwitch(sessionId);
        } catch {
          // ignore temporary network/dev errors
        }
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [sessionId]);

  async function handleAnswer(answerIndex: number) {
    const updatedAnswers = {
      ...answers,
      [currentIndex]: answerIndex,
    };

    setAnswers(updatedAnswers);

    await updateSessionAnswer(sessionId, currentIndex, answerIndex);
  }

  function goNext() {
    if (!quiz) return;

    if (currentIndex < quiz.questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  }

  function goPrevious() {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  }

  async function handleSubmit() {
    setIsSubmitting(true);

    try {
      await completeSession(sessionId);
      router.push(`/student/results/${sessionId}`);
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading || !quiz || !session) {
    return (
      <PageShell>
        <div className="flex min-h-screen items-center justify-center">
          <div className="inline-flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-slate-200 backdrop-blur-md">
            <Loader2 className="h-5 w-5 animate-spin text-violet-300" />
            Loading quiz...
          </div>
        </div>
      </PageShell>
    );
  }

  const currentQuestion = quiz.questions[currentIndex];
  const selectedAnswer = answers[currentIndex];
  const answeredCount = Object.keys(answers).length;
  const progress = Math.round((answeredCount / quiz.questions.length) * 100);

  return (
    <PageShell>
      <section className="mx-auto max-w-5xl px-6 py-8 md:px-10">
        <Card className="mb-6 overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-0 shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl">
          <div className="relative p-6 md:p-8">
            <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-violet-500/10 blur-2xl" />

            <div className="relative z-10 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-500/10 px-3 py-1.5 text-xs text-violet-200">
                  <ShieldAlert className="h-3.5 w-3.5" />
                  Monitored Assessment
                </div>

                <h1 className="bg-gradient-to-r from-violet-300 via-fuchsia-300 to-cyan-300 bg-clip-text text-3xl font-extrabold text-transparent md:text-4xl">
                  {quiz.title}
                </h1>

                <p className="mt-2 text-sm text-slate-300">
                  Student:{" "}
                  <span className="font-semibold text-white">
                    {session.studentName}
                  </span>
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300">
                Question {currentIndex + 1} of {quiz.questions.length}
              </div>
            </div>

            <div className="relative z-10 mt-6">
              <div className="mb-2 flex items-center justify-between text-xs text-slate-400">
                <span>Progress</span>
                <span>{progress}%</span>
              </div>

              <div className="h-3 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-500 transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
        </Card>

        {tabWarnings > 0 && (
          <div className="mb-6 rounded-2xl border border-red-400/20 bg-red-500/10 p-4 text-red-200">
            <div className="flex items-start gap-3">
              <AlertTriangle className="mt-0.5 h-5 w-5" />
              <div>
                <p className="font-semibold">Tab switch detected</p>
                <p className="mt-1 text-sm text-slate-300">
                  You have switched tabs {tabWarnings} time
                  {tabWarnings !== 1 ? "s" : ""}. Your teacher can see this.
                </p>
              </div>
            </div>
          </div>
        )}

        <Card className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl md:p-8">
          <p className="mb-3 font-mono text-xs uppercase tracking-[0.3em] text-violet-300">
            Question {currentIndex + 1}
          </p>

          <h2 className="text-2xl font-bold leading-snug text-white md:text-3xl">
            {currentQuestion.text}
          </h2>

          <div className="mt-8 space-y-4">
            {currentQuestion.options.map((option, index) => {
              const isSelected = selectedAnswer === index;

              return (
                <button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  className={
                    isSelected
                      ? "w-full rounded-2xl border border-violet-400/50 bg-violet-500/20 p-5 text-left text-white shadow-lg"
                      : "w-full rounded-2xl border border-white/10 bg-white/5 p-5 text-left text-slate-300 transition hover:border-violet-400/30 hover:bg-white/10 hover:text-white"
                  }
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={
                        isSelected
                          ? "flex h-9 w-9 items-center justify-center rounded-xl bg-violet-500 text-white"
                          : "flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-400"
                      }
                    >
                      {isSelected ? (
                        <CheckCircle2 className="h-5 w-5" />
                      ) : (
                        String.fromCharCode(65 + index)
                      )}
                    </div>

                    <span className="text-base">{option}</span>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Button
              variant="outline"
              onClick={goPrevious}
              disabled={currentIndex === 0}
            >
              Previous
            </Button>

            <div className="flex gap-3">
              {currentIndex < quiz.questions.length - 1 ? (
                <Button
                  variant="secondary"
                  onClick={goNext}
                  disabled={selectedAnswer === undefined}
                >
                  Next Question
                </Button>
              ) : (
                <Button
                  variant="primary"
                  onClick={handleSubmit}
                  disabled={
                    isSubmitting || answeredCount < quiz.questions.length
                  }
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Submit Quiz
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>

          {answeredCount < quiz.questions.length && (
            <p className="mt-4 text-center text-xs text-slate-500">
              Answer all questions before submitting.
            </p>
          )}
        </Card>
      </section>
    </PageShell>
  );
}