"use client";

import { useState } from "react";
import {
  ArrowLeft,
  ChevronDown,
  Lock,
  RefreshCw,
  ShieldCheck,
  Unlock,
} from "lucide-react";

import SectionHeading from "@/components/shared/SectionHeading";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { Quiz, ReportVisibility } from "@/lib/types";

type Props = {
  quiz: Quiz | null;
  autoRefresh: boolean;
  lastUpdated: Date;
  reportVisibilityState: ReportVisibility | "mixed";
  onBack: () => void;
  onRefresh: () => void;
  onToggleAutoRefresh: () => void;
  onBulkUpdateReportVisibility: (visibility: ReportVisibility) => void;
};

export default function MonitorHeader({
  quiz,
  autoRefresh,
  lastUpdated,
  reportVisibilityState,
  onBack,
  onRefresh,
  onToggleAutoRefresh,
  onBulkUpdateReportVisibility,
}: Props) {
  const [reportOpen, setReportOpen] = useState(false);

  function buttonClass(visibility: ReportVisibility) {
    return reportVisibilityState === visibility
      ? "h-11"
      : "h-11 border-white/10 bg-white/5 hover:bg-white/10 hover:text-white";
  }

  function mobileButtonClass(visibility: ReportVisibility) {
    return reportVisibilityState === visibility
      ? "h-16 w-full justify-start rounded-2xl px-5 text-left"
      : "h-16 w-full justify-start rounded-2xl border-white/10 bg-white/5 px-5 text-left hover:bg-white/10 hover:text-white";
  }

  function buttonVariant(visibility: ReportVisibility) {
    return reportVisibilityState === visibility ? "primary" : "secondary";
  }

  return (
    <Card className="mb-5 overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-0 shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl md:mb-6">
      <div className="relative p-5 md:p-8">
        <div className="absolute right-0 top-0 h-28 w-28 rounded-full bg-blue-500/10 blur-2xl md:h-32 md:w-32" />

        <div className="relative z-10 flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex items-start gap-3 md:gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="h-10 w-10 shrink-0 border border-white/10 bg-white/5 p-0 hover:bg-white/10 md:h-11 md:w-11"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>

            <div className="min-w-0">
              <SectionHeading
                icon={ShieldCheck}
                badge="Live Monitoring Console"
                title="Live Monitor"
                description={quiz?.title || "Quiz not found"}
                variant="page"
                badgeClassName="mb-3 border-sky-400/20 bg-sky-400/10 px-3 py-1.5 text-xs text-sky-200"
                iconClassName="h-3.5 w-3.5"
                titleClassName="text-3xl md:text-4xl"
                descriptionClassName="mt-2 text-sm text-slate-300 md:text-base"
              />

              {quiz?.published && (
                <p className="mt-3 inline-flex rounded-full border border-cyan-400/20 bg-cyan-500/10 px-3 py-1 font-mono text-xs text-cyan-200 md:text-sm">
                  Join Code: {quiz.code}
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-3 lg:items-end">
            <p className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-400 lg:border-0 lg:bg-transparent lg:px-0 lg:py-0">
              Last updated:{" "}
              <span className="font-medium text-white">
                {lastUpdated.toLocaleTimeString()}
              </span>
            </p>

            <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:justify-end">
              <Button
                variant="secondary"
                onClick={onRefresh}
                className="h-11 border-white/10 bg-white/5 hover:bg-white/10 hover:text-white"
              >
                <RefreshCw className="h-4 w-4" />
                Refresh
              </Button>

              <Button
                onClick={onToggleAutoRefresh}
                variant={autoRefresh ? "primary" : "secondary"}
                className={
                  autoRefresh
                    ? "h-11"
                    : "h-11 border-white/10 bg-white/5 hover:bg-white/10 hover:text-white"
                }
              >
                Auto {autoRefresh ? "ON" : "OFF"}
              </Button>
            </div>
          </div>
        </div>

        {/* MOBILE REPORT RELEASE */}
        <div className="relative z-10 mt-6 rounded-2xl border border-white/10 bg-white/5 p-4 md:hidden">
          <button
            type="button"
            onClick={() => setReportOpen((prev) => !prev)}
            className="flex w-full items-center justify-between gap-4"
          >
            <div className="min-w-0">
              <h3 className="text-left font-semibold text-white">
                Student Report Release
              </h3>

              <p className="mt-1 text-left text-sm text-slate-400">
                Control what students can see after the quiz.
              </p>
            </div>

            <div className="shrink-0 rounded-2xl border border-white/10 bg-white/5 p-3">
              <ChevronDown
                className={`h-5 w-5 transition ${
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
            <div className="mt-4 grid gap-3">
              <Button
                type="button"
                variant={buttonVariant("locked")}
                onClick={() => onBulkUpdateReportVisibility("locked")}
                className={mobileButtonClass("locked")}
              >
                <Lock className="mr-3 h-5 w-5" />
                Lock All Reports
              </Button>

              <Button
                type="button"
                variant={buttonVariant("summary")}
                onClick={() => onBulkUpdateReportVisibility("summary")}
                className={mobileButtonClass("summary")}
              >
                <Unlock className="mr-3 h-5 w-5" />
                Release Summary
              </Button>

              <Button
                type="button"
                variant={buttonVariant("full")}
                onClick={() => onBulkUpdateReportVisibility("full")}
                className={mobileButtonClass("full")}
              >
                <Unlock className="mr-3 h-5 w-5" />
                Release Full Review
              </Button>
            </div>
          )}
        </div>

        {/* DESKTOP REPORT RELEASE - OLD STYLE */}
        <div className="relative z-10 mt-6 hidden rounded-2xl border border-white/10 bg-white/5 p-4 md:block">
          <div className="mb-3 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="font-semibold text-white">
                Student Report Release
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
              Release Summary
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