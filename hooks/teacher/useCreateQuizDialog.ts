"use client";

import { useState } from "react";

type CreateQuizHandler = (title: string, description: string) => Promise<void>;

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
    } catch {
      alert("Failed to create quiz.");
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