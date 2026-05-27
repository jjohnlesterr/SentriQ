"use client";

import { useEffect, useMemo, useState } from "react";
import { Clock, Infinity, Minus, Plus, X } from "lucide-react";

import { Button } from "@/components/ui/button";

type Props = {
  open: boolean;
  value: number | null;
  onOpenChange: (open: boolean) => void;
  onApply: (minutes: number | null) => void;
};

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function formatDuration(totalMinutes: number) {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours > 0 && minutes > 0) return `${hours} hour ${minutes} minutes`;
  if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""}`;
  return `${minutes} minutes`;
}

export default function QuizTimerDialog({
  open,
  value,
  onOpenChange,
  onApply,
}: Props) {
  const [enabled, setEnabled] = useState(Boolean(value));
  const [hours, setHours] = useState(value ? Math.floor(value / 60) : 1);
  const [minutes, setMinutes] = useState(value ? value % 60 : 30);

  useEffect(() => {
    if (!open) return;

    setEnabled(Boolean(value));
    setHours(value ? Math.floor(value / 60) : 1);
    setMinutes(value ? value % 60 : 30);
  }, [open, value]);

  const totalMinutes = useMemo(() => {
    return clamp(hours * 60 + minutes, 1, 24 * 60);
  }, [hours, minutes]);

  if (!open) return null;

  function applyTimer() {
    onApply(enabled ? totalMinutes : null);
    onOpenChange(false);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-0 backdrop-blur-sm md:items-center md:p-4">
      <div className="w-full rounded-t-[2rem] border border-white/10 bg-[#101827]/95 p-5 shadow-2xl shadow-black/40 md:max-w-md md:rounded-3xl md:p-6">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-extrabold text-white">
              Set Quiz Timer
            </h2>
            <p className="mt-1 text-sm leading-relaxed text-slate-400">
              The quiz will auto-save and close when time runs out.
            </p>
          </div>

          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="rounded-2xl bg-white/5 p-2 text-slate-400 hover:bg-white/10 hover:text-white"
            aria-label="Close timer dialog"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-3">
          <button
            type="button"
            onClick={() => setEnabled(false)}
            className={
              !enabled
                ? "flex w-full items-center gap-4 rounded-2xl border border-blue-400/60 bg-blue-500/10 p-4 text-left"
                : "flex w-full items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 text-left hover:bg-white/10"
            }
          >
            <Infinity className="h-6 w-6 text-blue-300" />
            <div>
              <p className="font-semibold text-white">No timer</p>
              <p className="text-sm text-slate-400">
                Students can take the quiz without time limit.
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setEnabled(true)}
            className={
              enabled
                ? "flex w-full items-center gap-4 rounded-2xl border border-blue-400/60 bg-blue-500/10 p-4 text-left"
                : "flex w-full items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 text-left hover:bg-white/10"
            }
          >
            <Clock className="h-6 w-6 text-blue-300" />
            <div>
              <p className="font-semibold text-white">Enable timer</p>
              <p className="text-sm text-slate-400">
                Set a specific time limit for this quiz.
              </p>
            </div>
          </button>
        </div>

        {enabled && (
          <div className="mt-5 space-y-4">
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm font-medium text-slate-200">Hours</span>

              <div className="flex items-center rounded-2xl border border-white/10 bg-white/5">
                <button
                  type="button"
                  onClick={() => setHours((prev) => clamp(prev - 1, 0, 24))}
                  className="p-3 text-slate-300 hover:text-white"
                >
                  <Minus className="h-4 w-4" />
                </button>

                <span className="w-14 text-center font-semibold text-white">
                  {String(hours).padStart(2, "0")}
                </span>

                <button
                  type="button"
                  onClick={() => setHours((prev) => clamp(prev + 1, 0, 24))}
                  className="p-3 text-slate-300 hover:text-white"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between gap-4">
              <span className="text-sm font-medium text-slate-200">
                Minutes
              </span>

              <div className="flex items-center rounded-2xl border border-white/10 bg-white/5">
                <button
                  type="button"
                  onClick={() => setMinutes((prev) => clamp(prev - 5, 0, 55))}
                  className="p-3 text-slate-300 hover:text-white"
                >
                  <Minus className="h-4 w-4" />
                </button>

                <span className="w-14 text-center font-semibold text-white">
                  {String(minutes).padStart(2, "0")}
                </span>

                <button
                  type="button"
                  onClick={() => setMinutes((prev) => clamp(prev + 5, 0, 55))}
                  className="p-3 text-slate-300 hover:text-white"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-blue-300" />
                <div>
                  <p className="text-sm text-slate-400">Total Time</p>
                  <p className="font-semibold text-cyan-200">
                    {formatDuration(totalMinutes)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-6 grid gap-3 md:grid-cols-2">
          <Button
            type="button"
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className="h-12 rounded-2xl border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white"
          >
            Cancel
          </Button>

          <Button
            type="button"
            onClick={applyTimer}
            className="h-12 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-500 font-semibold text-white"
          >
            Apply Timer
          </Button>
        </div>
      </div>
    </div>
  );
}