"use client";

import { useEffect, useMemo, useState } from "react";
import { Minus, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/shared/utils";

type Props = {
  open: boolean;
  value: number | null;
  onOpenChange: (open: boolean) => void;
  onApply: (minutes: number | null) => void;
};

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function plural(count: number, unit: string) {
  return `${count} ${unit}${count === 1 ? "" : "s"}`;
}

function formatDuration(totalMinutes: number) {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours > 0 && minutes > 0) return `${plural(hours, "hour")} ${plural(minutes, "minute")}`;
  if (hours > 0) return plural(hours, "hour");
  return plural(minutes, "minute");
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

  const optionClass = (active: boolean) =>
    cn(
      "flex w-full items-start gap-3 rounded-lg border p-3.5 text-left transition-colors",
      active
        ? "border-cyan-400/70 bg-cyan-400/[0.06]"
        : "border-line-strong hover:border-slate-500/70 hover:bg-white/[0.03]",
    );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Time limit</DialogTitle>
          <DialogDescription>
            When time runs out, answers are saved and the attempt is closed.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2" role="radiogroup" aria-label="Time limit">
          <button
            type="button"
            role="radio"
            aria-checked={!enabled}
            onClick={() => setEnabled(false)}
            className={optionClass(!enabled)}
          >
            <span
              className={cn(
                "mt-1 h-3.5 w-3.5 shrink-0 rounded-full border",
                !enabled ? "border-cyan-400 bg-cyan-400" : "border-slate-500",
              )}
            />
            <span>
              <span className="block text-sm font-medium text-white">No time limit</span>
              <span className="block text-sm text-slate-400">Students can take as long as they need.</span>
            </span>
          </button>

          <button
            type="button"
            role="radio"
            aria-checked={enabled}
            onClick={() => setEnabled(true)}
            className={optionClass(enabled)}
          >
            <span
              className={cn(
                "mt-1 h-3.5 w-3.5 shrink-0 rounded-full border",
                enabled ? "border-cyan-400 bg-cyan-400" : "border-slate-500",
              )}
            />
            <span>
              <span className="block text-sm font-medium text-white">Set a time limit</span>
              <span className="block text-sm text-slate-400">Applies to every student&apos;s attempt.</span>
            </span>
          </button>
        </div>

        {enabled && (
          <div className="mt-5 space-y-3">
            <Stepper
              label="Hours"
              value={hours}
              max={24}
              onChange={updateHours}
              onDecrease={() => setHours((prev) => clamp(prev - 1, 0, 24))}
              onIncrease={() => setHours((prev) => clamp(prev + 1, 0, 24))}
            />

            <Stepper
              label="Minutes"
              value={minutes}
              max={59}
              onChange={updateMinutes}
              onDecrease={() => setMinutes((prev) => clamp(prev - 5, 0, 59))}
              onIncrease={() => setMinutes((prev) => clamp(prev + 5, 0, 59))}
            />

            <p className="pt-1 text-sm text-slate-400">
              Total: <span className="font-medium text-white">{formatDuration(totalMinutes)}</span>
            </p>
          </div>
        )}

        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>

          <Button type="button" onClick={applyTimer}>
            Apply
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Stepper({
  label,
  value,
  max,
  onChange,
  onDecrease,
  onIncrease,
}: {
  label: string;
  value: number;
  max: number;
  onChange: (value: string) => void;
  onDecrease: () => void;
  onIncrease: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-sm text-slate-300">{label}</span>

      <div className="flex items-center rounded-lg border border-line-strong">
        <button
          type="button"
          onClick={onDecrease}
          className="p-2.5 text-slate-400 transition-colors hover:text-white"
          aria-label={`Decrease ${label.toLowerCase()}`}
        >
          <Minus className="h-4 w-4" />
        </button>

        <input
          type="number"
          min={0}
          max={max}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="w-12 bg-transparent text-center text-sm font-medium tabular-nums text-white outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          aria-label={label}
        />

        <button
          type="button"
          onClick={onIncrease}
          className="p-2.5 text-slate-400 transition-colors hover:text-white"
          aria-label={`Increase ${label.toLowerCase()}`}
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
