"use client";

import { useState, useTransition } from "react";
import { Trash2 } from "lucide-react";

import ConfirmDialog from "@/components/shared/ConfirmDialog";
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
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    startTransition(async () => {
      await deleteSessionAction(sessionId);
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
        className="border-red-500/30 bg-red-500/10 text-red-200 hover:bg-red-500/20"
      >
        <Trash2 className="h-4 w-4" />
        {isPending ? "Deleting..." : "Delete"}
      </Button>

      <ConfirmDialog
        open={open}
        title="Delete session?"
        description={`This will delete the session for ${studentName} and remove its activity logs. This action cannot be undone.`}
        confirmText="Delete Session"
        loadingText="Deleting..."
        confirmVariant="destructive"
        isLoading={isPending}
        onOpenChange={setOpen}
        onConfirm={handleDelete}
      />
    </>
  );
}
