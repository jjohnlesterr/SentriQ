"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";

import DeleteEventButton from "@/components/admin/DeleteEventButton";
import { Input } from "@/components/ui/input";

type SessionEvent = {
  id: string;
  session_id: string | null;
  type: string | null;
  timestamp: string | null;
  description: string | null;
  duration_seconds: number | null;
};

export default function AdminEventsTable({
  events,
}: {
  events: SessionEvent[];
}) {
  const [search, setSearch] = useState("");
  const [eventTypeFilter, setEventTypeFilter] = useState("all");

  const eventTypes = Array.from(
    new Set(events.map((event) => event.type).filter(Boolean)),
  );

  const filteredEvents = useMemo(() => {
    const query = search.trim().toLowerCase();

    return events.filter((event) => {
      const matchesSearch =
        (event.type ?? "").toLowerCase().includes(query) ||
        (event.session_id ?? "").toLowerCase().includes(query) ||
        (event.description ?? "").toLowerCase().includes(query);

      const matchesEventType =
        eventTypeFilter === "all" ? true : event.type === eventTypeFilter;

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
            placeholder="Search event type, session ID, or description..."
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
        <table className="w-full min-w-[1350px] table-auto text-left text-sm">
          <thead className="border-b border-white/10 text-slate-400">
            <tr>
              <th className="w-[190px] px-5 py-3 font-medium">Event Type</th>
              <th className="w-[280px] px-5 py-3 font-medium">Session ID</th>
              <th className="w-[430px] px-5 py-3 font-medium">Description</th>
              <th className="w-[120px] px-5 py-3 font-medium">Duration</th>
              <th className="w-[220px] px-5 py-3 font-medium">Timestamp</th>
              <th className="sticky right-0 w-[120px] bg-[#0b1020] px-5 py-3 font-medium">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {filteredEvents.map((event) => (
              <tr key={event.id} className="border-b border-white/5">
                <td className="px-5 py-4">
                  <span className="inline-flex whitespace-nowrap rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs text-cyan-200">
                    {event.type || "unknown"}
                  </span>
                </td>

                <td className="px-5 py-4 text-slate-400">
                  <span className="block max-w-[250px] truncate">
                    {event.session_id || "—"}
                  </span>
                </td>

                <td className="px-5 py-4 text-slate-300">
                  {event.description || "—"}
                </td>

                <td className="px-5 py-4 text-slate-400">
                  {event.duration_seconds !== null
                    ? `${event.duration_seconds}s`
                    : "—"}
                </td>

                <td className="px-5 py-4 text-slate-400">
                  {event.timestamp
                    ? new Date(event.timestamp).toLocaleString()
                    : "—"}
                </td>

                <td className="sticky right-0 bg-[#0b1020] px-5 py-4">
                  <DeleteEventButton eventId={event.id} />
                </td>
              </tr>
            ))}

            {!filteredEvents.length && (
              <tr>
                <td
                  colSpan={6}
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
