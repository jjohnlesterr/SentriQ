"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";

type SessionEvent = {
  id: string;
  session_id: string | null;
  event_type: string | null;
  event_data: unknown;
  created_at: string | null;
};

export default function AdminEventsTable({
  events,
}: {
  events: SessionEvent[];
}) {
  const [search, setSearch] = useState("");
  const [eventTypeFilter, setEventTypeFilter] = useState("all");

  const eventTypes = Array.from(
    new Set(events.map((event) => event.event_type).filter(Boolean)),
  );

  const filteredEvents = useMemo(() => {
    const query = search.trim().toLowerCase();

    return events.filter((event) => {
      const eventDataText = event.event_data
        ? JSON.stringify(event.event_data).toLowerCase()
        : "";

      const matchesSearch =
        (event.event_type ?? "").toLowerCase().includes(query) ||
        (event.session_id ?? "").toLowerCase().includes(query) ||
        eventDataText.includes(query);

      const matchesEventType =
        eventTypeFilter === "all"
          ? true
          : event.event_type === eventTypeFilter;

      return matchesSearch && matchesEventType;
    });
  }, [events, search, eventTypeFilter]);

  return (
    <>
      <div className="grid gap-3 border-b border-white/10 px-5 py-4 md:grid-cols-[1fr_220px]">
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />

          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search event type, session ID, or event data..."
            className="h-11 pl-11"
          />
        </div>

        <select
          value={eventTypeFilter}
          onChange={(e) => setEventTypeFilter(e.target.value)}
          className="h-11 rounded-xl border border-white/10 bg-black/20 px-4 text-sm text-white outline-none"
        >
          <option value="all">All event types</option>
          {eventTypes.map((eventType) => (
            <option key={eventType} value={eventType ?? ""}>
              {eventType}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="border-b border-white/10 text-slate-400">
            <tr>
              <th className="px-5 py-3 font-medium">Event Type</th>
              <th className="px-5 py-3 font-medium">Session ID</th>
              <th className="px-5 py-3 font-medium">Event Data</th>
              <th className="px-5 py-3 font-medium">Created</th>
            </tr>
          </thead>

          <tbody>
            {filteredEvents.map((event) => (
              <tr key={event.id} className="border-b border-white/5">
                <td className="px-5 py-4">
                  <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs text-cyan-200">
                    {event.event_type || "unknown"}
                  </span>
                </td>

                <td className="px-5 py-4 text-slate-400">
                  {event.session_id || "—"}
                </td>

                <td className="px-5 py-4 text-slate-300">
                  <pre className="max-w-md whitespace-pre-wrap break-words rounded-lg border border-white/10 bg-black/20 p-3 text-xs text-slate-300">
                    {event.event_data
                      ? JSON.stringify(event.event_data, null, 2)
                      : "—"}
                  </pre>
                </td>

                <td className="px-5 py-4 text-slate-400">
                  {event.created_at
                    ? new Date(event.created_at).toLocaleString()
                    : "—"}
                </td>
              </tr>
            ))}

            {!filteredEvents.length && (
              <tr>
                <td
                  colSpan={4}
                  className="px-5 py-10 text-center text-slate-400"
                >
                  No activity logs found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}