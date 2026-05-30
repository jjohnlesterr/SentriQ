"use client";

import { useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  Clock3,
  UserX,
  XCircle,
} from "lucide-react";

import ConfirmDialog from "@/components/shared/ConfirmDialog";
import { GlassCard } from "@/components/shared/GlassCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import type { QuizSession } from "@/lib/shared/types";

type Props = {
  session: QuizSession;
  onView: (id: string) => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  formatTime: (value: Date | string | undefined) => string;
};

function countEvents(session: QuizSession, type: string) {
  return session.events.filter((event) => event.type === type).length;
}

function isTimedOut(session: QuizSession) {
  return session.status === "timed-out";
}

function isCompleted(session: QuizSession) {
  return session.status === "completed" || !!session.completedAt;
}

function isFinished(session: QuizSession) {
  return isCompleted(session) || isTimedOut(session);
}

function getRiskLevel(session: QuizSession) {
  const tabLeft = countEvents(session, "tab-left");
  const fullscreenExit = countEvents(session, "fullscreen-exit");
  const copyAttempt = countEvents(session, "copy-attempt");
  const pasteAttempt = countEvents(session, "paste-attempt");

  const riskScore =
    tabLeft * 10 + fullscreenExit * 15 + copyAttempt * 20 + pasteAttempt * 20;

  if (riskScore >= 40) {
    return {
      label: "High Risk",
      className: "border-red-400/20 bg-red-500/10 text-red-200",
    };
  }

  if (riskScore >= 15) {
    return {
      label: "Medium Risk",
      className: "border-orange-400/20 bg-orange-500/10 text-orange-200",
    };
  }

  return {
    label: "Low Risk",
    className: "border-emerald-400/20 bg-emerald-500/10 text-emerald-200",
  };
}

function getReportClass(reportVisibility: QuizSession["reportVisibility"]) {
  if (reportVisibility === "full") return "text-blue-300";
  if (reportVisibility === "summary") return "text-violet-300";
  return "text-slate-400";
}

function getReportLabel(reportVisibility: QuizSession["reportVisibility"]) {
  if (reportVisibility === "full") return "Full Review";
  if (reportVisibility === "summary") return "Answers";
  return "Locked";
}

function getStatusLabel(session: QuizSession) {
  if (session.approvalStatus === "pending") return "Pending";
  if (session.approvalStatus === "rejected") return "Kicked";
  if (isTimedOut(session)) return "Timed Out";
  if (isCompleted(session)) return "Completed";

  return "In Progress";
}

function getStatusClass(session: QuizSession) {
  if (session.approvalStatus === "pending") return "text-yellow-300";
  if (session.approvalStatus === "rejected") return "text-red-300";
  if (isTimedOut(session)) return "text-orange-300";
  if (isCompleted(session)) return "text-emerald-300";

  return "text-blue-300";
}

function getStatusBadgeClass(session: QuizSession) {
  if (isTimedOut(session)) {
    return "border-orange-400/20 bg-orange-500/10 text-orange-200";
  }

  if (isCompleted(session)) {
    return "border-emerald-400/20 bg-emerald-500/10 text-emerald-200";
  }

  return "border-blue-400/20 bg-blue-500/10 text-blue-200";
}

export default function SessionCard({
  session,
  onView,
  onApprove,
  onReject,
  formatTime,
}: Props) {
  const [kickDialogOpen, setKickDialogOpen] = useState(false);

  const totalQuestions = session.answers
    ? Object.keys(session.answers).length
    : 0;

  const isPending = session.approvalStatus === "pending";
  const isRejected = session.approvalStatus === "rejected";
  const isApproved = session.approvalStatus === "approved";

  const tabLeft = countEvents(session, "tab-left");
  const fullscreenExit = countEvents(session, "fullscreen-exit");
  const copyAttempt = countEvents(session, "copy-attempt");
  const pasteAttempt = countEvents(session, "paste-attempt");

  const risk = getRiskLevel(session);

  function handleKick() {
    onReject(session.id);
    setKickDialogOpen(false);
  }

  if (isPending) {
    return (
      <GlassCard className="overflow-hidden p-4 md:p-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="truncate text-lg font-bold text-white">
                {session.studentName}
              </h3>

              <Badge className="border-yellow-400/20 bg-yellow-500/10 text-yellow-200">
                Pending
              </Badge>
            </div>

            <div className="mt-4 flex items-center gap-2 text-sm text-slate-400">
              <Clock3 className="h-4 w-4" />
              Requested at {formatTime(session.startedAt)}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 md:flex">
            <Button
              type="button"
              variant="success"
              size="mobile"
              onClick={() => onApprove(session.id)}
              className="rounded-xl font-semibold md:min-w-[120px]"
            >
              <CheckCircle2 className="h-4 w-4" />
              Approve
            </Button>

            <Button
              type="button"
              variant="dangerSoft"
              size="mobile"
              onClick={() => onReject(session.id)}
              className="rounded-xl font-semibold md:min-w-[120px]"
            >
              <XCircle className="h-4 w-4" />
              Reject
            </Button>
          </div>
        </div>
      </GlassCard>
    );
  }

  return (
    <GlassCard className="overflow-hidden p-4 md:p-6">
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <h3 className="text-lg font-bold text-white">{session.studentName}</h3>

        {isRejected && (
          <Badge className="border-red-400/20 bg-red-500/10 text-red-200">
            Kicked
          </Badge>
        )}

        {isApproved && (
          <>
            <Badge className={getStatusBadgeClass(session)}>
              {getStatusLabel(session)}
            </Badge>

            <Badge className={risk.className}>
              <AlertTriangle className="mr-1 h-3 w-3" />
              {risk.label}
            </Badge>
          </>
        )}
      </div>

      {/* Mobile layout unchanged */}
      <div className="space-y-3 md:hidden">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-slate-400">Status</p>

              <p className={`mt-2 text-xl font-bold ${getStatusClass(session)}`}>
                {getStatusLabel(session)}
              </p>
            </div>

            <div>
              <p className="text-xs text-slate-400">Score</p>

              <p
                className={
                  isFinished(session)
                    ? "mt-2 text-xl font-bold text-emerald-300"
                    : "mt-2 text-xl font-bold text-slate-500"
                }
              >
                {isFinished(session)
                  ? `${session.score ?? 0}/${totalQuestions}`
                  : "Pending"}
              </p>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2 text-xs text-slate-400">
            <Clock3 className="h-4 w-4" />
            Requested at {formatTime(session.startedAt)}
          </div>

          {isApproved && (
            <div className="mt-4 grid grid-cols-4 gap-2">
              <div className="rounded-xl border border-red-400/10 bg-red-500/5 p-2 text-center">
                <p className="text-lg font-bold text-red-300">{tabLeft}</p>
                <p className="mt-1 text-[10px] text-slate-400">Tab</p>
              </div>

              <div className="rounded-xl border border-orange-400/10 bg-orange-500/5 p-2 text-center">
                <p className="text-lg font-bold text-orange-300">
                  {fullscreenExit}
                </p>
                <p className="mt-1 text-[10px] text-slate-400">Full</p>
              </div>

              <div className="rounded-xl border border-blue-400/10 bg-blue-500/5 p-2 text-center">
                <p className="text-lg font-bold text-blue-300">
                  {copyAttempt}
                </p>
                <p className="mt-1 text-[10px] text-slate-400">Copy</p>
              </div>

              <div className="rounded-xl border border-pink-400/10 bg-pink-500/5 p-2 text-center">
                <p className="text-lg font-bold text-pink-300">
                  {pasteAttempt}
                </p>
                <p className="mt-1 text-[10px] text-slate-400">Paste</p>
              </div>
            </div>
          )}

          <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-400">Report</span>

              <span
                className={`text-sm font-semibold ${getReportClass(
                  session.reportVisibility,
                )}`}
              >
                {getReportLabel(session.reportVisibility)}
              </span>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2">
            <Button
              variant="ghost"
              size="default"
              onClick={() => onView(session.id)}
              className="h-11 rounded-2xl"
            >
              View Details
              <ChevronRight className="h-4 w-4" />
            </Button>

            {isApproved && (
              <Button
                variant="destructive"
                size="default"
                onClick={() => setKickDialogOpen(true)}
                className="h-11 rounded-2xl"
              >
                <UserX className="h-4 w-4" />
                Kick
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Desktop layout fixed */}
 <div className="hidden md:grid md:grid-cols-[repeat(4,minmax(0,1fr))_160px] md:gap-x-3 md:gap-y-3">
  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
    <p className="text-slate-400">Status</p>
    <p className={`mt-1 font-semibold ${getStatusClass(session)}`}>
      {getStatusLabel(session)}
    </p>
  </div>

  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
    <p className="text-slate-400">Score</p>
    <p className={isFinished(session) ? "mt-1 font-bold text-emerald-300" : "mt-1 font-bold text-slate-500"}>
      {isFinished(session) ? `${session.score ?? 0} / ${totalQuestions}` : "Pending"}
    </p>
  </div>

  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
    <p className="text-slate-400">Requested</p>
    <p className="mt-1 text-white">{formatTime(session.startedAt)}</p>
  </div>

  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
    <p className="text-slate-400">Report</p>
    <p className={`mt-1 font-semibold ${getReportClass(session.reportVisibility)}`}>
      {getReportLabel(session.reportVisibility)}
    </p>
  </div>

  <div className="row-span-2 flex flex-col justify-center gap-3">
    <Button
      variant="ghost"
      size="default"
      onClick={() => onView(session.id)}
      className="h-12 w-full rounded-2xl"
    >
      View Details
      <ChevronRight className="h-4 w-4" />
    </Button>

    {isApproved && (
      <Button
        variant="destructive"
        size="default"
        onClick={() => setKickDialogOpen(true)}
        className="h-12 w-full rounded-2xl"
      >
        <UserX className="h-4 w-4" />
        Kick
      </Button>
    )}
  </div>

  {isApproved ? (
    <>
      <div className="flex items-center rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-slate-300">
        Tab Left:
        <span className="ml-1 font-bold text-red-300">{tabLeft}</span>
      </div>

      <div className="flex items-center rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-slate-300">
        Fullscreen:
        <span className="ml-1 font-bold text-orange-300">{fullscreenExit}</span>
      </div>

      <div className="flex items-center rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-slate-300">
        Copy:
        <span className="ml-1 font-bold text-blue-300">{copyAttempt}</span>
      </div>

      <div className="flex items-center rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-slate-300">
        Paste:
        <span className="ml-1 font-bold text-pink-300">{pasteAttempt}</span>
      </div>
    </>
  ) : (
    <>
      <div />
      <div />
      <div />
      <div />
    </>
  )}
</div>

      <ConfirmDialog
        open={kickDialogOpen}
        title="Kick student?"
        description={`Are you sure you want to kick ${session.studentName}? They will lose access to this quiz.`}
        confirmText="Kick"
        cancelText="Cancel"
        confirmVariant="destructive"
        onOpenChange={setKickDialogOpen}
        onConfirm={handleKick}
      />
    </GlassCard>
  );
}