"use client";

import type { ReactNode } from "react";

import { Button, type ButtonProps } from "@/components/ui/button";
import { useAuthModal } from "@/store/useAuthModal";

type Props = Omit<ButtonProps, "onClick" | "type"> & {
  modal: "login" | "signup" | "quiz";
  children: ReactNode;
};

// Small client island so marketing sections can stay server components.
export default function OpenAuthModalButton({ modal, children, ...props }: Props) {
  const { open } = useAuthModal();

  return (
    <Button type="button" onClick={() => open(modal)} {...props}>
      {children}
    </Button>
  );
}
