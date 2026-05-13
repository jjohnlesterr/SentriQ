"use client";

import {
  ArrowDown,
  ArrowUp,
  Copy,
  MoreVertical,
  Trash2,
} from "lucide-react";

import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";

type Props = {
  option: string;
  optionIndex: number;
  isCorrect: boolean;
  disabled?: boolean;
  canDelete: boolean;
  canDuplicate: boolean;
  isMenuOpen: boolean;
  onToggleMenu: () => void;
  onSelectCorrect: () => void;
  onChange: (value: string) => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  disableMoveUp?: boolean;
  disableMoveDown?: boolean;
};

export default function OptionRow({
  option,
  optionIndex,
  isCorrect,
  disabled = false,
  canDelete,
  canDuplicate,
  isMenuOpen,
  onToggleMenu,
  onSelectCorrect,
  onChange,
  onMoveUp,
  onMoveDown,
  onDuplicate,
  onDelete,
  disableMoveUp = false,
  disableMoveDown = false,
}: Props) {
  return (
    <div
      className={`relative flex min-w-0 items-center gap-3 rounded-2xl border p-3 transition ${
        isCorrect
          ? "border-emerald-400/30 bg-emerald-500/10"
          : "border-white/10 bg-white/[0.03]"
      }`}
    >
      <Checkbox
        checked={isCorrect}
        onCheckedChange={onSelectCorrect}
        className="shrink-0 cursor-pointer"
      />

      <Input
        value={option}
        onChange={(e) => onChange(e.target.value)}
        placeholder={`Option ${optionIndex + 1}`}
        disabled={disabled}
        className="h-11 min-w-0 flex-1 rounded-xl border-white/10 bg-slate-950/40 px-3 text-sm"
      />

      <div className="relative">
        <button
          type="button"
          aria-label={`Open option ${optionIndex + 1} menu`}
          onClick={onToggleMenu}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-slate-400 transition hover:bg-white/10 hover:text-white"
        >
          <MoreVertical className="h-5 w-5" />
        </button>

        {isMenuOpen && (
          <div className="absolute right-0 top-11 z-30 w-44 overflow-hidden rounded-2xl border border-white/10 bg-slate-950/95 p-1 shadow-2xl backdrop-blur-xl">
            <button
              type="button"
              disabled={disableMoveUp}
              onClick={onMoveUp}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm text-slate-300 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ArrowUp className="h-4 w-4" />
              Move Up
            </button>

            <button
              type="button"
              disabled={disableMoveDown}
              onClick={onMoveDown}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm text-slate-300 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ArrowDown className="h-4 w-4" />
              Move Down
            </button>

            <button
              type="button"
              disabled={!canDuplicate}
              onClick={onDuplicate}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm text-slate-300 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Copy className="h-4 w-4" />
              Duplicate
            </button>

            <div className="my-1 h-px bg-white/10" />

            <button
              type="button"
              disabled={!canDelete}
              onClick={onDelete}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm text-red-300 transition hover:bg-red-500/10 hover:text-red-200 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}