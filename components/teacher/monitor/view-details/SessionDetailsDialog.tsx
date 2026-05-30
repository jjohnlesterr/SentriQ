"use client";

import { useState } from "react";
import { ArrowLeft, Clock, FileText, ShieldCheck, X } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";

import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import SessionAnswersView from "./SessionAnswersView";
import SessionTimelineView from "./SessionTimelineView";
import SessionStatsGrid from "./SessionStatsGrid";
import SessionPanelHeader from "./SessionPanelHeader";

import type { Quiz, QuizSession } from "@/lib/shared/types";

type Props = {
  open: boolean;
  session?: QuizSession;
  quiz: Quiz | null;
  onOpenChange: (open: boolean) => void;
  formatTime: (value: Date | string | undefined) => string;
};

type ViewMode = "overview" | "answers" | "timeline";

export default function SessionDetailsDialog({
  open,
  session,
  quiz,
  onOpenChange,
  formatTime,
}: Props) {
  const [viewMode, setViewMode] = useState<ViewMode>("overview");

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) setViewMode("overview");
    onOpenChange(nextOpen);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="flex max-h-[94dvh] min-h-[82dvh] w-[calc(100vw-2rem)] max-w-md flex-col overflow-hidden border-white/10 bg-[#050b1a]/95 p-0 text-white shadow-2xl shadow-black/40 backdrop-blur-xl sm:max-w-6xl lg:min-h-[76dvh] [&>button]:hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.12),transparent_36%),radial-gradient(circle_at_top_right,rgba(99,102,241,0.12),transparent_32%)]" />

        <div className="relative z-10 flex shrink-0 items-start justify-between gap-3 border-b border-white/10 bg-[#050b1a]/85 px-4 py-4 backdrop-blur-xl sm:gap-4 sm:px-7 sm:py-5">
          <div className="min-w-0 flex-1">
            {viewMode !== "overview" && (
              <button
                type="button"
                onClick={() => setViewMode("overview")}
                className="mb-3 inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-3 py-1.5 text-xs font-semibold text-slate-200 transition hover:border-cyan-300/30 hover:bg-cyan-400/10 hover:text-cyan-200"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Back to overview
              </button>
            )}

            <DialogTitle className="flex min-w-0 items-start gap-2 text-base font-bold leading-tight tracking-tight sm:items-center sm:text-2xl">
              {viewMode === "overview" && (
                <span className="line-clamp-2 min-w-0 leading-tight sm:truncate">
                  {session?.studentName || "Student"} - Session Details
                </span>
              )}

              {viewMode === "answers" && (
                <>
                  <FileText className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300 sm:mt-0 sm:h-5 sm:w-5" />
                  <span className="line-clamp-2 min-w-0 leading-tight sm:truncate">
                    Full Student Answers
                  </span>
                </>
              )}

              {viewMode === "timeline" && (
                <>
                  <Clock className="mt-0.5 h-4 w-4 shrink-0 text-cyan-300 sm:mt-0 sm:h-5 sm:w-5" />
                  <span className="line-clamp-2 min-w-0 leading-tight sm:truncate">
                    Full Activity Timeline
                  </span>
                </>
              )}
            </DialogTitle>

            <DialogDescription className="mt-1 line-clamp-2 text-xs leading-5 text-slate-400 sm:text-sm">
              {viewMode === "overview" &&
                "Activity monitoring and answer review."}

              {viewMode === "answers" &&
                "Review all questions, choices, correct answers, and student selections."}

              {viewMode === "timeline" &&
                "Review the complete monitoring activity log for this session."}
            </DialogDescription>
          </div>

          <button
            type="button"
            onClick={() => handleOpenChange(false)}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06] text-slate-300 transition hover:border-red-300/30 hover:bg-red-500/10 hover:text-red-200"
            aria-label="Close session details"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="relative z-10 min-h-0 flex-1 overflow-y-auto px-4 py-4 pr-6 sm:px-7 sm:py-5 sm:pr-10">
          {!session ? (
            <p className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 text-sm text-slate-400">
              Session not found.
            </p>
          ) : viewMode === "answers" ? (
            <SessionAnswersView session={session} quiz={quiz} />
          ) : viewMode === "timeline" ? (
            <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-4 sm:p-6">
              <SessionTimelineView session={session} formatTime={formatTime} />
            </div>
          ) : (
            <div className="space-y-4 sm:space-y-5">
              <SessionStatsGrid session={session} quiz={quiz} />

              <div className="hidden gap-4 lg:grid lg:grid-cols-[1.25fr_0.95fr]">
                <section className="rounded-3xl border border-white/10 bg-white/[0.035]">
                  <SessionPanelHeader
                    icon={<FileText className="h-4 w-4 text-emerald-300" />}
                    title="Student Answers"
                    buttonLabel="View Full Answers"
                    onClick={() => setViewMode("answers")}
                  />

                  <Separator className="bg-white/10" />

                  <div className="p-4">
                    <SessionAnswersView session={session} quiz={quiz} compact />
                  </div>
                </section>

                <section className="rounded-3xl border border-white/10 bg-white/[0.035]">
                  <SessionPanelHeader
                    icon={<Clock className="h-4 w-4 text-cyan-300" />}
                    title="Activity Timeline"
                    buttonLabel="View Full Timeline"
                    onClick={() => setViewMode("timeline")}
                  />

                  <Separator className="bg-white/10" />

                  <div className="p-5">
                    <SessionTimelineView
                      session={session}
                      formatTime={formatTime}
                      compact
                    />
                  </div>
                </section>
              </div>

              <Tabs defaultValue="answers" className="flex flex-col lg:hidden">
                <TabsList className="grid h-11 w-full grid-cols-2 rounded-2xl sm:h-12">
                  <TabsTrigger
                    value="answers"
                    className="gap-2 text-xs sm:text-sm"
                  >
                    <FileText className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    Answers
                  </TabsTrigger>

                  <TabsTrigger
                    value="timeline"
                    className="gap-2 text-xs sm:text-sm"
                  >
                    <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    Timeline
                  </TabsTrigger>
                </TabsList>

                <TabsContent
                  value="answers"
                  className="mt-3 rounded-3xl border border-white/10 bg-white/[0.035] sm:mt-4"
                >
                  <SessionPanelHeader
                    icon={<FileText className="h-4 w-4 text-emerald-300" />}
                    title="Student Answers"
                    buttonLabel="View Full"
                    onClick={() => setViewMode("answers")}
                  />

                  <Separator className="bg-white/10" />

                  <div className="p-3 sm:p-4">
                    <SessionAnswersView session={session} quiz={quiz} compact />
                  </div>
                </TabsContent>

                <TabsContent
                  value="timeline"
                  className="mt-3 rounded-3xl border border-white/10 bg-white/[0.035] sm:mt-4"
                >
                  <SessionPanelHeader
                    icon={<Clock className="h-4 w-4 text-cyan-300" />}
                    title="Activity Timeline"
                    buttonLabel="View Full"
                    onClick={() => setViewMode("timeline")}
                  />

                  <Separator className="bg-white/10" />

                  <div className="p-3 sm:p-5">
                    <SessionTimelineView
                      session={session}
                      formatTime={formatTime}
                      compact
                    />
                  </div>
                </TabsContent>
              </Tabs>

              <div className="hidden items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-xs text-slate-400 lg:flex">
                <ShieldCheck className="h-4 w-4 text-cyan-300" />
                Use the full views to inspect all answers and timeline events.
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}