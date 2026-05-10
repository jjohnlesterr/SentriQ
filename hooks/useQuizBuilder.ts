"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { getQuizById, publishQuiz, updateQuiz } from "@/lib/actions";
import {
  createEmptyQuestion,
  getQuestionTypeDefaults,
  isQuestionComplete,
} from "@/lib/quiz-builder";
import type { Question, QuestionType, Quiz } from "@/lib/types";

export function useQuizBuilder() {
  const router = useRouter();
  const params = useParams();
  const quizId = params.id as string;

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [activeQuestion, setActiveQuestion] = useState(0);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [showCodeDialog, setShowCodeDialog] = useState(false);

  useEffect(() => {
    async function loadQuiz() {
      try {
        const data = await getQuizById(quizId);

        if (!data) {
          router.push("/teacher/dashboard");
          return;
        }

        setQuiz(data);
        setTitle(data.title);
        setDescription(data.description);
        setQuestions(
          data.questions.map((question) => ({
            ...question,
            type: question.type || "multiple_choice",
            correctTextAnswer: question.correctTextAnswer || "",
          }))
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadQuiz();
  }, [quizId, router]);

  const currentQuestion = questions[activeQuestion];
  const canAddQuestion = isQuestionComplete(currentQuestion);

  async function handleSaveQuiz() {
    if (!title.trim()) {
      alert("Quiz title is required.");
      return;
    }

    setIsSaving(true);

    try {
      const updated = await updateQuiz(quizId, title, description, questions);
      setQuiz(updated);
      alert("Draft saved successfully.");
    } catch {
      alert("Failed to save draft.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handlePublishQuiz() {
    if (!title.trim()) {
      alert("Quiz title is required.");
      return;
    }

    if (questions.length === 0) {
      alert("Add at least one question before publishing.");
      return;
    }

    const incompleteQuestionIndex = questions.findIndex(
      (question) => !isQuestionComplete(question)
    );

    if (incompleteQuestionIndex !== -1) {
      setActiveQuestion(incompleteQuestionIndex);
      alert(`Please complete Question ${incompleteQuestionIndex + 1}.`);
      return;
    }

    setIsPublishing(true);

    try {
      await updateQuiz(quizId, title, description, questions);
      const published = await publishQuiz(quizId);

      setQuiz(published);
      setShowCodeDialog(true);
    } catch {
      alert("Failed to publish quiz.");
    } finally {
      setIsPublishing(false);
    }
  }

  function addQuestion() {
    if (!canAddQuestion) {
      alert("Please complete the current question before adding another one.");
      return;
    }

    const newQuestion = createEmptyQuestion();

    setQuestions((prev) => {
      setActiveQuestion(prev.length);
      return [...prev, newQuestion];
    });
  }

  function updateQuestion(index: number, updates: Partial<Question>) {
    setQuestions((prev) =>
      prev.map((question, questionIndex) =>
        questionIndex === index
          ? {
              ...question,
              ...updates,
            }
          : question
      )
    );
  }

  function handleChangeQuestionType(index: number, type: QuestionType) {
    const current = questions[index];

    if (!current) return;

    updateQuestion(index, getQuestionTypeDefaults(current, type));
  }

  function updateOption(
    questionIndex: number,
    optionIndex: number,
    value: string
  ) {
    setQuestions((prev) =>
      prev.map((question, index) => {
        if (index !== questionIndex) return question;

        return {
          ...question,
          options: question.options.map((option, currentOptionIndex) =>
            currentOptionIndex === optionIndex ? value : option
          ),
        };
      })
    );
  }

  function removeQuestion(index: number) {
    setQuestions((prev) => {
      const updated = prev.filter(
        (_, questionIndex) => questionIndex !== index
      );

      setActiveQuestion((current) => {
        if (updated.length === 0) return 0;
        if (current >= updated.length) return updated.length - 1;
        if (index <= current) return Math.max(0, current - 1);
        return current;
      });

      return updated;
    });
  }

  function moveQuestionUp(index: number) {
    if (index <= 0) return;

    setQuestions((prev) => {
      const updated = [...prev];
      const current = updated[index];
      const previous = updated[index - 1];

      updated[index - 1] = current;
      updated[index] = previous;

      return updated;
    });

    setActiveQuestion(index - 1);
  }

  function moveQuestionDown(index: number) {
    if (index >= questions.length - 1) return;

    setQuestions((prev) => {
      const updated = [...prev];
      const current = updated[index];
      const next = updated[index + 1];

      updated[index + 1] = current;
      updated[index] = next;

      return updated;
    });

    setActiveQuestion(index + 1);
  }

  function duplicateQuestion(index: number) {
    const question = questions[index];

    if (!question) return;

    const duplicate: Question = {
      ...question,
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      text: question.text ? `${question.text} (Copy)` : "",
      options: [...question.options],
    };

    setQuestions((prev) => {
      const updated = [...prev];
      updated.splice(index + 1, 0, duplicate);
      return updated;
    });

    setActiveQuestion(index + 1);
  }

  function addOption(questionIndex: number) {
    setQuestions((prev) =>
      prev.map((question, index) => {
        if (index !== questionIndex) return question;

        return {
          ...question,
          options: [...question.options, ""],
        };
      })
    );
  }

  function removeOption(questionIndex: number, optionIndex: number) {
    setQuestions((prev) =>
      prev.map((question, index) => {
        if (index !== questionIndex) return question;
        if (question.options.length <= 2) return question;

        const updatedOptions = question.options.filter(
          (_, currentOptionIndex) => currentOptionIndex !== optionIndex
        );

        const updatedCorrectAnswer =
          question.correctAnswer >= updatedOptions.length
            ? updatedOptions.length - 1
            : question.correctAnswer;

        return {
          ...question,
          options: updatedOptions,
          correctAnswer: updatedCorrectAnswer,
        };
      })
    );
  }

  async function handleCopyCode() {
    if (!quiz?.code) return;

    await navigator.clipboard.writeText(quiz.code);
    alert("Quiz code copied.");
  }

  function goBack() {
    router.push("/teacher/dashboard");
  }

  function goToMonitor() {
    router.push(`/teacher/quiz/${quizId}/monitor`);
  }

  return {
    quiz,
    title,
    description,
    questions,
    activeQuestion,
    currentQuestion,
    canAddQuestion,

    isLoading,
    isSaving,
    isPublishing,
    showCodeDialog,

    setTitle,
    setDescription,
    setActiveQuestion,
    setShowCodeDialog,

    handleSaveQuiz,
    handlePublishQuiz,
    addQuestion,
    updateQuestion,
    handleChangeQuestionType,
    updateOption,
    removeQuestion,
    moveQuestionUp,
    moveQuestionDown,
    duplicateQuestion,
    addOption,
    removeOption,
    handleCopyCode,
    goBack,
    goToMonitor,
  };
}