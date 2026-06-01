"use client";

import { useTransition } from "react";
import { Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { deleteEventAction } from "@/lib/actions/admin.actions";

type DeleteEventButtonProps = {
  eventId: string;
};

export default function DeleteEventButton({ eventId }: DeleteEventButtonProps) {
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    const confirmed = window.confirm("Delete this activity log?");

    if (!confirmed) return;

    startTransition(async () => {
      await deleteEventAction(eventId);
    });
  }

  return (
    <Button
      type="button"
      size="sm"
      variant="secondary"
      onClick={handleDelete}
      disabled={isPending}
      className="border-red-500/30 bg-red-500/10 text-red-200 hover:bg-red-500/20"
    >
      <Trash2 className="h-4 w-4" />
      {isPending ? "..." : "Delete"}
    </Button>
  );
}
