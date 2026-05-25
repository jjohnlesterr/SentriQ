"use client";

import { useState } from "react";
import { ArrowLeft, Clock, FileText, ShieldCheck } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { ScrollArea } from "@/components/ui/scroll-area";
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
      <DialogContent className="h-[92vh] overflow-hidden border-white/10 bg-[#050b1a]/95 p-0 text-white shadow-2xl shadow-black/40 backdrop-blur-xl sm:max-w-6xl">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.12),transparent_36%),radial-gradient(circle_at_top_right,rgba(99,102,241,0.12),transparent_32%)]" />

        <div className="relative flex h-full flex-col p-5 sm:p-7">
          <DialogHeader className="mb-5 shrink-0">
            {viewMode !== "overview" && (
              <button
                type="button"
                onClick={() => setViewMode("overview")}
                className="mb-4 inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-3 py-1.5 text-xs font-semibold text-slate-200 transition hover:border-cyan-300/30 hover:bg-cyan-400/10 hover:text-cyan-200"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Back to overview
              </button>
            )}

            <DialogTitle className="flex items-center gap-2 text-xl font-bold tracking-tight sm:text-2xl">
              {viewMode === "overview" && (
                <>{session?.studentName || "Student"} - Session Details</>
              )}

              {viewMode === "answers" && (
                <>
                  <FileText className="h-5 w-5 text-emerald-300" />
                  Full Student Answers
                </>
              )}

              {viewMode === "timeline" && (
                <>
                  <Clock className="h-5 w-5 text-cyan-300" />
                  Full Activity Timeline
                </>
              )}
            </DialogTitle>

            <DialogDescription className="text-sm text-slate-400">
              {viewMode === "overview" &&
                "Activity monitoring and answer review."}
              {viewMode === "answers" &&
                "Review all questions, choices, correct answers, and student selections."}
              {viewMode === "timeline" &&
                "Review the complete monitoring activity log for this session."}
            </DialogDescription>
          </DialogHeader>

          {!session ? (
            <p className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 text-sm text-slate-400">
              Session not found.
            </p>
          ) : viewMode === "answers" ? (
            <ScrollArea className="min-h-0 flex-1">
              <div className="pr-2">
                <SessionAnswersView session={session} quiz={quiz} />
              </div>
            </ScrollArea>
          ) : viewMode === "timeline" ? (
            <ScrollArea className="min-h-0 flex-1 rounded-3xl border border-white/10 bg-white/[0.035]">
              <div className="p-5 sm:p-6">
                <SessionTimelineView session={session} formatTime={formatTime} />
              </div>
            </ScrollArea>
          ) : (
            <div className="flex min-h-0 flex-1 flex-col space-y-5">
              <SessionStatsGrid session={session} quiz={quiz} />

              <div className="hidden min-h-0 flex-1 gap-4 lg:grid lg:grid-cols-[1.25fr_0.95fr]">
                <section className="flex min-h-0 flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/[0.035]">
                  <SessionPanelHeader
                    icon={<FileText className="h-4 w-4 text-emerald-300" />}
                    title="Student Answers"
                    buttonLabel="View full answers"
                    onClick={() => setViewMode("answers")}
                  />

                  <Separator className="bg-white/10" />

                  <ScrollArea className="min-h-0 flex-1">
                    <div className="p-4">
                      <SessionAnswersView
                        session={session}
                        quiz={quiz}
                        compact
                      />
                    </div>
                  </ScrollArea>
                </section>

                <section className="flex min-h-0 flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/[0.035]">
                  <SessionPanelHeader
                    icon={<Clock className="h-4 w-4 text-cyan-300" />}
                    title="Activity Timeline"
                    buttonLabel="View full timeline"
                    onClick={() => setViewMode("timeline")}
                  />

                  <Separator className="bg-white/10" />

                  <ScrollArea className="min-h-0 flex-1">
                    <div className="p-5">
                      <SessionTimelineView
                        session={session}
                        formatTime={formatTime}
                        compact
                      />
                    </div>
                  </ScrollArea>
                </section>
              </div>

              <Tabs
                defaultValue="answers"
                className="flex min-h-0 flex-1 flex-col lg:hidden"
              >
                <TabsList className="grid h-12 w-full shrink-0 grid-cols-2 rounded-2xl">
                  <TabsTrigger value="answers" className="gap-2">
                    <FileText className="h-4 w-4" />
                    Answers
                  </TabsTrigger>

                  <TabsTrigger value="timeline" className="gap-2">
                    <Clock className="h-4 w-4" />
                    Timeline
                  </TabsTrigger>
                </TabsList>

                <TabsContent
                  value="answers"
                  className="mt-4 min-h-0 flex-1 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.035]"
                >
                  <SessionPanelHeader
                    icon={<FileText className="h-4 w-4 text-emerald-300" />}
                    title="Student Answers"
                    buttonLabel="View full"
                    onClick={() => setViewMode("answers")}
                  />

                  <Separator className="bg-white/10" />

                  <ScrollArea className="h-full">
                    <div className="p-4">
                      <SessionAnswersView
                        session={session}
                        quiz={quiz}
                        compact
                      />
                    </div>
                  </ScrollArea>
                </TabsContent>

                <TabsContent
                  value="timeline"
                  className="mt-4 min-h-0 flex-1 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.035]"
                >
                  <SessionPanelHeader
                    icon={<Clock className="h-4 w-4 text-cyan-300" />}
                    title="Activity Timeline"
                    buttonLabel="View full"
                    onClick={() => setViewMode("timeline")}
                  />

                  <Separator className="bg-white/10" />

                  <ScrollArea className="h-full">
                    <div className="p-5">
                      <SessionTimelineView
                        session={session}
                        formatTime={formatTime}
                        compact
                      />
                    </div>
                  </ScrollArea>
                </TabsContent>
              </Tabs>

              <div className="hidden shrink-0 items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-xs text-slate-400 lg:flex">
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