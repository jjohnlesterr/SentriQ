"use client";

import PageShell from "@/components/layout/PageShell";
import PageLoader from "@/components/shared/PageLoader";
import QuizHeader from "@/components/student/quiz/QuizHeader";
import TabWarning from "@/components/student/quiz/TabWarning";
import QuestionCard from "@/components/student/quiz/QuestionCard";
import WaitingApprovalState from "@/components/student/quiz/status/WaitingApprovalState";
import RejectedRequestState from "@/components/student/quiz/status/RejectedRequestState";
import { useStudentQuiz } from "@/hooks/student/useStudentQuiz";

function formatRemainingTime(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
}

export default function StudentQuizContent() {
  const quizState = useStudentQuiz();

  if (quizState.isLoading) {
    return (
      <PageShell>
        <PageLoader label="Loading quiz..." />
      </PageShell>
    );
  }

  if (quizState.session?.approvalStatus === "pending") {
    return (
      <PageShell>
        <WaitingApprovalState />
      </PageShell>
    );
  }

  if (quizState.session?.approvalStatus === "rejected") {
    return (
      <PageShell>
        <RejectedRequestState />
      </PageShell>
    );
  }

  if (!quizState.quiz || !quizState.session || !quizState.currentQuestion) {
    return null;
  }

  return (
    <PageShell>
      <section className="mx-auto max-w-5xl px-4 py-5 sm:px-6 md:px-10 md:py-8">
        {quizState.remainingSeconds !== null && (
          <div className="mb-4 rounded-2xl border border-cyan-400/20 bg-cyan-500/10 px-4 py-3 text-center font-semibold text-cyan-100">
            Time left: {formatRemainingTime(quizState.remainingSeconds)}
          </div>
        )}

        <QuizHeader
          title={quizState.quiz.title}
          studentName={quizState.session.studentName}
          currentIndex={quizState.currentIndex}
          totalQuestions={quizState.quiz.questions.length}
          progress={quizState.progress}
        />

        <TabWarning
          tabWarnings={quizState.tabWarnings}
          fullscreenExits={quizState.fullscreenExits}
          copyAttempts={quizState.copyAttempts}
          pasteAttempts={quizState.pasteAttempts}
          isFullscreenActive={quizState.isFullscreenActive}
          onReturnFullscreen={quizState.requestFullscreen}
        />

        <div
          className={
            quizState.isFullscreenActive
              ? ""
              : "pointer-events-none opacity-40 blur-[1px]"
          }
        >
          <QuestionCard
            question={quizState.currentQuestion}
            currentIndex={quizState.currentIndex}
            totalQuestions={quizState.quiz.questions.length}
            selectedAnswer={quizState.selectedAnswer}
            answeredCount={quizState.answeredCount}
            isCurrentAnswered={quizState.isCurrentAnswered}
            isSubmitting={quizState.isSubmitting}
            onAnswer={quizState.handleAnswer}
            onPrevious={quizState.goPrevious}
            onNext={quizState.goNext}
            onSubmit={quizState.handleSubmit}
          />
        </div>
      </section>
    </PageShell>
  );
}