"use client";

import { Loader2 } from "lucide-react";

import PageShell from "@/components/layout/PageShell";
import QuizHeader from "@/components/student/quiz/QuizHeader";
import TabWarning from "@/components/student/quiz/TabWarning";
import QuestionCard from "@/components/student/quiz/QuestionCard";
import { Card } from "@/components/ui/card";
import { useStudentQuiz } from "@/hooks/useStudentQuiz";

export default function StudentQuizPage() {
  const quizState = useStudentQuiz();

  if (quizState.isLoading) {
    return (
      <PageShell>
        <div className="flex min-h-screen items-center justify-center px-4">
          <div className="inline-flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-slate-200 backdrop-blur-md">
            <Loader2 className="h-5 w-5 animate-spin text-violet-300" />
            Loading quiz...
          </div>
        </div>
      </PageShell>
    );
  }

  // waiting approval screen
  if (quizState.session?.approvalStatus === "pending") {
    return (
      <PageShell>
        <div className="flex min-h-screen items-center justify-center px-4">
          <Card className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 text-center backdrop-blur-xl">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-yellow-400/20 bg-yellow-500/10 text-yellow-300">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>

            <h1 className="bg-gradient-to-r from-violet-300 via-fuchsia-300 to-cyan-300 bg-clip-text text-3xl font-extrabold text-transparent">
              Waiting for Approval
            </h1>

            <p className="mt-3 text-sm leading-6 text-slate-300">
              Your teacher has not approved your request yet.
            </p>

            <p className="mt-2 text-xs text-slate-500">
              This page refreshes automatically.
            </p>
          </Card>
        </div>
      </PageShell>
    );
  }

  // rejected screen
  if (quizState.session?.approvalStatus === "rejected") {
    return (
      <PageShell>
        <div className="flex min-h-screen items-center justify-center px-4">
          <Card className="w-full max-w-md rounded-3xl border border-red-400/20 bg-red-500/10 p-8 text-center backdrop-blur-xl">
            <h1 className="text-3xl font-extrabold text-red-200">
              Request Rejected
            </h1>

            <p className="mt-3 text-sm leading-6 text-red-100/80">
              Your teacher rejected your request to join this quiz.
            </p>
          </Card>
        </div>
      </PageShell>
    );
  }

  if (
    !quizState.quiz ||
    !quizState.session ||
    !quizState.currentQuestion
  ) {
    return null;
  }

  return (
    <PageShell>
      <section className="mx-auto max-w-5xl px-4 py-5 sm:px-6 md:px-10 md:py-8">
        <QuizHeader
          title={quizState.quiz.title}
          studentName={quizState.session.studentName}
          currentIndex={quizState.currentIndex}
          totalQuestions={quizState.quiz.questions.length}
          progress={quizState.progress}
        />

        <TabWarning tabWarnings={quizState.tabWarnings} />

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
      </section>
    </PageShell>
  );
}