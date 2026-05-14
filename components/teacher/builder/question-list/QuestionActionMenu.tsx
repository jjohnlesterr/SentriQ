"use client";

import { ArrowDown, ArrowUp, Copy, Trash2 } from "lucide-react";

type Props = {
  index: number;
  totalQuestions: number;
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
  onDuplicate: (index: number) => void;
  onRemove: (index: number) => void;
  onClose: () => void;
};

export default function QuestionActionMenu({
  index,
  totalQuestions,
  onMoveUp,
  onMoveDown,
  onDuplicate,
  onRemove,
  onClose,
}: Props) {
  return (
    <div className="absolute right-2 top-14 z-[999] w-52 overflow-hidden rounded-2xl border border-white/10 bg-slate-950 p-2 shadow-2xl shadow-black/60 backdrop-blur-xl">
      <button
        type="button"
        onClick={() => {
          onMoveUp(index);
          onClose();
        }}
        disabled={index === 0}
        className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-slate-300 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
      >
        <ArrowUp className="h-4 w-4" />
        Move Up
      </button>

      <button
        type="button"
        onClick={() => {
          onMoveDown(index);
          onClose();
        }}
        disabled={index === totalQuestions - 1}
        className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-slate-300 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
      >
        <ArrowDown className="h-4 w-4" />
        Move Down
      </button>

      <button
        type="button"
        onClick={() => {
          onDuplicate(index);
          onClose();
        }}
        className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-slate-300 transition hover:bg-white/10 hover:text-white"
      >
        <Copy className="h-4 w-4" />
        Duplicate
      </button>

      <div className="my-1 h-px bg-white/10" />

      <button
        type="button"
        onClick={() => {
          onRemove(index);
          onClose();
        }}
        className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-red-300 transition hover:bg-red-500/10 hover:text-red-200"
      >
        <Trash2 className="h-4 w-4" />
        Delete
      </button>
    </div>
  );
}