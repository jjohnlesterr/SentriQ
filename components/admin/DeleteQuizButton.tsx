"use client";

import { useState, useTransition } from "react";
import { Trash2 } from "lucide-react";

import ConfirmDialog from "@/components/shared/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { deleteQuizAction } from "@/lib/actions/admin.actions";

type DeleteQuizButtonProps = {
  quizId: string;
  quizTitle?: string;
};

export default function DeleteQuizButton({
  quizId,
  quizTitle = "this quiz",
}: DeleteQuizButtonProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    startTransition(async () => {
      await deleteQuizAction(quizId);
      setOpen(false);
    });
  }

  return (
    <>
      <Button
        type="button"
        variant="secondary"
        onClick={() => setOpen(true)}
        disabled={isPending}
        className="h-10 w-[105px] border-red-500/30 bg-red-500/10 text-red-200 hover:bg-red-500/20"
      >
        <Trash2 className="h-4 w-4" />
        {isPending ? "..." : "Delete"}
      </Button>

      <ConfirmDialog
        open={open}
        title="Delete quiz?"
        description={`This will permanently delete "${quizTitle}". This action cannot be undone.`}
        confirmText="Delete Quiz"
        loadingText="Deleting..."
        confirmVariant="destructive"
        isLoading={isPending}
        onOpenChange={setOpen}
        onConfirm={handleDelete}
      />
    </>
  );
}
