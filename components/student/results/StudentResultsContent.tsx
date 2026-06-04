"use client";

import { Home } from "lucide-react";
import { useRouter } from "next/navigation";

import PageShell from "@/components/layout/PageShell";
import PageLoader from "@/components/shared/PageLoader";
import ResultNotFoundState from "@/components/student/results/ResultNotFoundState";
import ResultSummaryCard from "@/components/student/results/summary/ResultSummaryCard";
import ResultActivitySummary from "@/components/student/results/activity/ResultActivitySummary";
import AnswerReviewList from "@/components/student/results/review/AnswerReviewList";
import ResultReviewLocked from "@/components/student/results/review/ResultReviewLocked";
import { Button } from "@/components/ui/button";
import { useStudentResults } from "@/hooks/student/useStudentResults";

type StudentResultsContentProps = {
  sessionId: string;
};

function countEvents(events: { type: string }[] | undefined, type: string) {
  return events?.filter((event) => event.type === type).length ?? 0;
}

function getTimeSpentSeconds({
  startedAt,
  completedAt,
  timedOutAt,
}: {
  startedAt: Date | string;
  completedAt?: Date | string;
  timedOutAt?: Date | string;
}) {
  const endTime = completedAt || timedOutAt;

  if (!endTime) return undefined;

  return Math.max(
    0,
    Math.floor(
      (new Date(endTime).getTime() - new Date(startedAt).getTime()) / 1000,
    ),
  );
}

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

  const incorrect = Math.max(results.totalQuestions - results.score, 0);

  const timeSpent = getTimeSpentSeconds({
    startedAt: results.session.startedAt,
    completedAt: results.session.completedAt,
    timedOutAt: results.session.timedOutAt,
  });

  const fullscreenExits = countEvents(
    results.session.events,
    "fullscreen-exit",
  );
  const copyAttempts = countEvents(results.session.events, "copy-attempt");
  const pasteAttempts = countEvents(results.session.events, "paste-attempt");

  return (
    <PageShell>
      <section className="mx-auto min-h-screen max-w-5xl px-4 py-6 sm:px-6 md:px-10 lg:px-12">
        <div className="space-y-5">
          <ResultSummaryCard
            quizTitle={results.quiz.title}
            quizDescription={results.quiz.description}
            studentName={results.session.studentName}
            status={results.session.status}
            score={results.score}
            incorrect={incorrect}
            totalQuestions={results.totalQuestions}
            timeSpentSeconds={timeSpent}
          />

          {results.session.reportVisibility === "locked" && (
            <ResultReviewLocked />
          )}

          {results.session.reportVisibility === "summary" && (
            <AnswerReviewList
              quiz={results.quiz}
              answers={results.session.answers}
              score={results.score}
              incorrect={incorrect}
            />
          )}

          {results.session.reportVisibility === "full" && (
            <>
              <ResultActivitySummary
                tabSwitches={results.session.tabSwitches}
                fullscreenExits={fullscreenExits}
                copyAttempts={copyAttempts}
                pasteAttempts={pasteAttempts}
              />

              <AnswerReviewList
                quiz={results.quiz}
                answers={results.session.answers}
                score={results.score}
                incorrect={incorrect}
              />
            </>
          )}

          <Button
            type="button"
            onClick={handleReturnHome}
            className="h-12 w-full rounded-2xl bg-gradient-to-r from-violet-500 to-fuchsia-500 text-sm font-bold text-white shadow-lg shadow-violet-500/20 transition hover:brightness-110 sm:h-14 sm:text-base md:mx-auto md:flex md:max-w-sm"
          >
            <Home className="h-5 w-5" />
            Return Home
          </Button>
        </div>
      </section>
    </PageShell>
  );
}
