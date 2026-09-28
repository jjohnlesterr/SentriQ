"use client";

import { useEffect } from "react";

import StudentJoinForm from "@/components/student/join/StudentJoinForm";
import TeacherLoginForm from "@/components/teacher/login/TeacherLoginForm";
import TeacherRegisterForm from "@/components/teacher/register/TeacherRegisterForm";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useAuthModal } from "@/store/useAuthModal";

type AuthModalAction = "signup" | "login" | "quiz";

const modalTitles: Record<AuthModalAction, string> = {
  login: "Log in",
  signup: "Create a teacher account",
  quiz: "Join a quiz",
};

export default function AuthModalManager() {
  const { type, isOpen, open, close } = useAuthModal();

  // Legacy entry point: some components open modals via a window event.
  useEffect(() => {
    const handler = (e: Event) => {
      const action = (e as CustomEvent<AuthModalAction>).detail;

      if (action === "signup" || action === "login" || action === "quiz") {
        open(action);
      }
    };

    window.addEventListener("open-auth-modal", handler);

    return () => {
      window.removeEventListener("open-auth-modal", handler);
    };
  }, [open]);

  return (
    <Dialog open={isOpen} onOpenChange={(next) => !next && close()}>
      <DialogContent className="max-w-md p-6 sm:p-8" aria-describedby={undefined}>
        {type && <DialogTitle className="sr-only">{modalTitles[type]}</DialogTitle>}

        {type === "login" && (
          <TeacherLoginForm onSuccess={close} onSwitchToSignup={() => open("signup")} />
        )}

        {type === "signup" && (
          <TeacherRegisterForm onSuccess={close} onSwitchToLogin={() => open("login")} />
        )}

        {type === "quiz" && <StudentJoinForm onApproved={close} />}
      </DialogContent>
    </Dialog>
  );
}
