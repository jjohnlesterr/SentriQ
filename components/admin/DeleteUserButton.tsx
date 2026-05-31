"use client";

import { useTransition } from "react";
import { Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { deleteUserAction } from "@/lib/actions/admin.actions";

type DeleteUserButtonProps = {
  userId: string;
  email: string;
};

export default function DeleteUserButton({
  userId,
  email,
}: DeleteUserButtonProps) {
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    const confirmed = window.confirm(
      `Are you sure you want to permanently delete ${email}? This will remove the Supabase Auth account too.`,
    );

    if (!confirmed) return;

    startTransition(async () => {
      await deleteUserAction(userId);
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