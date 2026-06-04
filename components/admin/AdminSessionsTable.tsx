"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";

import DeleteSessionButton from "@/components/admin/DeleteSessionButton";
import { Input } from "@/components/ui/input";

type Session = {
  id: string;
  quiz_id: string | null;
  student_name: string | null;
  student_id: string | null;
  started_at: string | null;
  completed_at: string | null;
  status: string | null;
  approval_status: string | null;
  score: number | null;
  tab_switches: number | null;
};

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

export default function AdminSessionsTable({
  sessions,
}: {
  sessions: Session[];
}) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredSessions = useMemo(() => {
    const query = search.trim().toLowerCase();

    return sessions.filter((session) => {
      const formattedStatus = formatStatus(session.status).toLowerCase();

      const matchesSearch =
        (session.student_name ?? "").toLowerCase().includes(query) ||
        (session.student_id ?? "").toLowerCase().includes(query) ||
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
      <div className="grid gap-3 border-b border-white/10 px-5 py-4 md:grid-cols-[1fr_200px]">
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />

          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search student name, ID, or status..."
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

      <div className="overflow-x-auto">
        <table className="w-full min-w-[1350px] table-auto text-left text-sm">
          <thead className="border-b border-white/10 text-slate-400">
            <tr>
              <th className="w-[180px] px-5 py-3 font-medium">Student</th>
              <th className="w-[180px] px-5 py-3 font-medium">Student ID</th>
              <th className="w-[130px] px-5 py-3 font-medium">Status</th>
              <th className="w-[140px] px-5 py-3 font-medium">Approval</th>
              <th className="w-[100px] px-5 py-3 font-medium">Score</th>
              <th className="w-[140px] px-5 py-3 font-medium">Tab Switches</th>
              <th className="w-[180px] px-5 py-3 font-medium">Started</th>
              <th className="w-[180px] px-5 py-3 font-medium">Completed</th>
              <th className="sticky right-0 w-[140px] bg-[#0b1020] px-5 py-3 font-medium">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {filteredSessions.map((session) => (
              <tr key={session.id} className="border-b border-white/5">
                <td className="px-5 py-4 text-white">
                  {session.student_name || "Unnamed"}
                </td>

                <td className="px-5 py-4 text-slate-400">
                  {session.student_id || "—"}
                </td>

                <td className="px-5 py-4">
                  <span
                    className={`inline-flex max-w-[130px] items-center rounded-full border px-3 py-1 text-xs font-medium ${getStatusClass(
                      session.status,
                    )}`}
                  >
                    <span className="truncate">
                      {formatStatus(session.status)}
                    </span>
                  </span>
                </td>

                <td className="px-5 py-4 text-slate-300">
                  {session.approval_status || "—"}
                </td>

                <td className="px-5 py-4 text-slate-300">
                  {session.score ?? "—"}
                </td>

                <td className="px-5 py-4 text-slate-300">
                  {session.tab_switches ?? 0}
                </td>

                <td className="px-5 py-4 text-slate-400">
                  {session.started_at
                    ? new Date(session.started_at).toLocaleString()
                    : "—"}
                </td>

                <td className="px-5 py-4 text-slate-400">
                  {session.completed_at
                    ? new Date(session.completed_at).toLocaleString()
                    : "—"}
                </td>

                <td className="sticky right-0 bg-[#0b1020] px-5 py-4">
                  <DeleteSessionButton
                    sessionId={session.id}
                    studentName={session.student_name || "this student"}
                  />
                </td>
              </tr>
            ))}

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
    </>
  );
}
