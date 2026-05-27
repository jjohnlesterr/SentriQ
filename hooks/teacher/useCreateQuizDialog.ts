"use client";

import { useState } from "react";
import { toast } from "@/hooks/useToast";

type CreateQuizHandler = (title: string, description: string) => Promise<void>;

function getErrorMessage(error: unknown, fallback: string) {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
}

function validateCreateQuiz(title: string, description: string) {
  const cleanTitle = title.trim();
  const cleanDescription = description.trim();

  if (!cleanTitle) {
    return "Quiz title is required.";
  }

  if (!/[a-zA-Z]/.test(cleanTitle)) {
    return "Quiz title must contain at least one letter.";
  }

  if (cleanDescription && !/[a-zA-Z]/.test(cleanDescription)) {
    return "Quiz description cannot contain numbers only.";
  }

  return null;
}

export function useCreateQuizDialog(onCreate: CreateQuizHandler) {
  const [open, setOpen] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [isCreating, setIsCreating] = useState(false);

  async function handleCreateQuiz() {
    const validationError = validateCreateQuiz(title, description);

    if (validationError) {
      toast({
        title: validationError,
        variant: "destructive",
      });
      return;
    }

    setIsCreating(true);

    try {
      await onCreate(title.trim(), description.trim());

      toast({
        title: "Quiz created successfully.",
      });

      setTitle("");
      setDescription("");
      setOpen(false);
    } catch (error) {
      toast({
        title: getErrorMessage(error, "Failed to create quiz."),
        variant: "destructive",
      });
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
