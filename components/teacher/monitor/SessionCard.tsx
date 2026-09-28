"use client";

import { useState } from "react";
import { Check, CheckSquare, Eye, Square, UserX, X } from "lucide-react";

import ConfirmDialog from "@/components/shared/ConfirmDialog";
import { Button } from "@/components/ui/button";

import type { Quiz, QuizSession } from "@/lib/shared/types";

type Props = {
  quiz: Quiz | null;
  session: QuizSession;
  onView: (id: string) => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  formatTime: (value: Date | string | undefined) => string;
  selectMode?: boolean;
  selected?: boolean;
  onToggleSelected?: (id: string) => void;
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

// Same weighting as before: tab 10, fullscreen 15, copy/paste 20 each.
function getRiskLevel(session: QuizSession) {
  const tabLeft = countEvents(session, "tab-left");
  const fullscreenExit = countEvents(session, "fullscreen-exit");
  const copyAttempt = countEvents(session, "copy-attempt");
  const pasteAttempt = countEvents(session, "paste-attempt");

  const riskScore =
    tabLeft * 10 + fullscreenExit * 15 + copyAttempt * 20 + pasteAttempt * 20;

  if (riskScore >= 40) return { label: "High risk", className: "text-red-300" };
  if (riskScore >= 15) return { label: "Medium risk", className: "text-amber-300" };

  return null;
}

function getReportLabel(reportVisibility: QuizSession["reportVisibility"]) {
  if (reportVisibility === "full") return "Full review released";
  if (reportVisibility === "summary") return "Answers released";
  return "Results locked";
}

function getStatusLabel(session: QuizSession) {
  if (session.approvalStatus === "pending") return "Pending";
  if (isKicked(session)) return "Removed";
  if (isAbandoned(session)) return "Abandoned";
  if (isTimedOut(session)) return "Timed out";
  if (isCompleted(session)) return "Completed";

  return "In progress";
}

function getStatusTone(session: QuizSession) {
  if (isKicked(session) || isAbandoned(session)) {
    return { dot: "bg-red-400", text: "text-red-300" };
  }
  if (isTimedOut(session)) return { dot: "bg-amber-400", text: "text-amber-300" };
  if (isCompleted(session)) return { dot: "bg-emerald-400", text: "text-emerald-300" };

  return { dot: "bg-cyan-400", text: "text-cyan-300" };
}

function SelectButton({
  selected,
  onClick,
}: {
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={(event) => {
        event.stopPropagation();
        onClick();
      }}
      aria-pressed={selected}
      aria-label={selected ? "Unselect session" : "Select session"}
      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md transition-colors ${
        selected ? "text-cyan-300" : "text-slate-500 hover:bg-white/[0.05] hover:text-white"
      }`}
    >
      {selected ? <CheckSquare className="h-5 w-5" /> : <Square className="h-5 w-5" />}
    </button>
  );
}

export default function SessionCard({
  quiz,
  session,
  onView,
  onApprove,
  onReject,
  formatTime,
  selectMode = false,
  selected = false,
  onToggleSelected,
}: Props) {
  const [kickDialogOpen, setKickDialogOpen] = useState(false);

  const totalQuestions =
    session.quizSnapshot?.questions.length ?? quiz?.questions.length ?? 0;

  const kicked = isKicked(session);
  const isPending = session.approvalStatus === "pending";
  const isApproved = session.approvalStatus === "approved";

  const canKick = isApproved && isInProgress(session) && !kicked;

  const violations = [
    { label: "Tab", value: countEvents(session, "tab-left") },
    { label: "Fullscreen", value: countEvents(session, "fullscreen-exit") },
    { label: "Copy", value: countEvents(session, "copy-attempt") },
    { label: "Paste", value: countEvents(session, "paste-attempt") },
  ];

  const risk = getRiskLevel(session);
  const statusTone = getStatusTone(session);

  function handleKick() {
    onReject(session.id);
    setKickDialogOpen(false);
  }

  function toggleSelected() {
    onToggleSelected?.(session.id);
  }

  const containerClass = `rounded-xl border bg-surface transition-colors ${
    selected ? "border-cyan-400/50 bg-cyan-400/[0.04]" : "border-line"
  }`;

  if (isPending) {
    return (
      <div
        className={`${containerClass} flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between sm:px-5`}
      >
        <div className="flex min-w-0 items-center gap-3">
          {selectMode && <SelectButton selected={selected} onClick={toggleSelected} />}

          <div className="min-w-0">
            <p className="truncate font-medium text-white">{session.studentName}</p>
            <p className="mt-0.5 text-xs text-slate-500">
              Requested to join at {formatTime(session.startedAt)}
            </p>
          </div>
        </div>

        {!selectMode && (
          <div className="grid grid-cols-2 gap-2 sm:flex">
            <Button
              type="button"
              variant="success"
              size="sm"
              onClick={() => onApprove(session.id)}
              className="h-9 px-3.5 text-sm"
            >
              <Check className="h-4 w-4" />
              Approve
            </Button>

            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onReject(session.id)}
              className="h-9 px-3.5 text-sm"
            >
              <X className="h-4 w-4" />
              Decline
            </Button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`${containerClass} p-4 sm:px-5`}>
      <div className="flex items-start gap-3">
        {selectMode && <SelectButton selected={selected} onClick={toggleSelected} />}

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <p className="truncate font-medium text-white">{session.studentName}</p>

            <span className={`inline-flex items-center gap-1.5 text-xs ${statusTone.text}`}>
              <span className={`h-1.5 w-1.5 rounded-full ${statusTone.dot}`} />
              {getStatusLabel(session)}
            </span>

            {risk && <span className={`text-xs font-medium ${risk.className}`}>{risk.label}</span>}
          </div>

          <p className="mt-1 text-xs text-slate-500">
            Started {formatTime(session.startedAt)} · {getReportLabel(session.reportVisibility)}
          </p>

          <ul
            className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500"
            aria-label="Integrity events"
          >
            {violations.map((violation) => (
              <li key={violation.label}>
                {violation.label}{" "}
                <span
                  className={`font-medium tabular-nums ${
                    violation.value > 0 ? "text-amber-300" : "text-slate-300"
                  }`}
                >
                  {violation.value}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <p className="shrink-0 text-lg font-semibold tabular-nums text-white">
          {isFinished(session) && session.score !== undefined ? (
            <>
              {session.score}
              <span className="text-sm font-normal text-slate-500">/{totalQuestions}</span>
            </>
          ) : (
            <span className="text-slate-600">—</span>
          )}
        </p>
      </div>

      {!selectMode && (
        <div className="mt-4 flex gap-2 border-t border-line pt-3 sm:justify-end">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onView(session.id)}
            className="h-9 flex-1 px-3 text-sm sm:flex-none"
          >
            <Eye className="h-4 w-4" />
            View details
          </Button>

          {canKick && (
            <Button
              type="button"
              variant="dangerSoft"
              size="sm"
              onClick={() => setKickDialogOpen(true)}
              className="h-9 flex-1 px-3 text-sm sm:flex-none"
            >
              <UserX className="h-4 w-4" />
              Remove
            </Button>
          )}
        </div>
      )}

      <ConfirmDialog
        open={kickDialogOpen}
        title={`Remove ${session.studentName}?`}
        description="They will be removed from the active quiz. Their answers and activity history stay available to you."
        confirmText="Remove student"
        cancelText="Cancel"
        confirmVariant="destructive"
        onOpenChange={setKickDialogOpen}
        onConfirm={handleKick}
      />
    </div>
  );
}
