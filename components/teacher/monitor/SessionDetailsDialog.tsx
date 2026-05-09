import {
  AlertTriangle,
  CheckCircle2,
  Clock,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import type { Quiz, QuizSession } from "@/lib/types";

type Props = {
  open: boolean;
  session?: QuizSession;
  quiz: Quiz | null;
  onOpenChange: (open: boolean) => void;
  formatTime: (value: Date | string | undefined) => string;
};

export default function SessionDetailsDialog({
  open,
  session,
  quiz,
  onOpenChange,
  formatTime,
}: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl border-white/10 bg-slate-950/95 text-white">
        <DialogHeader>
          <DialogTitle className="text-xl sm:text-2xl">
            {session?.studentName || "Student"} - Session Details
          </DialogTitle>

          <DialogDescription className="text-slate-400">
            Real-time monitoring information
          </DialogDescription>
        </DialogHeader>

        {session ? (
          <div className="space-y-5 sm:space-y-6">
            <div className="grid gap-3 text-sm sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-slate-400">Status</p>

                <p className="mt-1 font-semibold capitalize text-white">
                  {session.status}
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-slate-400">Current Question</p>

                <p className="mt-1 font-mono text-white">
                  Q{session.currentQuestion + 1}
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
            </div>

            <div>
              <h4 className="mb-3 text-base font-semibold text-white">
                Activity Log
              </h4>

              <div className="max-h-56 space-y-2 overflow-y-auto pr-1 sm:max-h-64">
                {session.events.length === 0 ? (
                  <p className="text-sm text-slate-400">
                    No events recorded.
                  </p>
                ) : (
                  session.events.map((event, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-3"
                    >
                      {event.type === "started" && (
                        <Clock className="h-4 w-4 shrink-0 text-blue-300" />
                      )}

                      {event.type === "tab-left" && (
                        <AlertTriangle className="h-4 w-4 shrink-0 text-red-300" />
                      )}

                      {event.type === "completed" && (
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-300" />
                      )}

                      <div className="min-w-0">
                        <p className="text-sm capitalize text-white">
                          {event.type === "tab-left"
                            ? "Tab Left"
                            : event.type}
                        </p>

                        <p className="text-xs text-slate-400">
                          {formatTime(event.timestamp)}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div>
              <h4 className="mb-3 text-base font-semibold text-white">
                Answers Provided
              </h4>

              <div className="grid grid-cols-5 gap-2 sm:grid-cols-8 md:grid-cols-10">
                {Array.from({ length: quiz?.questions.length || 0 }).map(
                  (_, index) => (
                    <div
                      key={index}
                      className={
                        session.answers[index] !== undefined
                          ? "flex aspect-square items-center justify-center rounded-xl border border-blue-400/20 bg-blue-500/10 text-xs font-bold text-blue-200 sm:text-sm"
                          : "flex aspect-square items-center justify-center rounded-xl border border-white/10 bg-white/5 text-xs font-bold text-slate-500 sm:text-sm"
                      }
                    >
                      {index + 1}
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        ) : (
          <p className="text-sm text-slate-400">Session not found.</p>
        )}
      </DialogContent>
    </Dialog>
  );
}