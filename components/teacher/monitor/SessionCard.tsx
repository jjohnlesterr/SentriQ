import {
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  Monitor,
  TriangleAlert,
  XCircle,
} from "lucide-react";

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
  if (session.approvalStatus === "rejected") return "Rejected";
  return session.status === "completed" ? "Completed" : "In Progress";
}

function getStatusClass(session: QuizSession) {
  if (session.approvalStatus === "pending") return "text-yellow-300";
  if (session.approvalStatus === "rejected") return "text-red-300";
  return session.status === "completed" ? "text-emerald-300" : "text-blue-300";
}

export default function SessionCard({
  session,
  onView,
  onApprove,
  onReject,
  formatTime,
}: Props) {
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

  return (
    <GlassCard className="overflow-hidden p-4 md:p-6">
      {/* MOBILE */}
      <div className="md:hidden">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-xl font-bold text-white">
              {session.studentName}
            </h3>

            <div className="mt-2 flex flex-wrap gap-2">
              {isApproved && (
                <>
                  <Badge
                    className={
                      session.status === "completed"
                        ? "border-emerald-400/20 bg-emerald-500/10 text-emerald-200"
                        : "border-blue-400/20 bg-blue-500/10 text-blue-200"
                    }
                  >
                    {session.status === "completed"
                      ? "Completed"
                      : "In Progress"}
                  </Badge>

                  <Badge className={risk.className}>
                    <TriangleAlert className="mr-1 h-3 w-3" />
                    {risk.label}
                  </Badge>
                </>
              )}

              {isPending && (
                <Badge className="border-yellow-400/20 bg-yellow-500/10 text-yellow-200">
                  Pending
                </Badge>
              )}

              {isRejected && (
                <Badge className="border-red-400/20 bg-red-500/10 text-red-200">
                  Rejected
                </Badge>
              )}
            </div>
          </div>
        </div>

        <div className="mt-4 rounded-3xl border border-white/10 bg-white/[0.03] p-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-slate-500">Status</p>

              <p className={`mt-1 text-2xl font-bold ${getStatusClass(session)}`}>
                {getStatusLabel(session)}
              </p>
            </div>

            <div>
              <p className="text-xs text-slate-500">Score</p>

              <p
                className={
                  session.status === "completed"
                    ? "mt-1 text-2xl font-bold text-emerald-300"
                    : "mt-1 text-2xl font-bold text-slate-500"
                }
              >
                {session.status === "completed"
                  ? `${session.score ?? 0}/${totalQuestions}`
                  : "--"}
              </p>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2 text-xs text-slate-400">
            <Monitor className="h-3.5 w-3.5" />
            Requested at {formatTime(session.startedAt)}
          </div>

          {isApproved && (
            <div className="mt-4 grid grid-cols-4 gap-2">
              <div className="rounded-xl border border-red-400/10 bg-red-500/5 px-2 py-2 text-center">
                <p className="text-sm font-bold text-red-300">{tabLeft}</p>
                <p className="mt-1 text-[10px] text-slate-400">Tab</p>
              </div>

              <div className="rounded-xl border border-orange-400/10 bg-orange-500/5 px-2 py-2 text-center">
                <p className="text-sm font-bold text-orange-300">
                  {fullscreenExit}
                </p>
                <p className="mt-1 text-[10px] text-slate-400">Full</p>
              </div>

              <div className="rounded-xl border border-blue-400/10 bg-blue-500/5 px-2 py-2 text-center">
                <p className="text-sm font-bold text-blue-300">{copyAttempt}</p>
                <p className="mt-1 text-[10px] text-slate-400">Copy</p>
              </div>

              <div className="rounded-xl border border-pink-400/10 bg-pink-500/5 px-2 py-2 text-center">
                <p className="text-sm font-bold text-pink-300">
                  {pasteAttempt}
                </p>
                <p className="mt-1 text-[10px] text-slate-400">Paste</p>
              </div>
            </div>
          )}

          <div className="mt-4 flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-3 py-3">
            <span className="text-sm text-slate-400">Report</span>

            <span
              className={`text-sm font-semibold ${getReportClass(
                session.reportVisibility
              )}`}
            >
              {getReportLabel(session.reportVisibility)}
            </span>
          </div>

          <div className="mt-4">
            {isPending ? (
              <div className="grid grid-cols-2 gap-2">
                <Button
                  type="button"
                  onClick={() => onApprove(session.id)}
                  className="h-11 bg-emerald-500 text-white hover:bg-emerald-600"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  Approve
                </Button>

                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => onReject(session.id)}
                  className="h-11 border-red-400/20 bg-red-500/10 text-red-200 hover:bg-red-500/20 hover:text-red-100"
                >
                  <XCircle className="h-4 w-4" />
                  Reject
                </Button>
              </div>
            ) : (
              <Button
                variant="ghost"
                onClick={() => onView(session.id)}
                className="h-12 w-full justify-between rounded-2xl border border-white/10 bg-white/5 px-4 hover:bg-white/10 hover:text-white"
              >
                View Details
                <ChevronRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* DESKTOP */}
      <div className="hidden md:block">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex-1">
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <h3 className="text-lg font-bold text-white">
                {session.studentName}
              </h3>

              {isPending && (
                <Badge className="border-yellow-400/20 bg-yellow-500/10 text-yellow-200">
                  Pending Approval
                </Badge>
              )}

              {isRejected && (
                <Badge className="border-red-400/20 bg-red-500/10 text-red-200">
                  Rejected
                </Badge>
              )}

              {isApproved && (
                <>
                  <Badge
                    className={
                      session.status === "completed"
                        ? "border-emerald-400/20 bg-emerald-500/10 text-emerald-200"
                        : "border-blue-400/20 bg-blue-500/10 text-blue-200"
                    }
                  >
                    {session.status === "completed"
                      ? "Completed"
                      : "In Progress"}
                  </Badge>

                  <Badge className={risk.className}>
                    <AlertTriangle className="mr-1 h-3 w-3" />
                    {risk.label}
                  </Badge>
                </>
              )}
            </div>

            <div className="grid gap-3 text-sm md:grid-cols-4">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-slate-400">Status</p>

                <p className={`mt-1 font-semibold ${getStatusClass(session)}`}>
                  {getStatusLabel(session)}
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-slate-400">Requested</p>

                <p className="mt-1 text-white">
                  {formatTime(session.startedAt)}
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-slate-400">Score</p>

                <p
                  className={
                    session.status === "completed"
                      ? "mt-1 font-bold text-emerald-300"
                      : "mt-1 font-bold text-slate-500"
                  }
                >
                  {session.status === "completed"
                    ? `${session.score ?? 0} / ${totalQuestions}`
                    : "Pending"}
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-slate-400">Report</p>

                <p
                  className={`mt-1 font-semibold ${getReportClass(
                    session.reportVisibility
                  )}`}
                >
                  {getReportLabel(session.reportVisibility)}
                </p>
              </div>
            </div>

            {isApproved && (
              <div className="mt-3 grid gap-2 text-xs sm:grid-cols-4">
                <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-slate-300">
                  Tab Left:{" "}
                  <span className="font-bold text-red-300">{tabLeft}</span>
                </div>

                <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-slate-300">
                  Fullscreen:{" "}
                  <span className="font-bold text-orange-300">
                    {fullscreenExit}
                  </span>
                </div>

                <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-slate-300">
                  Copy:{" "}
                  <span className="font-bold text-red-300">{copyAttempt}</span>
                </div>

                <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-slate-300">
                  Paste:{" "}
                  <span className="font-bold text-red-300">{pasteAttempt}</span>
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2 sm:flex-row lg:flex-col">
            {isPending ? (
              <>
                <Button
                  type="button"
                  onClick={() => onApprove(session.id)}
                  className="h-11 bg-emerald-500 text-white hover:bg-emerald-600"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  Approve
                </Button>

                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => onReject(session.id)}
                  className="h-11 border-red-400/20 bg-red-500/10 text-red-200 hover:bg-red-500/20 hover:text-red-100"
                >
                  <XCircle className="h-4 w-4" />
                  Reject
                </Button>
              </>
            ) : (
              <Button
                variant="ghost"
                onClick={() => onView(session.id)}
                className="h-11 border-white/10 bg-white/5 hover:bg-white/10 hover:text-white"
              >
                View Details
              </Button>
            )}
          </div>
        </div>
      </div>
    </GlassCard>
  );
}