import {
  AlertTriangle,
  CheckCircle2,
  Clipboard,
  ClipboardPaste,
  Clock,
  Maximize,
  RotateCcw,
  ShieldAlert,
  XCircle,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import type { Quiz, QuizSession, SessionEventType } from "@/lib/types";

type Props = {
  open: boolean;
  session?: QuizSession;
  quiz: Quiz | null;
  onOpenChange: (open: boolean) => void;
  formatTime: (value: Date | string | undefined) => string;
};

function getEventLabel(type: SessionEventType) {
  const labels: Record<SessionEventType, string> = {
    "join-requested": "Join Requested",
    approved: "Approved",
    rejected: "Rejected",
    started: "Started",
    "tab-left": "Left Tab",
    "tab-returned": "Returned to Quiz",
    "fullscreen-exit": "Exited Fullscreen",
    "copy-attempt": "Copy Attempt",
    "paste-attempt": "Paste Attempt",
    completed: "Completed",
  };

  return labels[type];
}

function getEventIcon(type: SessionEventType) {
  if (type === "tab-left") {
    return <AlertTriangle className="h-4 w-4 shrink-0 text-red-300" />;
  }

  if (type === "tab-returned") {
    return <RotateCcw className="h-4 w-4 shrink-0 text-cyan-300" />;
  }

  if (type === "fullscreen-exit") {
    return <Maximize className="h-4 w-4 shrink-0 text-orange-300" />;
  }

  if (type === "copy-attempt") {
    return <Clipboard className="h-4 w-4 shrink-0 text-red-300" />;
  }

  if (type === "paste-attempt") {
    return <ClipboardPaste className="h-4 w-4 shrink-0 text-red-300" />;
  }

  if (type === "completed" || type === "approved") {
    return <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-300" />;
  }

  if (type === "rejected") {
    return <ShieldAlert className="h-4 w-4 shrink-0 text-red-300" />;
  }

  return <Clock className="h-4 w-4 shrink-0 text-blue-300" />;
}

function countEvents(session: QuizSession, type: string) {
  return session.events.filter((event) => event.type === type).length;
}

function normalize(value: string) {
  return value.trim().toLowerCase();
}

function getStudentAnswerText(
  question: Quiz["questions"][number],
  answer: number | string | undefined
) {
  if (answer === undefined || answer === "") return "No answer";

  if (question.type === "identification") {
    return String(answer);
  }

  if (typeof answer === "number") {
    return question.options[answer] ?? "Invalid answer";
  }

  return String(answer);
}

function getCorrectAnswerText(question: Quiz["questions"][number]) {
  if (question.type === "identification") {
    return question.correctTextAnswer || "No correct answer set";
  }

  return question.options[question.correctAnswer] || "No correct answer set";
}

function isAnswerCorrect(
  question: Quiz["questions"][number],
  answer: number | string | undefined
) {
  if (answer === undefined || answer === "") return false;

  if (question.type === "identification") {
    return (
      normalize(String(answer)) ===
      normalize(question.correctTextAnswer || "")
    );
  }

  return answer === question.correctAnswer;
}

export default function SessionDetailsDialog({
  open,
  session,
  quiz,
  onOpenChange,
  formatTime,
}: Props) {
  const tabLeft = session ? countEvents(session, "tab-left") : 0;
  const fullscreenExit = session ? countEvents(session, "fullscreen-exit") : 0;
  const copyAttempt = session ? countEvents(session, "copy-attempt") : 0;
  const pasteAttempt = session ? countEvents(session, "paste-attempt") : 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl border-white/10 bg-slate-950/95 text-white">
        <DialogHeader>
          <DialogTitle className="text-xl sm:text-2xl">
            {session?.studentName || "Student"} - Session Details
          </DialogTitle>

          <DialogDescription className="text-slate-400">
            Activity monitoring and answer review.
          </DialogDescription>
        </DialogHeader>

        {session ? (
          <div className="space-y-5 sm:space-y-6">
            <div className="grid gap-3 text-sm sm:grid-cols-4">
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

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-slate-400">Report Access</p>
                <p className="mt-1 font-semibold capitalize text-cyan-300">
                  {session.reportVisibility}
                </p>
              </div>
            </div>

            <div className="grid gap-2 text-xs sm:grid-cols-4">
              <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-slate-300">
                Tab Left:{" "}
                <span className="font-bold text-red-300">{tabLeft}</span>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-slate-300">
                Fullscreen Exit:{" "}
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

            <div>
              <h4 className="mb-3 text-base font-semibold text-white">
                Student Answer Review
              </h4>

              <div className="max-h-80 space-y-3 overflow-y-auto pr-1">
                {quiz?.questions.map((question, index) => {
                  const answer = session.answers[index];
                  const correct = isAnswerCorrect(question, answer);

                  return (
                    <div
                      key={question.id}
                      className="rounded-2xl border border-white/10 bg-white/5 p-4"
                    >
                      <div className="mb-3 flex items-center justify-between gap-3">
                        <p className="font-mono text-xs uppercase tracking-[0.2em] text-slate-400">
                          Question {index + 1}
                        </p>

                        <span
                          className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold ${
                            correct
                              ? "border-emerald-400/20 bg-emerald-500/10 text-emerald-300"
                              : "border-red-400/20 bg-red-500/10 text-red-300"
                          }`}
                        >
                          {correct ? (
                            <CheckCircle2 className="h-3 w-3" />
                          ) : (
                            <XCircle className="h-3 w-3" />
                          )}
                          {correct ? "Correct" : "Wrong"}
                        </span>
                      </div>

                      <p className="text-sm font-semibold text-white">
                        {question.text}
                      </p>

                      <div className="mt-3 grid gap-3 text-sm md:grid-cols-2">
                        <div className="rounded-xl border border-white/10 bg-slate-950/40 p-3">
                          <p className="text-xs text-slate-500">
                            Student Answer
                          </p>
                          <p className="mt-1 text-slate-200">
                            {getStudentAnswerText(question, answer)}
                          </p>
                        </div>

                        <div className="rounded-xl border border-emerald-400/20 bg-emerald-500/10 p-3">
                          <p className="text-xs text-emerald-200/80">
                            Correct Answer
                          </p>
                          <p className="mt-1 font-semibold text-emerald-200">
                            {getCorrectAnswerText(question)}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                }) || (
                  <p className="text-sm text-slate-400">
                    Quiz questions not available.
                  </p>
                )}
              </div>
            </div>

            <div>
              <h4 className="mb-3 text-base font-semibold text-white">
                Activity Timeline
              </h4>

              <div className="max-h-64 space-y-2 overflow-y-auto pr-1">
                {session.events.length === 0 ? (
                  <p className="text-sm text-slate-400">
                    No events recorded.
                  </p>
                ) : (
                  session.events.map((event, index) => (
                    <div
                      key={`${event.type}-${index}`}
                      className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-3"
                    >
                      {getEventIcon(event.type)}

                      <div className="min-w-0">
                        <p className="text-sm font-medium text-white">
                          {getEventLabel(event.type)}
                        </p>

                        {event.description && (
                          <p className="mt-1 text-xs leading-5 text-slate-300">
                            {event.description}
                          </p>
                        )}

                        <p className="mt-1 text-xs text-slate-500">
                          {formatTime(event.timestamp)}
                          {event.durationSeconds !== undefined &&
                            ` • ${event.durationSeconds}s away`}
                        </p>
                      </div>
                    </div>
                  ))
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