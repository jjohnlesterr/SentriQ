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
      const matchesSearch =
        (session.student_name ?? "").toLowerCase().includes(query) ||
        (session.student_id ?? "").toLowerCase().includes(query) ||
        (session.status ?? "").toLowerCase().includes(query) ||
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
              {status}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[1100px] text-left text-sm">
          <thead className="border-b border-white/10 text-slate-400">
            <tr>
              <th className="px-5 py-3 font-medium">Student</th>
              <th className="px-5 py-3 font-medium">Student ID</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium">Approval</th>
              <th className="px-5 py-3 font-medium">Score</th>
              <th className="px-5 py-3 font-medium">Tab Switches</th>
              <th className="px-5 py-3 font-medium">Started</th>
              <th className="px-5 py-3 font-medium">Completed</th>
              <th className="px-5 py-3 font-medium">Actions</th>
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
                  <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs text-cyan-200">
                    {session.status || "unknown"}
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

                <td className="px-5 py-4">
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