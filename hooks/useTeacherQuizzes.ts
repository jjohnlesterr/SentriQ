"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { createQuiz, deleteQuiz, getTeacherQuizzes } from "@/lib/actions";
import type { Quiz } from "@/lib/types";

export function useTeacherQuizzes() {
  const router = useRouter();

  const [teacherId, setTeacherId] = useState<string | null>(null);
  const [teacherName, setTeacherName] = useState("Teacher");
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newQuizTitle, setNewQuizTitle] = useState("");
  const [newQuizDescription, setNewQuizDescription] = useState("");

  const publishedQuizzes = useMemo(
    () => quizzes.filter((quiz) => quiz.published),
    [quizzes]
  );

  const draftQuizzes = useMemo(
    () => quizzes.filter((quiz) => !quiz.published),
    [quizzes]
  );

  useEffect(() => {
    const storedTeacherId = sessionStorage.getItem("teacherId");
    const storedTeacherName = sessionStorage.getItem("teacherName");

    if (!storedTeacherId) {
      router.push("/teacher/login");
      return;
    }

    setTeacherId(storedTeacherId);
    setTeacherName(storedTeacherName || "Teacher");
    loadQuizzes(storedTeacherId);
  }, [router]);

  async function loadQuizzes(id = teacherId) {
    if (!id) return;

    setIsLoading(true);

    try {
      const data = await getTeacherQuizzes(id);
      setQuizzes(data);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleCreateQuiz() {
    if (!newQuizTitle.trim() || !teacherId) {
      alert("Quiz title is required.");
      return;
    }

    setIsCreating(true);

    try {
      const quiz = await createQuiz(
        newQuizTitle.trim(),
        newQuizDescription.trim(),
        teacherId
      );

      setQuizzes((prev) => [...prev, quiz]);
      setNewQuizTitle("");
      setNewQuizDescription("");
      setDialogOpen(false);

      router.push(`/teacher/quiz/${quiz.id}/builder`);
    } catch {
      alert("Failed to create quiz.");
    } finally {
      setIsCreating(false);
    }
  }

  async function handleDeleteQuiz(quizId: string) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this quiz? This will also delete its sessions."
    );

    if (!confirmed) return;

    try {
      await deleteQuiz(quizId);
      setQuizzes((prev) => prev.filter((quiz) => quiz.id !== quizId));
    } catch {
      alert("Failed to delete quiz.");
    }
  }

  function handleLogout() {
    sessionStorage.removeItem("teacherId");
    sessionStorage.removeItem("teacherName");
    router.push("/");
  }

  function openCreateDialog() {
    setDialogOpen(true);
  }

  function closeCreateDialog() {
    setDialogOpen(false);
  }

  return {
    teacherId,
    teacherName,
    quizzes,
    publishedQuizzes,
    draftQuizzes,
    isLoading,

    dialogOpen,
    setDialogOpen,
    openCreateDialog,
    closeCreateDialog,

    isCreating,
    newQuizTitle,
    newQuizDescription,
    setNewQuizTitle,
    setNewQuizDescription,

    loadQuizzes,
    handleCreateQuiz,
    handleDeleteQuiz,
    handleLogout,
  };
}