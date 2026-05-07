"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { getQuizById, publishQuiz, updateQuiz } from "@/lib/actions";
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
        })),
      );

      setIsLoading(false);
    }

    loadQuiz();
  }, [quizId, router]);

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
    const newQuestion: Question = {
      id: Date.now().toString(),
      type: "multiple_choice",
      text: "",
      options: ["", "", "", ""],
      correctAnswer: 0,
      correctTextAnswer: "",
    };

    setQuestions((prev) => [...prev, newQuestion]);
    setActiveQuestion(questions.length);
  }

  function updateQuestion(index: number, updates: Partial<Question>) {
    const updated = [...questions];

    updated[index] = {
      ...updated[index],
      ...updates,
    };

    setQuestions(updated);
  }

  function handleChangeQuestionType(index: number, type: QuestionType) {
    const current = questions[index];

    if (type === "multiple_choice") {
      updateQuestion(index, {
        type,
        options:
          current.options && current.options.length > 0
            ? current.options
            : ["", "", "", ""],
        correctAnswer: 0,
        correctTextAnswer: "",
      });

      return;
    }

    if (type === "true_false") {
      updateQuestion(index, {
        type,
        options: ["True", "False"],
        correctAnswer: 0,
        correctTextAnswer: "",
      });

      return;
    }

    updateQuestion(index, {
      type,
      options: [],
      correctAnswer: 0,
      correctTextAnswer: "",
    });
  }

  function updateOption(
    questionIndex: number,
    optionIndex: number,
    value: string,
  ) {
    const updated = [...questions];

    updated[questionIndex].options[optionIndex] = value;

    setQuestions(updated);
  }

  function removeQuestion(index: number) {
    const updated = questions.filter(
      (_, questionIndex) => questionIndex !== index,
    );

    setQuestions(updated);
    setActiveQuestion(Math.max(0, index - 1));
  }

  function addOption(questionIndex: number) {
    const updated = [...questions];

    updated[questionIndex].options.push("");

    setQuestions(updated);
  }

  function removeOption(questionIndex: number, optionIndex: number) {
    const updated = [...questions];

    if (updated[questionIndex].options.length <= 2) return;

    updated[questionIndex].options.splice(optionIndex, 1);

    if (
      updated[questionIndex].correctAnswer >=
      updated[questionIndex].options.length
    ) {
      updated[questionIndex].correctAnswer =
        updated[questionIndex].options.length - 1;
    }

    setQuestions(updated);
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

  const currentQuestion = questions[activeQuestion];

  return {
    quiz,
    title,
    description,
    questions,
    activeQuestion,
    currentQuestion,

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
    addOption,
    removeOption,
    handleCopyCode,
    goBack,
    goToMonitor,
  };
}
