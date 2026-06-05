"use client";

import { useMemo, useState } from "react";
import {
  Activity,
  AlertTriangle,
  BookOpen,
  Clock,
  Copy,
  Eye,
  FileQuestion,
  Maximize,
  Search,
  ShieldAlert,
  User,
} from "lucide-react";

import DeleteSessionButton from "@/components/admin/DeleteSessionButton";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

type SessionEvent = {
  id: string;
  session_id: string | null;
  type: string | null;
  timestamp: string | null;
  description: string | null;
  duration_seconds: number | null;
};

type Question = {
  id: string;
  quiz_id: string | null;
  text: string | null;
  position: number | null;
};

type Session = {
  id: string;
  quiz_id: string | null;
  quiz_title: string | null;
  quiz_code: string | null;
  student_name: string | null;
  student_id: string | null;
  started_at: string | null;
  completed_at: string | null;
  timed_out_at?: string | null;
  last_seen_at?: string | null;
  current_question?: number | null;
  answers?: Record<string, unknown> | null;
  status: string | null;
  approval_status: string | null;
  report_visibility?: string | null;
  score: number | null;
  tab_switches: number | null;
  events: SessionEvent[];
  questions: Question[];
};

type RiskLevel = "low" | "medium" | "high";

function formatStatus(status: string | null) {
  if (status === "in-progress") return "In Progress";
  if (status === "completed") return "Completed";
  if (status === "timed-out") return "Timed Out";
  if (status === "abandoned") return "Abandoned";

  return status || "Unknown";
}

function getStatusClass(status: string | null) {
  if (status === "completed") {
    return "border-emerald-400/20 bg-emerald-500/10 text-emerald-200";
  }

  if (status === "timed-out") {
    return "border-yellow-400/20 bg-yellow-500/10 text-yellow-200";
  }

  if (status === "abandoned") {
    return "border-orange-400/20 bg-orange-500/10 text-orange-200";
  }

  if (status === "in-progress") {
    return "border-cyan-400/20 bg-cyan-400/10 text-cyan-200";
  }

  return "border-white/10 bg-white/5 text-slate-300";
}

function formatApproval(approval: string | null) {
  if (approval === "approved") return "Approved";
  if (approval === "rejected") return "Rejected";
  if (approval === "pending") return "Pending";

  return approval || "—";
}

function getApprovalClass(approval: string | null) {
  if (approval === "approved") {
    return "border-emerald-400/20 bg-emerald-500/10 text-emerald-200";
  }

  if (approval === "rejected") {
    return "border-red-400/20 bg-red-500/10 text-red-200";
  }

  if (approval === "pending") {
    return "border-yellow-400/20 bg-yellow-500/10 text-yellow-200";
  }

  return "border-white/10 bg-white/5 text-slate-300";
}

function formatDateTime(dateValue: string | null | undefined) {
  if (!dateValue) return "—";
  return new Date(dateValue).toLocaleString();
}

function formatTime(dateValue: string | null) {
  if (!dateValue) return "—";

  return new Date(dateValue).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDuration(startedAt: string | null, completedAt: string | null) {
  if (!startedAt || !completedAt) return "—";

  const diffSeconds = Math.max(
    0,
    Math.floor(
      (new Date(completedAt).getTime() - new Date(startedAt).getTime()) / 1000,
    ),
  );

  const minutes = Math.floor(diffSeconds / 60);
  const seconds = diffSeconds % 60;

  if (minutes <= 0) return `${seconds}s`;
  return `${minutes}m ${seconds}s`;
}

function truncateMiddle(value: string | null, start = 8, end = 5) {
  if (!value) return "—";
  if (value.length <= start + end + 3) return value;

  return `${value.slice(0, start)}...${value.slice(-end)}`;
}

function getSuspiciousEventCount(events: SessionEvent[]) {
  return events.filter((event) => {
    const type = event.type ?? "";

    return (
      type.includes("copy") ||
      type.includes("paste") ||
      type.includes("fullscreen") ||
      type.includes("tab")
    );
  }).length;
}

function getRiskLevel(session: Session): RiskLevel {
  const tabSwitches = session.tab_switches ?? 0;
  const suspiciousEvents = getSuspiciousEventCount(session.events);

  if (tabSwitches >= 4 || suspiciousEvents >= 4) return "high";
  if (tabSwitches >= 1 || suspiciousEvents >= 1) return "medium";

  return "low";
}

function getRiskClass(risk: RiskLevel) {
  if (risk === "high") {
    return "border-red-400/20 bg-red-500/10 text-red-200";
  }

  if (risk === "medium") {
    return "border-yellow-400/20 bg-yellow-500/10 text-yellow-200";
  }

  return "border-emerald-400/20 bg-emerald-500/10 text-emerald-200";
}

function getRiskLabel(risk: RiskLevel) {
  if (risk === "high") return "High Risk";
  if (risk === "medium") return "Medium Risk";
  return "Low Risk";
}

function formatEventType(type: string | null) {
  if (!type) return "Activity";

  return type
    .replaceAll("-", " ")
    .replaceAll("_", " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function getEventIcon(type: string | null) {
  if (type?.includes("copy") || type?.includes("paste")) return Copy;
  if (type?.includes("fullscreen")) return Maximize;
  if (type?.includes("tab")) return AlertTriangle;
  if (type === "rejected") return ShieldAlert;

  return Activity;
}

function getQuestionLabel(session: Session, answerKey: string) {
  const numericKey = Number(answerKey);

  if (Number.isNaN(numericKey)) return `Question ${answerKey}`;

  const question =
    session.questions.find((item) => item.position === numericKey) ??
    session.questions[numericKey];

  return question?.text || `Question ${numericKey + 1}`;
}

function formatAnswerValue(value: unknown) {
  if (value === null || value === undefined) return "—";

  if (typeof value === "string") return value;
  if (typeof value === "number") return String(value);
  if (typeof value === "boolean") return value ? "True" : "False";

  return JSON.stringify(value);
}

export default function AdminSessionsTable({
  sessions,
}: {
  sessions: Session[];
}) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);

  const filteredSessions = useMemo(() => {
    const query = search.trim().toLowerCase();

    return sessions.filter((session) => {
      const formattedStatus = formatStatus(session.status).toLowerCase();

      const matchesSearch =
        (session.student_name ?? "").toLowerCase().includes(query) ||
        (session.student_id ?? "").toLowerCase().includes(query) ||
        (session.quiz_title ?? "").toLowerCase().includes(query) ||
        (session.quiz_code ?? "").toLowerCase().includes(query) ||
        (session.status ?? "").toLowerCase().includes(query) ||
        formattedStatus.includes(query) ||
        (session.approval_status ?? "").toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "all" ? true : session.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [sessions, search, statusFilter]);

  const statuses = Array.from(
    new Set(sessions.map((session) => session.status).filter(Boolean)),
  );

  return (
    <>
      <div className="grid gap-3 border-b border-white/10 px-5 py-4 md:grid-cols-[1fr_220px]">
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />

          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search student, quiz, ID, or status..."
            className="h-11 pl-11"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-11 rounded-xl border border-white/10 bg-black/20 px-4 text-sm text-white outline-none"
        >
          <option value="all">All statuses</option>
          {statuses.map((status) => (
            <option key={status} value={status ?? ""}>
              {formatStatus(status)}
            </option>
          ))}
        </select>
      </div>

      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[1320px] table-auto text-left text-sm">
          <thead className="border-b border-white/10 text-slate-400">
            <tr>
              <th className="w-[220px] px-5 py-3 font-medium">Student</th>
              <th className="w-[260px] px-5 py-3 font-medium">Quiz</th>
              <th className="w-[130px] px-5 py-3 font-medium">Status</th>
              <th className="w-[130px] px-5 py-3 font-medium">Risk</th>
              <th className="w-[100px] px-5 py-3 font-medium">Score</th>
              <th className="w-[120px] px-5 py-3 font-medium">Duration</th>
              <th className="w-[140px] px-5 py-3 font-medium">Events</th>
              <th className="w-[160px] px-5 py-3 font-medium">Started</th>
              <th className="w-[230px] px-5 py-3 font-medium">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredSessions.map((session) => {
              const risk = getRiskLevel(session);

              return (
                <tr key={session.id} className="border-b border-white/5">
                  <td className="px-5 py-4">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10 text-cyan-200">
                        <User className="h-5 w-5" />
                      </div>

                      <div className="min-w-0">
                        <p
                          title={session.student_name || "Unnamed"}
                          className="max-w-[160px] truncate font-semibold text-white"
                        >
                          {session.student_name || "Unnamed"}
                        </p>

                        <p
                          title={session.student_id || "—"}
                          className="mt-1 truncate text-xs text-slate-500"
                        >
                          ID: {truncateMiddle(session.student_id)}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-5 py-4">
                    <p
                      title={session.quiz_title || "Unknown quiz"}
                      className="max-w-[220px] truncate font-medium text-white"
                    >
                      {session.quiz_title || "Unknown quiz"}
                    </p>

                    <p className="mt-1 text-xs text-cyan-300">
                      Code: {session.quiz_code || "—"}
                    </p>
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${getStatusClass(
                        session.status,
                      )}`}
                    >
                      {formatStatus(session.status)}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${getRiskClass(
                        risk,
                      )}`}
                    >
                      {getRiskLabel(risk)}
                    </span>
                  </td>

                  <td className="px-5 py-4 text-slate-300">
                    {session.score ?? "—"}
                  </td>

                  <td className="px-5 py-4 text-slate-300">
                    {formatDuration(session.started_at, session.completed_at)}
                  </td>

                  <td className="px-5 py-4 text-slate-300">
                    {session.events.length} logs
                  </td>

                  <td className="px-5 py-4 text-slate-400">
                    {formatDateTime(session.started_at)}
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedSession(session)}
                        className="h-10 w-[95px]"
                      >
                        <Eye className="h-4 w-4" />
                        View
                      </Button>

                      <DeleteSessionButton
                        sessionId={session.id}
                        studentName={session.student_name || "this student"}
                      />
                    </div>
                  </td>
                </tr>
              );
            })}

            {!filteredSessions.length && (
              <tr>
                <td
                  colSpan={9}
                  className="px-5 py-10 text-center text-slate-400"
                >
                  No sessions found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="divide-y divide-white/10 md:hidden">
        {filteredSessions.map((session) => {
          const risk = getRiskLevel(session);

          return (
            <div key={session.id} className="space-y-4 px-5 py-5">
              <div className="flex min-w-0 items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10 text-cyan-200">
                  <User className="h-5 w-5" />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-white">
                    {session.student_name || "Unnamed"}
                  </p>

                  <p className="mt-1 truncate text-xs text-slate-500">
                    {session.quiz_title || "Unknown quiz"}
                  </p>

                  <div className="mt-2 flex flex-wrap gap-2">
                    <span
                      className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${getStatusClass(
                        session.status,
                      )}`}
                    >
                      {formatStatus(session.status)}
                    </span>

                    <span
                      className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${getRiskClass(
                        risk,
                      )}`}
                    >
                      {getRiskLabel(risk)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid gap-3 rounded-2xl border border-white/10 bg-white/[0.02] p-4 text-sm">
                <div className="flex justify-between gap-3">
                  <span className="text-slate-500">Score</span>
                  <span className="text-slate-300">{session.score ?? "—"}</span>
                </div>

                <div className="flex justify-between gap-3">
                  <span className="text-slate-500">Duration</span>
                  <span className="text-slate-300">
                    {formatDuration(session.started_at, session.completed_at)}
                  </span>
                </div>

                <div className="flex justify-between gap-3">
                  <span className="text-slate-500">Tab Switches</span>
                  <span className="text-slate-300">
                    {session.tab_switches ?? 0}
                  </span>
                </div>

                <div className="flex justify-between gap-3">
                  <span className="text-slate-500">Logs</span>
                  <span className="text-slate-300">
                    {session.events.length}
                  </span>
                </div>
              </div>

              <div className="grid gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setSelectedSession(session)}
                  className="h-11 w-full"
                >
                  <Eye className="h-4 w-4" />
                  View Details
                </Button>

                <DeleteSessionButton
                  sessionId={session.id}
                  studentName={session.student_name || "this student"}
                />
              </div>
            </div>
          );
        })}

        {!filteredSessions.length && (
          <div className="px-5 py-10 text-center text-slate-400">
            No sessions found.
          </div>
        )}
      </div>

      <Dialog
        open={selectedSession !== null}
        onOpenChange={() => setSelectedSession(null)}
      >
        <DialogContent className="max-h-[85vh] w-[calc(100vw-2rem)] max-w-5xl overflow-y-auto border-cyan-400/20 bg-slate-950 p-5 sm:p-6">
          {selectedSession && (
            <>
              <DialogHeader>
                <DialogTitle className="break-words text-2xl">
                  Session Details
                </DialogTitle>

                <DialogDescription>
                  Review student result, risk indicators, answers, and activity
                  timeline.
                </DialogDescription>
              </DialogHeader>

              <div className="mt-5 grid gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm md:grid-cols-2">
                <div>
                  <p className="text-slate-500">Student</p>
                  <p className="mt-1 font-semibold text-white">
                    {selectedSession.student_name || "Unnamed"}
                  </p>
                </div>

                <div>
                  <p className="text-slate-500">Student ID</p>
                  <p className="mt-1 break-words text-white">
                    {selectedSession.student_id || "—"}
                  </p>
                </div>

                <div>
                  <p className="text-slate-500">Quiz</p>
                  <p className="mt-1 font-semibold text-white">
                    {selectedSession.quiz_title || "Unknown quiz"}
                  </p>
                  <p className="mt-1 text-xs text-cyan-300">
                    Code: {selectedSession.quiz_code || "—"}
                  </p>
                </div>

                <div>
                  <p className="text-slate-500">Session ID</p>
                  <p className="mt-1 break-words text-white">
                    {selectedSession.id}
                  </p>
                </div>

                <div>
                  <p className="text-slate-500">Status</p>
                  <span
                    className={`mt-1 inline-flex rounded-full border px-3 py-1 text-xs font-medium ${getStatusClass(
                      selectedSession.status,
                    )}`}
                  >
                    {formatStatus(selectedSession.status)}
                  </span>
                </div>

                <div>
                  <p className="text-slate-500">Approval</p>
                  <span
                    className={`mt-1 inline-flex rounded-full border px-3 py-1 text-xs font-medium ${getApprovalClass(
                      selectedSession.approval_status,
                    )}`}
                  >
                    {formatApproval(selectedSession.approval_status)}
                  </span>
                </div>

                <div>
                  <p className="text-slate-500">Risk Level</p>
                  <span
                    className={`mt-1 inline-flex rounded-full border px-3 py-1 text-xs font-medium ${getRiskClass(
                      getRiskLevel(selectedSession),
                    )}`}
                  >
                    {getRiskLabel(getRiskLevel(selectedSession))}
                  </span>
                </div>

                <div>
                  <p className="text-slate-500">Score</p>
                  <p className="mt-1 text-white">
                    {selectedSession.score ?? "—"}
                  </p>
                </div>

                <div>
                  <p className="text-slate-500">Started</p>
                  <p className="mt-1 text-white">
                    {formatDateTime(selectedSession.started_at)}
                  </p>
                </div>

                <div>
                  <p className="text-slate-500">Completed</p>
                  <p className="mt-1 text-white">
                    {formatDateTime(selectedSession.completed_at)}
                  </p>
                </div>

                <div>
                  <p className="text-slate-500">Duration</p>
                  <p className="mt-1 flex items-center gap-2 text-white">
                    <Clock className="h-4 w-4 text-slate-500" />
                    {formatDuration(
                      selectedSession.started_at,
                      selectedSession.completed_at,
                    )}
                  </p>
                </div>

                <div>
                  <p className="text-slate-500">Tab Switches</p>
                  <p className="mt-1 text-white">
                    {selectedSession.tab_switches ?? 0}
                  </p>
                </div>
              </div>

              <div className="mt-5 grid gap-5 lg:grid-cols-2">
                <div>
                  <h3 className="flex items-center gap-2 text-lg font-semibold text-white">
                    <FileQuestion className="h-5 w-5 text-cyan-300" />
                    Submitted Answers
                  </h3>

                  <div className="mt-4 space-y-3">
                    {selectedSession.answers &&
                    Object.keys(selectedSession.answers).length > 0 ? (
                      Object.entries(selectedSession.answers).map(
                        ([key, value]) => (
                          <div
                            key={key}
                            className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"
                          >
                            <p className="text-xs font-semibold uppercase tracking-wide text-cyan-300">
                              {getQuestionLabel(selectedSession, key)}
                            </p>

                            <p className="mt-2 break-words text-sm text-white">
                              Answer:{" "}
                              <span className="font-semibold">
                                {formatAnswerValue(value)}
                              </span>
                            </p>
                          </div>
                        ),
                      )
                    ) : (
                      <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-8 text-center text-slate-400">
                        No submitted answers found.
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="flex items-center gap-2 text-lg font-semibold text-white">
                    <Activity className="h-5 w-5 text-cyan-300" />
                    Activity Timeline ({selectedSession.events.length})
                  </h3>

                  <div className="mt-4 space-y-3">
                    {selectedSession.events.map((event) => {
                      const Icon = getEventIcon(event.type);

                      return (
                        <div
                          key={event.id}
                          className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"
                        >
                          <div className="flex gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10 text-cyan-200">
                              <Icon className="h-5 w-5" />
                            </div>

                            <div className="min-w-0 flex-1">
                              <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                                <p className="font-semibold text-white">
                                  {formatEventType(event.type)}
                                </p>

                                <p className="text-xs text-slate-500">
                                  {formatTime(event.timestamp)}
                                </p>
                              </div>

                              <p className="mt-1 break-words text-sm text-slate-400">
                                {event.description || "No description"}
                              </p>

                              {event.duration_seconds !== null && (
                                <p className="mt-2 text-xs text-cyan-300">
                                  Duration: {event.duration_seconds}s
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}

                    {!selectedSession.events.length && (
                      <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-8 text-center text-slate-400">
                        No activity logs found for this session.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
