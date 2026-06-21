"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { useAuthModal } from "@/store/useAuthModal";
import LoginModal from "./LoginModal";
import SignUpModal from "./SignUpModal";
import QuizCodeModal from "./QuizCodeModal";

type AuthModalAction = "signup" | "login" | "quiz";

export default function AuthModalManager() {
  const { type, isOpen, open, close } = useAuthModal();

  useEffect(() => {
    const handler = (e: Event) => {
      const customEvent = e as CustomEvent<AuthModalAction>;
      const action = customEvent.detail;

      if (action === "signup") open("signup");
      if (action === "login") open("login");
      if (action === "quiz") open("quiz");
    };

    window.addEventListener("open-auth-modal", handler);

    return () => {
      window.removeEventListener("open-auth-modal", handler);
    };
  }, [open]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* BACKDROP */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-md"
            onClick={close}
          />

          {/* MODAL LAYER */}
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <AnimatePresence mode="wait">
              {type === "login" && <LoginModal onClose={close} />}
              {type === "signup" && <SignUpModal onClose={close} />}
              {type === "quiz" && <QuizCodeModal onClose={close} />}
            </AnimatePresence>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}