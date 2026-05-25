"use client";

import { useState } from "react";

type CreateQuizHandler = (title: string, description: string) => Promise<void>;

function getErrorMessage(error: unknown, fallback: string) {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
}

export function useCreateQuizDialog(onCreate: CreateQuizHandler) {
  const [open, setOpen] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [isCreating, setIsCreating] = useState(false);

  async function handleCreateQuiz() {
    if (!title.trim()) {
      alert("Quiz title is required.");
      return;
    }

    setIsCreating(true);

    try {
      await onCreate(title.trim(), description.trim());

      setTitle("");
      setDescription("");
      setOpen(false);
    } catch (error) {
      alert(getErrorMessage(error, "Failed to create quiz."));
    } finally {
      setIsCreating(false);
    }
  }

  return {
    open,
    setOpen,

    title,
    setTitle,

    description,
    setDescription,

    isCreating,

    handleCreateQuiz,
  };
}
