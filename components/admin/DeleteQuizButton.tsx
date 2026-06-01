"use client";

import { useTransition } from "react";
import { Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { deleteQuizAction } from "@/lib/actions/admin.actions";

type DeleteQuizButtonProps = {
  quizId: string;
};

export default function DeleteQuizButton({ quizId }: DeleteQuizButtonProps) {
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    const confirmed = window.confirm(
      "Are you sure you want to delete this quiz? This action cannot be undone.",
    );

    if (!confirmed) return;

    startTransition(async () => {
      await deleteQuizAction(quizId);
    });
  }

  return (
    <Button
      type="button"
      variant="secondary"
      onClick={handleDelete}
      disabled={isPending}
      className="border-red-500/30 bg-red-500/10 text-red-200 hover:bg-red-500/20"
    >
      <Trash2 className="h-4 w-4" />
      {isPending ? "Deleting..." : "Delete"}
    </Button>
  );
}
