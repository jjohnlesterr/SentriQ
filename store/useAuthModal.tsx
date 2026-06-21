"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type ModalType = "login" | "signup" | "quiz" | null;

type AuthModalContextType = {
  type: ModalType;
  isOpen: boolean;
  open: (type: ModalType) => void;
  close: () => void;
};

const AuthModalContext = createContext<AuthModalContextType | undefined>(
  undefined
);

export function AuthModalProvider({ children }: { children: ReactNode }) {
  const [type, setType] = useState<ModalType>(null);

  const isOpen = type !== null; // 🔥 FIX: derived state (IMPORTANT)

  const open = (modalType: ModalType) => {
    setType(modalType);
  };

  const close = () => {
    setType(null);
  };

  return (
    <AuthModalContext.Provider value={{ type, isOpen, open, close }}>
      {children}
    </AuthModalContext.Provider>
  );
}

export function useAuthModal() {
  const ctx = useContext(AuthModalContext);
  if (!ctx) throw new Error("useAuthModal must be used inside provider");
  return ctx;
}