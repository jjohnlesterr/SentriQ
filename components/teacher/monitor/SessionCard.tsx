"use client";

import { useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Eye,
  Lock,
  UserX,
  XCircle,
} from "lucide-react";

import ConfirmDialog from "@/components/shared/ConfirmDialog";
import { GlassCard } from "@/components/shared/GlassCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import type { Quiz, QuizSession } from "@/lib/shared/types";

type Props = {
  quiz: Quiz | null;
  session: QuizSession;
  onView: (id: string) => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  formatTime: (value: Date | string | undefined) => string;
};

function countEvents(session: QuizSession, type: string) {
  return session.events.filter((event) => event.type === type).length;
}

function isKicked(session: QuizSession) {
  return session.approvalStatus === "rejected";
}

function isTimedOut(session: QuizSession) {
  return session.status === "timed-out";
}

function isAbandoned(session: QuizSession) {
  return session.status === "abandoned";
}

function isCompleted(session: QuizSession) {
  return session.status === "completed" || !!session.completedAt;
}

function isInProgress(session: QuizSession) {
  return session.status === "in-progress" && !session.completedAt;
}

function isFinished(session: QuizSession) {
  return (
    isCompleted(session) ||
    isTimedOut(session) ||
    isAbandoned(session) ||
    isKicked(session)
  );
}

function getAccentClass(session: QuizSession) {
  if (isKicked(session)) {
    return "border-red-500/20 bg-red-950/10 before:bg-red-500";
  }

  if (isAbandoned(session)) {
    return "border-orange-500/20 bg-orange-950/10 before:bg-orange-400";
  }

  if (isCompleted(session)) {
    return "before:bg-emerald-400";
  }

  if (isTimedOut(session)) {
    return "before:bg-yellow-400";
  }

  if (isInProgress(session)) {
    return "before:bg-cyan-400";
  }

  return "";
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

function getReportLabel(reportVisibility: QuizSession["reportVisibility"]) {
  if (reportVisibility === "full") return "Full Review";
  if (reportVisibility === "summary") return "Answers";
  return "Locked";
}

function getStatusLabel(session: QuizSession) {
  if (session.approvalStatus === "pending") return "Pending";
  if (isKicked(session)) return "Kicked";
  if (isAbandoned(session)) return "Abandoned";
  if (isTimedOut(session)) return "Timed Out";
  if (isCompleted(session)) return "Completed";

  return "In Progress";
}

function getStatusBadgeClass(session: QuizSession) {
  if (session.approvalStatus === "pending") {
    return "border-yellow-400/20 bg-yellow-500/10 text-yellow-200";
  }

  if (isKicked(session)) {
    return "border-red-400/20 bg-red-500/10 text-red-200";
  }

  if (isAbandoned(session)) {
    return "border-orange-400/20 bg-orange-500/10 text-orange-200";
  }

  if (isTimedOut(session)) {
    return "border-yellow-400/20 bg-yellow-500/10 text-yellow-200";
  }

  if (isCompleted(session)) {
    return "border-emerald-400/20 bg-emerald-500/10 text-emerald-200";
  }

  return "border-blue-400/20 bg-blue-500/10 text-blue-200";
}

function ViolationPill({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: "red" | "orange" | "blue" | "pink";
}) {
  const toneClass = {
    red: "border-red-400/10 bg-red-500/5 text-red-300",
    orange: "border-orange-400/10 bg-orange-500/5 text-orange-300",
    blue: "border-blue-400/10 bg-blue-500/5 text-blue-300",
    pink: "border-pink-400/10 bg-pink-500/5 text-pink-300",
  }[tone];

  return (
    <span
      className={`flex min-h-[46px] items-center justify-center rounded-xl border px-2 py-1 md:min-h-0 md:px-3 md:py-1.5 ${toneClass}`}
    >
      <div className="flex flex-col items-center md:hidden">
        <span className="text-[11px] font-semibold leading-none text-slate-300">
          {label}
        </span>

        <span className="mt-1 text-sm font-black leading-none">{value}</span>
      </div>

      <div className="hidden items-center gap-1 md:flex">
        <span className="text-xs font-semibold text-slate-300">{label}:</span>
        <span className="text-sm font-black">{value}</span>
      </div>
    </span>
  );
}

function StatusIcon({ session }: { session: QuizSession }) {
  if (isKicked(session)) {
    return <UserX className="mr-1 h-3.5 w-3.5" />;
  }

  if (isAbandoned(session)) {
    return <AlertTriangle className="mr-1 h-3.5 w-3.5" />;
  }

  return <CheckCircle2 className="mr-1 h-3.5 w-3.5" />;
}

export default function SessionCard({
  quiz,
  session,
  onView,
  onApprove,
  onReject,
  formatTime,
}: Props) {
  const [kickDialogOpen, setKickDialogOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState(false);

  const totalQuestions =
    session.quizSnapshot?.questions.length ?? quiz?.questions.length ?? 0;

  const kicked = isKicked(session);
  const isPending = session.approvalStatus === "pending";
  const isApproved = session.approvalStatus === "approved";

  const canKick = isApproved && isInProgress(session) && !kicked;

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
              <h3 className="text-lg font-bold leading-tight text-white">
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
    <GlassCard
      className={`relative overflow-hidden p-0 transition before:absolute before:bottom-6 before:left-0 before:top-6 before:w-1 before:rounded-r-full ${getAccentClass(
        session,
      )}`}
    >
      <button
        type="button"
        onClick={() => setMobileExpanded((current) => !current)}
        className="w-full p-4 text-left md:pointer-events-none md:p-5"
      >
        <div className="flex items-start gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex min-w-0 flex-wrap items-center gap-2">
              <h3 className="text-lg font-extrabold leading-tight text-white md:text-xl">
                {session.studentName}
              </h3>

              <Badge
                className={`shrink-0 px-2.5 py-1 text-xs ${getStatusBadgeClass(
                  session,
                )}`}
              >
                <StatusIcon session={session} />
                {getStatusLabel(session)}
              </Badge>

              <Badge
                className={`shrink-0 px-2.5 py-1 text-xs ${risk.className}`}
              >
                <AlertTriangle className="mr-1 h-3.5 w-3.5" />
                {risk.label}
              </Badge>
            </div>

            <div className="mt-2 flex items-center gap-2 text-xs text-slate-400 md:text-sm">
              <Clock3 className="h-4 w-4 shrink-0 text-slate-500" />
              <span>{formatTime(session.startedAt)}</span>
            </div>

            <div className="mt-4 grid grid-cols-4 gap-2 md:flex md:flex-wrap md:gap-3">
              <ViolationPill label="Tab" value={tabLeft} tone="red" />
              <ViolationPill
                label="Full"
                value={fullscreenExit}
                tone="orange"
              />
              <ViolationPill label="Copy" value={copyAttempt} tone="blue" />
              <ViolationPill label="Paste" value={pasteAttempt} tone="pink" />
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <p
              className={
                isFinished(session) && !kicked
                  ? isAbandoned(session) || isTimedOut(session)
                    ? "text-xl font-black text-orange-300 md:text-2xl"
                    : "text-xl font-black text-emerald-300 md:text-2xl"
                  : kicked
                    ? "text-xl font-black text-red-300 md:text-2xl"
                    : "text-xl font-black text-slate-500 md:text-2xl"
              }
            >
              {isFinished(session) && session.score !== undefined
                ? `${session.score}/${totalQuestions}`
                : "—"}
            </p>

            <ChevronDown
              className={`h-5 w-5 text-slate-400 transition md:hidden ${
                mobileExpanded ? "rotate-180" : ""
              }`}
            />
          </div>
        </div>
      </button>

      {mobileExpanded && (
        <div className="border-t border-white/10 p-3 md:hidden">
          <div className="flex items-center justify-between gap-2">
            <div className="flex h-10 min-w-0 items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3">
              <Lock className="h-4 w-4 shrink-0 text-slate-300" />

              <span className="text-xs font-semibold leading-tight text-slate-300">
                {getReportLabel(session.reportVisibility)}
              </span>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => onView(session.id)}
                className="h-10 rounded-xl border border-white/10 bg-white/5 px-3 text-xs font-semibold text-white hover:bg-white/10"
              >
                <Eye className="h-3.5 w-3.5" />
                View
              </Button>

              {canKick && (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => setKickDialogOpen(true)}
                  className="h-10 rounded-xl px-3 text-xs font-semibold"
                >
                  <UserX className="h-3.5 w-3.5" />
                  Kick
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="hidden items-center justify-between gap-3 px-5 pb-5 md:flex">
        <div className="flex w-fit items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
          <Lock className="h-4 w-4 shrink-0 text-slate-300" />

          <span className="text-sm font-semibold leading-tight text-slate-300">
            {getReportLabel(session.reportVisibility)}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="ghost"
            onClick={() => onView(session.id)}
            className="h-12 rounded-xl border border-white/10 bg-white/5 px-5 text-sm font-semibold text-white hover:bg-white/10"
          >
            <Eye className="h-4 w-4" />
            View Details
          </Button>

          {canKick && (
            <Button
              type="button"
              variant="destructive"
              onClick={() => setKickDialogOpen(true)}
              className="h-12 rounded-xl px-5 text-sm font-semibold"
            >
              <UserX className="h-4 w-4" />
              Kick
            </Button>
          )}
        </div>
      </div>

      <ConfirmDialog
        open={kickDialogOpen}
        title="Kick student?"
        description={`Are you sure you want to kick ${session.studentName}? They will be removed from the active quiz, but their history will remain available.`}
        confirmText="Kick"
        cancelText="Cancel"
        confirmVariant="destructive"
        onOpenChange={setKickDialogOpen}
        onConfirm={handleKick}
      />
    </GlassCard>
  );
}
