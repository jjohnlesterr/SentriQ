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

function getReportVisibilityLabel(value: ReportVisibility | "mixed") {
  if (value === "locked") return "Reports Locked";
  if (value === "summary") return "Answers Released";
  if (value === "full") return "Full Review Released";

  return "Mixed Access";
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
        onClick={() => handleUpdateReportVisibility(visibility)}
        className={`flex w-full cursor-pointer items-start gap-3 rounded-2xl border px-3 py-3 text-left transition ${
          active
            ? "border-cyan-300/40 bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-blue-950/30"
            : "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white"
        }`}
      >
        <span
          className={`mt-0.5 rounded-xl border p-2 ${
            active
              ? "border-white/20 bg-white/15 text-white"
              : "border-white/10 bg-white/5 text-slate-300"
          }`}
        >
          {icon}
        </span>

        <span className="min-w-0 flex-1">
          <span className="flex items-center justify-between gap-2 text-sm font-semibold">
            {title}

            {active && <Check className="h-4 w-4 text-white" />}
          </span>

          <span
            className={`mt-1 block text-xs leading-5 ${
              active ? "text-cyan-50/80" : "text-slate-400"
            }`}
          >
            {description}
          </span>
        </span>
      </button>
    );
  }

  return (
    <Card className="relative z-30 mb-5 overflow-visible rounded-3xl border border-white/10 bg-white/5 p-0 shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl md:mb-6">
      <div className="relative p-4 md:p-8">
        <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-blue-500/10 blur-2xl md:h-32 md:w-32" />

        <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          {/* QUIZ INFORMATION */}
          <div className="flex min-w-0 items-start gap-3 md:gap-4">
            <Button
              type="button"
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

              {/* QUIZ METADATA AND RESULT ACCESS */}
              <div className="mt-3 flex flex-wrap items-center gap-2">
                {quiz?.published && (
                  <p className="inline-flex rounded-full border border-cyan-400/20 bg-cyan-500/10 px-3 py-1 font-mono text-xs text-cyan-200 md:text-sm">
                    Join Code: {quiz.code}
                  </p>
                )}

                <p className="inline-flex items-center gap-1.5 rounded-full border border-violet-400/20 bg-violet-500/10 px-3 py-1 text-xs font-semibold text-violet-200 md:text-sm">
                  <Clock3 className="h-3.5 w-3.5" />
                  Time Limit: {formatTimeLimit(quiz?.timeLimitMinutes)}
                </p>

                {/* RESULT ACCESS DROPDOWN */}
                <div ref={reportRef} className="relative w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => setReportOpen((current) => !current)}
                    aria-expanded={reportOpen}
                    className="inline-flex w-full cursor-pointer items-center justify-between gap-3 rounded-full border border-cyan-400/20 bg-cyan-500/10 px-3 py-1 text-xs text-cyan-100 transition hover:bg-cyan-500/15 md:text-sm"
                  >
                    <span className="inline-flex min-w-0 items-center gap-2">
                      <Eye className="h-3.5 w-3.5 shrink-0" />

                      <span className="truncate">
                        Result Access:{" "}
                        <span className="font-semibold">
                          {getReportVisibilityLabel(reportVisibilityState)}
                        </span>
                      </span>
                    </span>

                    <ChevronDown
                      className={`h-3.5 w-3.5 shrink-0 transition ${
                        reportOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {reportOpen && (
                    <div className="absolute left-0 top-full z-[999] mt-2 w-[320px] max-w-[calc(100vw-2rem)] rounded-3xl border border-white/10 bg-[#0b0f1a]/95 p-3 shadow-[0_20px_80px_rgba(0,0,0,0.65)] backdrop-blur-xl">
                      {reportVisibilityState === "mixed" && (
                        <div className="mb-2 rounded-2xl border border-orange-400/20 bg-orange-500/10 px-3 py-2 text-xs font-semibold text-orange-200">
                          Mixed access detected
                        </div>
                      )}

                      <div className="grid gap-2">
                        {renderReportOption({
                          visibility: "locked",
                          icon: <Lock className="h-4 w-4" />,
                          title: "Lock All Reports",
                          description: "Hide all quiz results from students.",
                        })}

                        {renderReportOption({
                          visibility: "summary",
                          icon: <FileCheck2 className="h-4 w-4" />,
                          title: "Release Answers",
                          description: "Show scores and correct answers.",
                        })}

                        {renderReportOption({
                          visibility: "full",
                          icon: <Unlock className="h-4 w-4" />,
                          title: "Release Full Review",
                          description:
                            "Allow full question review after quiz.",
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* JOINING CONTROL */}
          <div className="flex w-full flex-col gap-3 lg:w-auto lg:min-w-[220px]">
            <div
              className={`flex min-h-14 items-center gap-3 rounded-2xl border px-4 py-3 ${
                joiningClosed
                  ? "border-red-400/20 bg-red-500/10"
                  : "border-emerald-400/20 bg-emerald-500/10"
              }`}
            >
              <div
                className={`relative flex h-3 w-3 shrink-0 ${
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

              <div className="flex min-w-0 flex-col">
                <span
                  className={`truncate text-sm font-semibold ${
                    joiningClosed ? "text-red-200" : "text-emerald-200"
                  }`}
                >
                  {joiningClosed ? "Joining Closed" : "Joining Open"}
                </span>

                <span
                  className={`truncate text-xs ${
                    joiningClosed
                      ? "text-red-300/80"
                      : "text-emerald-300/80"
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
              className="min-h-11 w-full rounded-2xl font-semibold"
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
      </div>
    </Card>
  );
}