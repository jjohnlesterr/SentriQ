"use client";

import { useRouter } from "next/navigation";

import PageShell from "@/components/layout/PageShell";
import PageLoader from "@/components/shared/PageLoader";
import ResultNotFoundState from "@/components/student/results/ResultNotFoundState";
import ResultSummaryCard from "@/components/student/results/summary/ResultSummaryCard";
import ResultActivitySummary from "@/components/student/results/activity/ResultActivitySummary";
import AnswerReviewList from "@/components/student/results/review/AnswerReviewList";
import ResultReviewLocked from "@/components/student/results/review/ResultReviewLocked";
import { useStudentResults } from "@/hooks/student/useStudentResults";

type StudentResultsContentProps = {
  sessionId: string;
};

export default function StudentResultsContent({
  sessionId,
}: StudentResultsContentProps) {
  const router = useRouter();
  const results = useStudentResults(sessionId);

  function handleReturnHome() {
    router.replace("/");
  }

  if (results.isLoading) {
    return (
      <PageShell>
        <PageLoader label="Loading results..." />
      </PageShell>
    );
  }

  if (!results.session || !results.quiz) {
    return (
      <PageShell>
        <ResultNotFoundState onReturnHome={handleReturnHome} />
      </PageShell>
    );
  }

  return (
    <PageShell>
      <section className="mx-auto flex min-h-screen max-w-7xl items-center justify-center px-4 py-5 sm:px-6 md:px-10 md:py-12 lg:px-16">
        <div className="w-full max-w-3xl">
          <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-0 shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl">
            <div className="relative p-5 sm:p-6 md:p-10">
              <div className="absolute right-0 top-0 h-28 w-28 rounded-full bg-violet-500/10 blur-2xl md:h-36 md:w-36" />
              <div className="absolute left-0 top-24 h-24 w-24 rounded-full bg-blue-500/10 blur-2xl md:h-28 md:w-28" />

              <div className="relative z-10 space-y-5 md:space-y-8">
                <ResultSummaryCard
                  studentName={results.session.studentName}
                  score={results.score}
                  totalQuestions={results.totalQuestions}
                  percentage={results.percentage}
                  passed={results.passed}
                />

                {results.session.reportVisibility === "locked" && (
                  <ResultReviewLocked />
                )}

                {results.session.reportVisibility !== "locked" && (
                  <ResultActivitySummary
                    tabSwitches={results.session.tabSwitches}
                    events={results.session.events}
                  />
                )}

                {results.session.reportVisibility === "full" && (
                  <AnswerReviewList
                    quiz={results.quiz}
                    answers={results.session.answers}
                  />
                )}

                <button
                  type="button"
                  onClick={handleReturnHome}
                  className="h-11 w-full rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 text-sm font-semibold text-white shadow-lg shadow-violet-500/20 transition hover:brightness-110 md:h-12"
                >
                  Return Home
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}