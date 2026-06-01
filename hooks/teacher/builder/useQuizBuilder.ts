"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

import { useOptionActions } from "./useOptionActions";
import { useQuestionActions } from "./useQuestionActions";
import { useQuizPersistence } from "./useQuizPersistence";
import { useQuizPublish } from "./useQuizPublish";

function getErrorMessage(error: unknown, fallback: string) {
  if (Array.isArray(error)) {
    return error[0]?.message || fallback;
  }

  if (error instanceof Error && error.message) {
    try {
      const parsed = JSON.parse(error.message);

      if (Array.isArray(parsed)) {
        return parsed[0]?.message || fallback;
      }

      if (parsed?.message) {
        return parsed.message;
      }
    } catch {
      return error.message;
    }
  }

  if (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof error.message === "string"
  ) {
    return error.message;
  }

  return fallback;
}

export function useQuizBuilder() {
  const router = useRouter();
  const params = useParams();
  const quizId = params.id as string;

  const persistence = useQuizPersistence({ quizId });

  const [activeQuestion, setActiveQuestion] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [showCodeDialog, setShowCodeDialog] = useState(false);
  const [saveError, setSaveError] = useState("");

  const questionActions = useQuestionActions({
    questions: persistence.questions,
    activeQuestion,
    setQuestions: persistence.setQuestions,
    setActiveQuestion,
  });

  const optionActions = useOptionActions({
    questions: persistence.questions,
    setQuestions: persistence.setQuestions,
  });

  const publish = useQuizPublish({
    quizId,
    quiz: persistence.quiz,
    title: persistence.title,
    description: persistence.description,
    questions: persistence.questions,
    timeLimitMinutes: persistence.timeLimitMinutes,
    setQuiz: persistence.setQuiz,
    setActiveQuestion,
    refreshTeacherQuizzes: persistence.refreshTeacherQuizzes,
  });

  async function saveDraftOnly() {
    setSaveError("");

    if (!publish.validateQuizBeforeSave()) return false;

    setIsSaving(true);

    try {
      await publish.saveQuiz();
      persistence.markClean();
      return true;
    } catch (error) {
      const message = getErrorMessage(
        error,
        "Failed to save draft. Please try again.",
      );

      setSaveError(message);
      toast.error(message);

      return false;
    } finally {
      setIsSaving(false);
    }
  }

  async function handleSaveQuiz() {
    const saved = await saveDraftOnly();

    if (saved) {
      router.push("/teacher/dashboard");
    }
  }

  async function handlePublishQuiz() {
    setSaveError("");

    if (!publish.validateQuizBeforePublish()) return;

    setIsPublishing(true);

    try {
      await publish.publishCurrentQuiz();
      persistence.markClean();
      setShowCodeDialog(true);
    } catch (error) {
      const message = getErrorMessage(
        error,
        "Failed to publish quiz. Please try again.",
      );

      setSaveError(message);
      toast.error(message);
    } finally {
      setIsPublishing(false);
    }
  }

  function clearSaveError() {
    setSaveError("");
  }

  function goBack() {
    router.push("/teacher/dashboard");
  }

  function goToMonitor() {
    router.push(`/teacher/quiz/${quizId}/monitor`);
  }

  return {
    quiz: persistence.quiz,
    quizzes: persistence.quizzes,

    title: persistence.title,
    description: persistence.description,
    questions: persistence.questions,
    timeLimitMinutes: persistence.timeLimitMinutes,
    activeQuestion,

    isLoading: persistence.isLoading,
    isDirty: persistence.isDirty,
    isFreshlyCreatedDraft: persistence.isFreshlyCreatedDraft,
    isSaving,
    isPublishing,
    showCodeDialog,
    saveError,

    setTitle: persistence.setTitle,
    setDescription: persistence.setDescription,
    setTimeLimitMinutes: persistence.setTimeLimitMinutes,
    setActiveQuestion,
    setShowCodeDialog,

    saveDraftOnly,
    handleSaveQuiz,
    handlePublishQuiz,
    handleCopyCode: publish.copyQuizCode,
    clearSaveError,
    goBack,
    goToMonitor,

    ...questionActions,
    ...optionActions,
  };
}