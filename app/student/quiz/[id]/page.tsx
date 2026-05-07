"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import PageShell from "@/components/layout/PageShell";

import QuizHeader from "@/components/student/quiz/QuizHeader";
import TabWarning from "@/components/student/quiz/TabWarning";
import QuestionCard from "@/components/student/quiz/QuestionCard";

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

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [session, setSession] = useState<QuizSession | null>(null);

  const [currentIndex, setCurrentIndex] = useState(0);

  const [answers, setAnswers] = useState<
    Record<number, number | string>
  >({});

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [tabWarnings, setTabWarnings] = useState(0);

  useEffect(() => {
    async function loadQuizSession() {
      try {
        const sessionData = await getSessionById(sessionId);

        if (!sessionData) {
          router.push("/");
          return;
        }

        const quizData = await getQuizById(sessionData.quizId);

        if (!quizData) {
          router.push("/");
          return;
        }

        setSession(sessionData);
        setQuiz(quizData);

        setAnswers(sessionData.answers || {});
        setCurrentIndex(sessionData.currentQuestion || 0);
        setTabWarnings(sessionData.tabSwitches || 0);
      } finally {
        setIsLoading(false);
      }
    }

    loadQuizSession();
  }, [sessionId, router]);

  useEffect(() => {
    function handleVisibilityChange() {
      if (document.hidden) {
        setTabWarnings((prev) => prev + 1);

        recordTabSwitch(sessionId);
      }
    }

    document.addEventListener(
      "visibilitychange",
      handleVisibilityChange
    );

    return () => {
      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange
      );
    };
  }, [sessionId]);

  async function handleAnswer(answer: number | string) {
    const updatedAnswers = {
      ...answers,
      [currentIndex]: answer,
    };

    setAnswers(updatedAnswers);

    await updateSessionAnswer(
      sessionId,
      currentIndex,
      answer
    );
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
    if (!quiz || !session) return;

    setIsSubmitting(true);

    try {
      let score = 0;

      quiz.questions.forEach((question, index) => {
        const answer = answers[index];

        if (question.type === "identification") {
          if (
            typeof answer === "string" &&
            answer.trim().toLowerCase() ===
              question.correctTextAnswer
                ?.trim()
                .toLowerCase()
          ) {
            score++;
          }
        } else {
          if (answer === question.correctAnswer) {
            score++;
          }
        }
      });

      await completeSession(sessionId, score);

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

  const progress = Math.round(
    ((currentIndex + 1) / quiz.questions.length) * 100
  );

  const isCurrentAnswered =
    selectedAnswer !== undefined &&
    selectedAnswer !== "";

  return (
    <PageShell>
      <section className="mx-auto max-w-5xl px-6 py-8 md:px-10">
        <QuizHeader
          title={quiz.title}
          studentName={session.studentName}
          currentIndex={currentIndex}
          totalQuestions={quiz.questions.length}
          progress={progress}
        />

        <TabWarning tabWarnings={tabWarnings} />

        <QuestionCard
          question={currentQuestion}
          currentIndex={currentIndex}
          totalQuestions={quiz.questions.length}
          selectedAnswer={selectedAnswer}
          answeredCount={answeredCount}
          isCurrentAnswered={isCurrentAnswered}
          isSubmitting={isSubmitting}
          onAnswer={handleAnswer}
          onPrevious={goPrevious}
          onNext={goNext}
          onSubmit={handleSubmit}
        />
      </section>
    </PageShell>
  );
}