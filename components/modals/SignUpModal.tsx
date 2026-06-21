"use client";

import { motion } from "framer-motion";
import { X } from "lucide-react";

import TeacherRegisterForm from "@/components/teacher/register/TeacherRegisterForm";

export default function SignUpModal({
  onClose,
}: {
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
      
      <div
        className="absolute inset-0"
        onClick={onClose}
      />

      <motion.div
        initial={{ scale: 0.96, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.18 }}
        className="relative w-full max-w-lg px-4"
      >
        <button
          onClick={onClose}
          className="absolute right-10 top-8 z-10 rounded-full bg-white/10 p-2 text-slate-200 hover:bg-white/20"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="rounded-3xl border border-white/10 bg-[#0b0f1a] shadow-[0_20px_80px_rgba(0,0,0,0.6)]">
          <TeacherRegisterForm onSuccess={onClose} />
        </div>
      </motion.div>
    </div>
  );
}