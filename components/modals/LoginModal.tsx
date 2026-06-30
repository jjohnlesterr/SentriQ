"use client";

import { motion } from "framer-motion";
import { X } from "lucide-react";
import TeacherLoginForm from "@/components/teacher/login/TeacherLoginForm";

export default function LoginModal({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      initial={{ scale: 0.96, opacity: 0, y: 10 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={{ scale: 0.96, opacity: 0, y: 10 }}
      transition={{ duration: 0.18 }}
      className="relative w-full max-w-lg px-4"
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute right-7 top-4 z-10 rounded-full border border-white/10 bg-white/10 p-2 text-slate-200 transition hover:bg-white/20"
      >
        <X className="h-5 w-5" />
      </button>

      <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#0b0f1a]/95 shadow-[0_20px_80px_rgba(0,0,0,0.6)]">
        <TeacherLoginForm onSuccess={onClose} />
      </div>
    </motion.div>
  );
}