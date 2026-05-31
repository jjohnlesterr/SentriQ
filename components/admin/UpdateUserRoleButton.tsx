"use client";

import { useTransition } from "react";
import { ShieldCheck, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { updateUserRoleAction } from "@/lib/actions/admin.actions";

type UpdateUserRoleButtonProps = {
  userId: string;
  currentRole: string;
  email: string;
};

export default function UpdateUserRoleButton({
  userId,
  currentRole,
  email,
}: UpdateUserRoleButtonProps) {
  const [isPending, startTransition] = useTransition();

  const nextRole = currentRole === "admin" ? "teacher" : "admin";

  function handleUpdateRole() {
    const confirmed = window.confirm(
      `Are you sure you want to make ${email} a ${nextRole}?`,
    );

    if (!confirmed) return;

    startTransition(async () => {
      await updateUserRoleAction(userId, nextRole);
    });
  }

  return (
    <Button
      type="button"
      variant="secondary"
      onClick={handleUpdateRole}
      disabled={isPending}
    >
      {nextRole === "admin" ? (
        <ShieldCheck className="h-4 w-4" />
      ) : (
        <User className="h-4 w-4" />
      )}

      {isPending
        ? "Updating..."
        : nextRole === "admin"
          ? "Make Admin"
          : "Make Teacher"}
    </Button>
  );
}