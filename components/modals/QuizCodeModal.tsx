"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import StudentJoinForm from "@/components/student/join/StudentJoinForm";

export default function QuizCodeModal({
  onClose,
}: {
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {/* BACKDROP */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="
          fixed inset-0 z-50
          flex items-center justify-center
          bg-black/40 backdrop-blur-md
        "
      >
        {/* CLICK OUTSIDE */}
        <div className="absolute inset-0" onClick={onClose} />

        {/* MODAL CARD */}
        <motion.div
          initial={{ scale: 0.96, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.96, opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="relative w-full max-w-lg px-4"
        >
          {/* X BUTTON */}
          <button
            onClick={onClose}
            className="
              absolute right-6 top-6 z-10
              rounded-full bg-white/10 p-2
              text-slate-200 hover:bg-white/20
              transition
            "
          >
            <X className="h-5 w-5" />
          </button>

          {/* GLASS CARD */}
          <div
            className="
              rounded-3xl
              border border-white/10
              bg-[#0b0f1a]
              shadow-[0_20px_80px_rgba(0,0,0,0.6)]
              p-6 sm:p-8
              overflow-visible
            "
          >
            <StudentJoinForm />
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}