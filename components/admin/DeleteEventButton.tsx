"use client";

import { useState, useTransition } from "react";
import { Trash2 } from "lucide-react";

import ConfirmDialog from "@/components/shared/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { deleteEventAction } from "@/lib/actions/admin.actions";

type DeleteEventButtonProps = {
  eventId: string;
};

export default function DeleteEventButton({ eventId }: DeleteEventButtonProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    startTransition(async () => {
      await deleteEventAction(eventId);
      setOpen(false);
    });
  }

  return (
    <>
      <Button
        type="button"
        size="sm"
        variant="secondary"
        onClick={() => setOpen(true)}
        disabled={isPending}
        className="border-red-500/30 bg-red-500/10 text-red-200 hover:bg-red-500/20"
      >
        <Trash2 className="h-4 w-4" />
        {isPending ? "..." : "Delete"}
      </Button>

      <ConfirmDialog
        open={open}
        title="Delete activity log?"
        description="This activity log will be permanently deleted. This action cannot be undone."
        confirmText="Delete Log"
        loadingText="Deleting..."
        confirmVariant="destructive"
        isLoading={isPending}
        onOpenChange={setOpen}
        onConfirm={handleDelete}
      />
    </>
  );
}
