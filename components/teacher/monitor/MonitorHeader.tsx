"use client";

import { useState } from "react";
import {
  ArrowLeft,
  ChevronDown,
  Clock3,
  Lock,
  ShieldCheck,
  Unlock,
} from "lucide-react";

import SectionHeading from "@/components/shared/SectionHeading";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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

export default function MonitorHeader({
  quiz,
  lastUpdated,
  reportVisibilityState,
  onBack,
  onBulkUpdateReportVisibility,
  onToggleJoining,
}: Props) {
  const [reportOpen, setReportOpen] = useState(false);

  const joiningClosed = !!quiz?.joinLocked;

  function buttonClass(visibility: ReportVisibility) {
    return reportVisibilityState === visibility
      ? "h-11"
      : "h-11 border-white/10 bg-white/5 hover:bg-white/10 hover:text-white";
  }

  function mobileButtonClass(visibility: ReportVisibility) {
    return reportVisibilityState === visibility
      ? "h-10 w-full justify-start rounded-xl px-3 text-left text-xs"
      : "h-10 w-full justify-start rounded-xl border-white/10 bg-white/5 px-3 text-left text-xs hover:bg-white/10 hover:text-white";
  }

  function buttonVariant(visibility: ReportVisibility) {
    return reportVisibilityState === visibility ? "primary" : "secondary";
  }

  return (
    <Card className="mb-5 overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-0 shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl md:mb-6">
      <div className="relative p-4 md:p-8">
        <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-blue-500/10 blur-2xl md:h-32 md:w-32" />

        <div className="relative z-10 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex items-start gap-3 md:gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="h-9 w-9 shrink-0 border border-white/10 bg-white/5 p-0 hover:bg-white/10 md:h-11 md:w-11"
            >
              <ArrowLeft className="h-4 w-4 md:h-5 md:w-5" />
            </Button>

            <div className="min-w-0">
              <SectionHeading
                icon={ShieldCheck}
                badge="Live Monitoring Console"
                title="Live Monitor"
                description={quiz?.title || "Quiz not found"}
                variant="page"
                badgeClassName="mb-2 border-sky-400/20 bg-sky-400/10 px-2.5 py-1 text-[10px] text-sky-200 md:mb-3 md:px-3 md:py-1.5 md:text-xs"
                iconClassName="h-3 w-3 md:h-3.5 md:w-3.5"
                titleClassName="text-2xl md:text-4xl"
                descriptionClassName="mt-1 text-sm text-slate-300 md:mt-2 md:text-base"
              />

              <div className="mt-2 flex flex-wrap gap-2 md:mt-3">
                {quiz?.published && (
                  <p className="inline-flex rounded-full border border-cyan-400/20 bg-cyan-500/10 px-3 py-1 font-mono text-xs text-cyan-200 md:text-sm">
                    Join Code: {quiz.code}
                  </p>
                )}

                <p className="inline-flex items-center gap-1.5 rounded-full border border-violet-400/20 bg-violet-500/10 px-3 py-1 text-xs font-semibold text-violet-200 md:text-sm">
                  <Clock3 className="h-3.5 w-3.5" />
                  Time Limit: {formatTimeLimit(quiz?.timeLimitMinutes)}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 lg:items-end">
            <div
              className={`flex items-center gap-3 rounded-2xl border px-4 py-3 ${
                joiningClosed
                  ? "border-red-400/20 bg-red-500/10"
                  : "border-emerald-400/20 bg-emerald-500/10"
              }`}
            >
              <div
                className={`relative flex h-3 w-3 ${
                  joiningClosed ? "text-red-400" : "text-emerald-400"
                }`}
              >
                <span
                  className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${
                    joiningClosed ? "bg-red-400" : "bg-emerald-400"
                  }`}
                />
                <span
                  className={`relative inline-flex h-3 w-3 rounded-full ${
                    joiningClosed ? "bg-red-400" : "bg-emerald-400"
                  }`}
                />
              </div>

              <div className="flex flex-col">
                <span
                  className={`text-sm font-semibold ${
                    joiningClosed ? "text-red-200" : "text-emerald-200"
                  }`}
                >
                  {joiningClosed ? "Joining Closed" : "Joining Open"}
                </span>

                <span
                  className={`text-xs ${
                    joiningClosed ? "text-red-300/80" : "text-emerald-300/80"
                  }`}
                >
                  Last Sync {lastUpdated.toLocaleTimeString()}
                </span>
              </div>
            </div>

            <Button
              type="button"
              variant={joiningClosed ? "primary" : "dangerSoft"}
              onClick={onToggleJoining}
              className="hidden h-12 min-w-[180px] rounded-2xl font-semibold lg:inline-flex"
            >
              {joiningClosed ? (
                <>
                  <Unlock className="h-4 w-4" />
                  Reopen Joining
                </>
              ) : (
                <>
                  <Lock className="h-4 w-4" />
                  Lock Joining
                </>
              )}
            </Button>
          </div>
        </div>

        <Button
          type="button"
          variant={joiningClosed ? "primary" : "dangerSoft"}
          onClick={onToggleJoining}
          className="relative z-10 mt-4 h-11 w-full rounded-2xl font-semibold lg:hidden"
        >
          {joiningClosed ? (
            <>
              <Unlock className="h-4 w-4" />
              Reopen Joining
            </>
          ) : (
            <>
              <Lock className="h-4 w-4" />
              Lock Joining
            </>
          )}
        </Button>

        <div className="relative z-10 mt-4 rounded-2xl border border-white/10 bg-white/5 p-3 md:hidden">
          <button
            type="button"
            onClick={() => setReportOpen((prev) => !prev)}
            className="flex w-full items-center justify-between gap-3"
          >
            <div className="min-w-0">
              <h3 className="text-left text-sm font-semibold text-white">
                Student Result Access
              </h3>

              <p className="mt-1 text-left text-xs leading-5 text-slate-400">
                Control what students can see after the quiz.
              </p>
            </div>

            <div className="shrink-0 rounded-2xl border border-white/10 bg-white/5 p-2.5">
              <ChevronDown
                className={`h-4 w-4 transition ${
                  reportOpen ? "rotate-180" : ""
                }`}
              />
            </div>
          </button>

          {reportVisibilityState === "mixed" && (
            <span className="mt-3 inline-flex rounded-full border border-orange-400/20 bg-orange-500/10 px-3 py-1 text-xs font-semibold text-orange-200">
              Mixed
            </span>
          )}

          {reportOpen && (
            <div className="mt-4 grid gap-2">
              <Button
                type="button"
                variant={buttonVariant("locked")}
                onClick={() => onBulkUpdateReportVisibility("locked")}
                className={mobileButtonClass("locked")}
              >
                <Lock className="mr-2 h-4 w-4" />
                Lock All Reports
              </Button>

              <Button
                type="button"
                variant={buttonVariant("summary")}
                onClick={() => onBulkUpdateReportVisibility("summary")}
                className={mobileButtonClass("summary")}
              >
                <Unlock className="mr-2 h-4 w-4" />
                Release Answers
              </Button>

              <Button
                type="button"
                variant={buttonVariant("full")}
                onClick={() => onBulkUpdateReportVisibility("full")}
                className={mobileButtonClass("full")}
              >
                <Unlock className="mr-2 h-4 w-4" />
                Release Full Review
              </Button>
            </div>
          )}
        </div>

        <div className="relative z-10 mt-6 hidden rounded-2xl border border-white/10 bg-white/5 p-4 md:block">
          <div className="mb-3 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="font-semibold text-white">
                Student Result Access
              </h3>

              <p className="text-sm text-slate-400">
                Control what students can see after the quiz.
              </p>
            </div>

            {reportVisibilityState === "mixed" && (
              <span className="rounded-full border border-orange-400/20 bg-orange-500/10 px-3 py-1 text-xs font-semibold text-orange-200">
                Mixed
              </span>
            )}
          </div>

          <div className="grid gap-2 sm:grid-cols-3">
            <Button
              type="button"
              variant={buttonVariant("locked")}
              onClick={() => onBulkUpdateReportVisibility("locked")}
              className={buttonClass("locked")}
            >
              <Lock className="h-4 w-4" />
              Lock All Reports
            </Button>

            <Button
              type="button"
              variant={buttonVariant("summary")}
              onClick={() => onBulkUpdateReportVisibility("summary")}
              className={buttonClass("summary")}
            >
              <Unlock className="h-4 w-4" />
              Release Answers
            </Button>

            <Button
              type="button"
              variant={buttonVariant("full")}
              onClick={() => onBulkUpdateReportVisibility("full")}
              className={buttonClass("full")}
            >
              <Unlock className="h-4 w-4" />
              Release Full Review
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
