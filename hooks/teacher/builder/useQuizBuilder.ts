"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { useOptionActions } from "./useOptionActions";
import { useQuestionActions } from "./useQuestionActions";
import { useQuizPersistence } from "./useQuizPersistence";
import { useQuizPublish } from "./useQuizPublish";

export function useQuizBuilder() {
  const router = useRouter();
  const params = useParams();
  const quizId = params.id as string;

  const persistence = useQuizPersistence({ quizId });

  const [activeQuestion, setActiveQuestion] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [showCodeDialog, setShowCodeDialog] = useState(false);

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
    if (!publish.validateQuizBeforeSave()) return false;

    setIsSaving(true);

    try {
      await publish.saveQuiz();
      persistence.markClean();
      return true;
    } catch {
      alert("Failed to save draft.");
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
    if (!publish.validateQuizBeforePublish()) return;

    setIsPublishing(true);

    try {
      await publish.publishCurrentQuiz();
      persistence.markClean();
      setShowCodeDialog(true);
    } catch {
      alert("Failed to publish quiz.");
    } finally {
      setIsPublishing(false);
    }
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

    setTitle: persistence.setTitle,
    setDescription: persistence.setDescription,
    setActiveQuestion,
    setShowCodeDialog,

    saveDraftOnly,
    handleSaveQuiz,
    handlePublishQuiz,
    handleCopyCode: publish.copyQuizCode,
    goBack,
    goToMonitor,

    ...questionActions,
    ...optionActions,
  };
}