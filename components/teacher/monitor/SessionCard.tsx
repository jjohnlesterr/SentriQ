import { AlertTriangle, CheckCircle2, XCircle } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

import type { QuizSession } from "@/lib/types";

type Props = {
  session: QuizSession;
  onView: (id: string) => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  formatTime: (value: Date | string | undefined) => string;
};

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

  return (
    <Card className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl md:p-6">
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
              <Badge
                className={
                  session.status === "completed"
                    ? "border-emerald-400/20 bg-emerald-500/10 text-emerald-200"
                    : "border-blue-400/20 bg-blue-500/10 text-blue-200"
                }
              >
                {session.status === "completed" ? "Completed" : "In Progress"}
              </Badge>
            )}

            {session.tabSwitches > 0 && (
              <Badge className="border-red-400/20 bg-red-500/10 text-red-200">
                <AlertTriangle className="mr-1 h-3 w-3" />
                {session.tabSwitches} tab switch
                {session.tabSwitches !== 1 ? "es" : ""}
              </Badge>
            )}
          </div>

          <div className="grid gap-3 text-sm md:grid-cols-4">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-slate-400">Current Question</p>

              <p className="mt-1 font-mono text-white">
                {isApproved ? `Q${session.currentQuestion + 1}` : "—"}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-slate-400">Requested</p>

              <p className="mt-1 text-white">
                {formatTime(session.startedAt)}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-slate-400">Tab Switches</p>

              <p
                className={
                  session.tabSwitches > 0
                    ? "mt-1 font-bold text-red-300"
                    : "mt-1 font-bold text-cyan-300"
                }
              >
                {session.tabSwitches}
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
          </div>
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
              variant="secondary"
              onClick={() => onView(session.id)}
              className="h-11 border-white/10 bg-white/5 hover:bg-white/10 hover:text-white"
            >
              View Details
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}