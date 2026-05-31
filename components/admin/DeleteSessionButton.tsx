"use client";

import { useTransition } from "react";
import { Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { deleteSessionAction } from "@/lib/actions/admin.actions";

type DeleteSessionButtonProps = {
  sessionId: string;
  studentName: string;
};

export default function DeleteSessionButton({
  sessionId,
  studentName,
}: DeleteSessionButtonProps) {
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    const confirmed = window.confirm(
      `Are you sure you want to delete this session for ${studentName}? This will also remove its activity logs.`,
    );

    if (!confirmed) return;

    startTransition(async () => {
      await deleteSessionAction(sessionId);
    });
  }

  return (
    <Button
      type="button"
      variant="destructive"
      onClick={handleDelete}
      disabled={isPending}
    >
      <Trash2 className="h-4 w-4" />
      {isPending ? "Deleting..." : "Delete"}
    </Button>
  );
}