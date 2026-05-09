"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import PageShell from "@/components/layout/PageShell";
import StudentResultCard from "@/components/student/results/StudentResultCard";
import { getQuizById, getSessionById } from "@/lib/actions";
import type { Quiz, QuizSession } from "@/lib/types";

export default function StudentResultsPage() {
  const router = useRouter();
  const params = useParams();
  const sessionId = params.id as string;

  const [session, setSession] = useState<QuizSession | null>(null);
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadResults() {
      try {
        const sessionData = await getSessionById(sessionId);

        if (!sessionData) {
          const savedResult = sessionStorage.getItem("lastResult");

          if (savedResult) {
            const parsed = JSON.parse(savedResult);

            setSession(parsed.session);
            setQuiz(parsed.quiz);
          }

          setIsLoading(false);
          return;
        }

        const quizData = await getQuizById(sessionData.quizId);

        if (!quizData) {
          const savedResult = sessionStorage.getItem("lastResult");

          if (savedResult) {
            const parsed = JSON.parse(savedResult);

            setSession(parsed.session);
            setQuiz(parsed.quiz);
          }

          setIsLoading(false);
          return;
        }

        setSession(sessionData);
        setQuiz(quizData);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }

    loadResults();
  }, [sessionId]);

  if (isLoading) {
    return (
      <PageShell>
        <div className="flex min-h-screen items-center justify-center px-4">
          <div className="inline-flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-slate-200 backdrop-blur-md">
            <Loader2 className="h-5 w-5 animate-spin text-violet-300" />
            Loading results...
          </div>
        </div>
      </PageShell>
    );
  }

  if (!session || !quiz) {
    return (
      <PageShell>
        <div className="flex min-h-screen items-center justify-center px-4">
          <div className="rounded-3xl border border-red-400/20 bg-red-500/10 px-6 py-5 text-center text-red-200 backdrop-blur-xl">
            <p className="text-lg font-semibold">Result not found</p>

            <p className="mt-2 text-sm text-red-200/80">
              Your session may have expired or failed to load.
            </p>

            <button
              type="button"
              onClick={() => router.replace("/")}
              className="mt-5 rounded-xl border border-white/10 bg-white/10 px-4 py-2 text-sm text-white hover:bg-white/15"
            >
              Return Home
            </button>
          </div>
        </div>
      </PageShell>
    );
  }

  const score = session.score || 0;
  const totalQuestions = quiz.questions.length;
  const percentage =
    totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;
  const passed = percentage >= 70;

  return (
    <PageShell>
      <StudentResultCard
        studentName={session.studentName}
        score={score}
        totalQuestions={totalQuestions}
        percentage={percentage}
        passed={passed}
        tabSwitches={session.tabSwitches}
        onReturnHome={() => router.replace("/")}
      />
    </PageShell>
  );
}