"use client";

import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  Check,
  ChevronDown,
  Clock3,
  Eye,
  FileCheck2,
  Lock,
  Unlock,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import type { Quiz, ReportVisibility } from "@/lib/shared/types";

type Props = {
  quiz: Quiz | null;
  lastUpdated: Date;
  reportVisibilityState: ReportVisibility | "mixed";
  onBack: () => void;
  onBulkUpdateReportVisibility: (visibility: ReportVisibility) => void;
  onToggleJoining: () => void;
};

function formatTimeLimit(minutes?: number | null) {
  if (!minutes) return "No time limit";

  if (minutes < 60) {
    return `${minutes} min${minutes === 1 ? "" : "s"}`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (remainingMinutes === 0) {
    return `${hours} hr${hours === 1 ? "" : "s"}`;
  }

  return `${hours} hr${hours === 1 ? "" : "s"} ${remainingMinutes} min${
    remainingMinutes === 1 ? "" : "s"
  }`;
}

function getReportVisibilityLabel(value: ReportVisibility | "mixed") {
  if (value === "locked") return "Results locked";
  if (value === "summary") return "Answers released";
  if (value === "full") return "Full review released";

  return "Mixed access";
}

export default function MonitorHeader({
  quiz,
  lastUpdated,
  reportVisibilityState,
  onBack,
  onBulkUpdateReportVisibility,
  onToggleJoining,
}: Props) {
  const [reportOpen, setReportOpen] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  const joiningClosed = Boolean(quiz?.joinLocked);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        reportRef.current &&
        !reportRef.current.contains(event.target as Node)
      ) {
        setReportOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  function handleUpdateReportVisibility(visibility: ReportVisibility) {
    onBulkUpdateReportVisibility(visibility);
    setReportOpen(false);
  }

  function renderReportOption({
    visibility,
    icon,
    title,
    description,
  }: {
    visibility: ReportVisibility;
    icon: ReactNode;
    title: string;
    description: string;
  }) {
    const active = reportVisibilityState === visibility;

    return (
      <button
        type="button"
        role="menuitemradio"
        aria-checked={active}
        onClick={() => handleUpdateReportVisibility(visibility)}
        className={`flex w-full items-start gap-3 rounded-md px-3 py-2.5 text-left transition-colors ${
          active ? "bg-white/[0.06] text-white" : "text-slate-300 hover:bg-white/[0.04] hover:text-white"
        }`}
      >
        <span className="mt-0.5 text-slate-400">{icon}</span>

        <span className="min-w-0 flex-1">
          <span className="block text-sm font-medium">{title}</span>
          <span className="mt-0.5 block text-xs leading-5 text-slate-500">{description}</span>
        </span>

        {active && <Check className="mt-0.5 h-4 w-4 shrink-0 text-cyan-300" />}
      </button>
    );
  }

  return (
    <header className="relative z-30 mb-6 border-b border-line pb-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex min-w-0 items-start gap-3">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onBack}
            aria-label="Back to dashboard"
            className="h-9 w-9 shrink-0"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>

          <div className="min-w-0">
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-cyan-300">
              Live monitor
            </p>

            <h1 className="mt-1 truncate text-2xl font-semibold tracking-tight text-white">
              {quiz?.title || "Quiz not found"}
            </h1>

            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-400">
              {quiz?.published && (
                <span>
                  Code{" "}
                  <span className="font-mono font-medium tracking-wider text-white">{quiz.code}</span>
                </span>
              )}

              <span className="inline-flex items-center gap-1.5">
                <Clock3 className="h-3.5 w-3.5 text-slate-500" />
                {formatTimeLimit(quiz?.timeLimitMinutes)}
              </span>

              <div ref={reportRef} className="relative">
                <button
                  type="button"
                  onClick={() => setReportOpen((current) => !current)}
                  aria-expanded={reportOpen}
                  aria-haspopup="menu"
                  className="inline-flex items-center gap-1.5 rounded-md border border-line-strong px-2.5 py-1 text-sm text-slate-200 transition-colors hover:bg-white/[0.04]"
                >
                  <Eye className="h-3.5 w-3.5 text-slate-500" />
                  {getReportVisibilityLabel(reportVisibilityState)}
                  <ChevronDown
                    className={`h-3.5 w-3.5 text-slate-500 transition-transform ${reportOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {reportOpen && (
                  <div
                    role="menu"
                    className="absolute left-0 top-full z-[999] mt-2 w-[300px] max-w-[calc(100vw-2rem)] rounded-lg border border-line-strong bg-surface-raised p-1.5 shadow-[0_16px_40px_-12px_rgba(0,0,0,0.7)]"
                  >
                    <p className="px-3 pb-1.5 pt-2 text-xs text-slate-500">
                      What students see after submitting
                    </p>

                    {reportVisibilityState === "mixed" && (
                      <p className="mx-3 mb-1.5 text-xs text-amber-300">
                        Students currently have different access levels.
                      </p>
                    )}

                    {renderReportOption({
                      visibility: "locked",
                      icon: <Lock className="h-4 w-4" />,
                      title: "Locked",
                      description: "Students see their score only.",
                    })}

                    {renderReportOption({
                      visibility: "summary",
                      icon: <FileCheck2 className="h-4 w-4" />,
                      title: "Release answers",
                      description: "Also show each answer and the correct one.",
                    })}

                    {renderReportOption({
                      visibility: "full",
                      icon: <Unlock className="h-4 w-4" />,
                      title: "Release full review",
                      description: "Answers plus their activity summary.",
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center lg:flex-col lg:items-end">
          <p className="flex items-center gap-2 text-sm">
            <span
              className={`h-2 w-2 rounded-full ${joiningClosed ? "bg-slate-500" : "bg-emerald-400"}`}
            />
            <span className={joiningClosed ? "text-slate-300" : "text-emerald-300"}>
              {joiningClosed ? "Joining closed" : "Accepting new students"}
            </span>
            <span className="text-xs text-slate-500">
              · synced {lastUpdated.toLocaleTimeString()}
            </span>
          </p>

          <Button
            type="button"
            variant={joiningClosed ? "ghost" : "dangerSoft"}
            size="sm"
            onClick={onToggleJoining}
            className="h-9 px-3 text-sm"
          >
            {joiningClosed ? (
              <>
                <Unlock className="h-4 w-4" />
                Reopen joining
              </>
            ) : (
              <>
                <Lock className="h-4 w-4" />
                Lock joining
              </>
            )}
          </Button>
        </div>
      </div>
    </header>
  );
}
