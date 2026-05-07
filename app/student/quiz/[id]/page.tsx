"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  getSessionById,
  getQuizById,
  updateSessionAnswer,
  recordTabSwitch,
  completeSession,
} from "@/lib/actions";
import { QuizSession, Quiz } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

export default function StudentQuizPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const sessionId = params.id as string;

  const [session, setSession] = useState<QuizSession | null>(null);
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentQ, setCurrentQ] = useState(0);
  const [hasLeftTab, setHasLeftTab] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadQuiz();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && session) {
        recordTabSwitch(sessionId);
        setHasLeftTab(true);
      }
    };

    const handleBlur = () => {
      if (session) {
        recordTabSwitch(sessionId);
        setHasLeftTab(true);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleBlur);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleBlur);
    };
  }, [session, sessionId]);

  const loadQuiz = async () => {
    try {
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
      setCurrentQ(sessionData.currentQuestion);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load quiz",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswerSelect = async (optionIndex: number) => {
    if (!session) return;

    try {
      await updateSessionAnswer(sessionId, currentQ, optionIndex);
      const updated = { ...session };
      updated.answers[currentQ] = optionIndex;
      setSession(updated);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save answer",
        variant: "destructive",
      });
    }
  };

  const handleNext = () => {
    if (quiz && currentQ < quiz.questions.length - 1) {
      setCurrentQ(currentQ + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQ > 0) {
      setCurrentQ(currentQ - 1);
    }
  };

  const handleSubmit = async () => {
    if (!quiz || !session) return;

    setIsSubmitting(true);
    try {
      const completed = await completeSession(sessionId);
      sessionStorage.setItem("score", completed.score?.toString() || "0");
      sessionStorage.setItem("totalQuestions", quiz.questions.length.toString());
      router.push(`/student/results/${sessionId}`);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit quiz",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#f7fafc] px-4 py-6">
        <div className="flex min-h-screen items-center justify-center">
          <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-6 py-4 text-slate-600 shadow-sm">
            <Loader2 className="h-5 w-5 animate-spin" />
            Loading quiz...
          </div>
        </div>
      </main>
    );
  }

  if (!session || !quiz) {
    return (
      <main className="min-h-screen bg-[#f7fafc] px-4 py-6">
        <div className="flex min-h-screen items-center justify-center">
          <div className="rounded-xl border border-red-200 bg-white px-6 py-4 text-red-600 shadow-sm">
            Error loading quiz
          </div>
        </div>
      </main>
    );
  }

  const question = quiz.questions[currentQ];
  const progress = ((currentQ + 1) / quiz.questions.length) * 100;

  return (
    <main className="min-h-screen bg-[#f7fafc]">
      <div className="mx-auto flex min-h-screen max-w-3xl flex-col px-4 py-5 sm:px-6">
        <div className="mb-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">{quiz.title}</h1>
              <p className="mt-1 text-base text-slate-500">
                Student: {session.studentName}
              </p>
            </div>

            <div className="text-right">
              <p className="text-sm text-slate-400">Question</p>
              <p className="text-4xl font-bold leading-none text-slate-900">
                {currentQ + 1}/{quiz.questions.length}
              </p>
            </div>
          </div>

          <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-slate-200">
            <div
              className="h-full rounded-full bg-blue-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {hasLeftTab && (
          <Alert className="mb-4 rounded-xl border border-red-200 bg-red-50 text-red-700">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Warning: Tab switches detected. Your instructor is monitoring this
              session.
            </AlertDescription>
          </Alert>
        )}

        <div className="flex flex-1 items-center justify-center">
          <Card className="w-full rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="mb-8 text-3xl font-bold leading-tight text-slate-900">
              {question.text}
            </h2>

            <RadioGroup
              value={session.answers[currentQ]?.toString() || ""}
              onValueChange={(value) => handleAnswerSelect(parseInt(value))}
            >
              <div className="space-y-4">
                {question.options.map((option, index) => {
                  const selected = session.answers[currentQ] === index;

                  return (
                    <label
                      key={index}
                      htmlFor={`option-${index}`}
                      className={`flex cursor-pointer items-center gap-4 rounded-xl border px-4 py-4 transition ${
                        selected
                          ? "border-blue-500 bg-blue-50"
                          : "border-slate-200 bg-white hover:bg-slate-50"
                      }`}
                    >
                      <RadioGroupItem
                        value={index.toString()}
                        id={`option-${index}`}
                        className="border-slate-400 text-blue-600"
                      />
                      <span className="text-base text-slate-800">{option}</span>
                    </label>
                  );
                })}
              </div>
            </RadioGroup>
          </Card>
        </div>

        <div className="mt-6 flex items-center justify-between gap-4">
          <Button
            onClick={handlePrevious}
            disabled={currentQ === 0}
            variant="secondary"
            className="min-w-[120px] rounded-lg border-slate-300 bg-slate-200 text-slate-600 hover:bg-slate-300 disabled:opacity-60"
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>

          {currentQ === quiz.questions.length - 1 ? (
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="min-w-[150px] rounded-lg bg-blue-600 text-white hover:bg-blue-700"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Quiz"
              )}
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              className="min-w-[140px] rounded-lg bg-blue-600 text-white hover:bg-blue-700"
            >
              Next
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </main>
  );
}