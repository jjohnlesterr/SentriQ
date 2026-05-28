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

    const id = requestAnimationFrame(() => {
      setEnabled(Boolean(value));
      setHours(value ? Math.floor(value / 60) : 1);
      setMinutes(value ? value % 60 : 30);
    });

    return () => cancelAnimationFrame(id);
  }, [open, value]);

  const totalMinutes = useMemo(() => {
    return clamp(hours * 60 + minutes, 1, 24 * 60);
  }, [hours, minutes]);

  if (!open) return null;

  function applyTimer() {
    onApply(enabled ? totalMinutes : null);
    onOpenChange(false);
  }

  function updateHours(value: string) {
    const parsed = Number(value);
    setHours(Number.isNaN(parsed) ? 0 : clamp(parsed, 0, 24));
  }

  function updateMinutes(value: string) {
    const parsed = Number(value);
    setMinutes(Number.isNaN(parsed) ? 0 : clamp(parsed, 0, 59));
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-3 backdrop-blur-sm sm:p-4">
      <div className="max-h-[92dvh] w-full max-w-[390px] overflow-y-auto rounded-3xl border border-white/10 bg-[#101827]/95 p-4 shadow-2xl shadow-black/40 sm:max-w-md sm:p-6">
        <div className="mb-4 flex items-start justify-between gap-4 sm:mb-5">
          <div>
            <h2 className="text-xl font-extrabold text-white sm:text-2xl">
              Set Quiz Timer
            </h2>
            <p className="mt-1 text-sm leading-relaxed text-slate-400">
              The quiz will auto-save and close when time runs out.
            </p>
          </div>

          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="shrink-0 rounded-2xl bg-white/5 p-2 text-slate-400 hover:bg-white/10 hover:text-white"
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
                ? "flex w-full items-center gap-3 rounded-2xl border border-blue-400/60 bg-blue-500/10 p-3 text-left sm:gap-4 sm:p-4"
                : "flex w-full items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-3 text-left hover:bg-white/10 sm:gap-4 sm:p-4"
            }
          >
            <Infinity className="h-5 w-5 shrink-0 text-blue-300 sm:h-6 sm:w-6" />
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
                ? "flex w-full items-center gap-3 rounded-2xl border border-blue-400/60 bg-blue-500/10 p-3 text-left sm:gap-4 sm:p-4"
                : "flex w-full items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-3 text-left hover:bg-white/10 sm:gap-4 sm:p-4"
            }
          >
            <Clock className="h-5 w-5 shrink-0 text-blue-300 sm:h-6 sm:w-6" />
            <div>
              <p className="font-semibold text-white">Enable timer</p>
              <p className="text-sm text-slate-400">
                Set a specific time limit for this quiz.
              </p>
            </div>
          </button>
        </div>

        {enabled && (
          <div className="mt-4 space-y-3 sm:mt-5 sm:space-y-4">
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm font-medium text-slate-200">Hours</span>

              <div className="flex items-center rounded-2xl border border-white/10 bg-white/5">
                <button
                  type="button"
                  onClick={() => setHours((prev) => clamp(prev - 1, 0, 24))}
                  className="p-3 text-slate-300 hover:text-white"
                  aria-label="Decrease hours"
                >
                  <Minus className="h-4 w-4" />
                </button>

                <input
                  type="number"
                  min={0}
                  max={24}
                  value={hours}
                  onChange={(event) => updateHours(event.target.value)}
                  className="w-14 bg-transparent text-center font-semibold text-white outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                  aria-label="Hours"
                />

                <button
                  type="button"
                  onClick={() => setHours((prev) => clamp(prev + 1, 0, 24))}
                  className="p-3 text-slate-300 hover:text-white"
                  aria-label="Increase hours"
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
                  onClick={() => setMinutes((prev) => clamp(prev - 5, 0, 59))}
                  className="p-3 text-slate-300 hover:text-white"
                  aria-label="Decrease minutes"
                >
                  <Minus className="h-4 w-4" />
                </button>

                <input
                  type="number"
                  min={0}
                  max={59}
                  value={minutes}
                  onChange={(event) => updateMinutes(event.target.value)}
                  className="w-14 bg-transparent text-center font-semibold text-white outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                  aria-label="Minutes"
                />

                <button
                  type="button"
                  onClick={() => setMinutes((prev) => clamp(prev + 5, 0, 59))}
                  className="p-3 text-slate-300 hover:text-white"
                  aria-label="Increase minutes"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-3 sm:p-4">
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

        <div className="mt-5 grid gap-3 sm:mt-6 sm:grid-cols-2">
          <Button
            type="button"
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className="h-11 rounded-2xl border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white sm:h-12"
          >
            Cancel
          </Button>

          <Button
            type="button"
            onClick={applyTimer}
            className="h-11 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-500 font-semibold text-white sm:h-12"
          >
            Apply Timer
          </Button>
        </div>
      </div>
    </div>
  );
}