"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { useOptionActions } from "./useOptionActions";
import { useQuestionActions } from "./useQuestionActions";
import { useQuizPersistence } from "./useQuizPersistence";
import { useQuizPublish } from "./useQuizPublish";

function getErrorMessage(error: unknown, fallback: string) {
  if (error instanceof Error && error.message) {
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
      setSaveError(
        getErrorMessage(error, "Failed to save draft. Please try again."),
      );
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
      setSaveError(
        getErrorMessage(error, "Failed to publish quiz. Please try again."),
      );
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
    activeQuestion,

    isLoading: persistence.isLoading,
    isDirty: persistence.isDirty,
    isSaving,
    isPublishing,
    showCodeDialog,
    saveError,

    setTitle: persistence.setTitle,
    setDescription: persistence.setDescription,
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