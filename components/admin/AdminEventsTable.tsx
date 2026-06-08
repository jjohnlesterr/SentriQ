"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Clipboard,
  ClipboardPaste,
  Eye,
  Loader2,
  Maximize,
  RefreshCcw,
  Search,
  ShieldAlert,
  TimerOff,
} from "lucide-react";

import DeleteEventButton from "@/components/admin/DeleteEventButton";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { getAdminEventsPageAction } from "@/lib/actions/admin.actions";

type SessionEvent = {
  id: string;
  session_id: string | null;
  type: string | null;
  timestamp: string | null;
  description: string | null;
  duration_seconds: number | null;
  student_name: string | null;
  student_id: string | null;
  session_status: string | null;
  session_score: number | null;
  quiz_title: string | null;
  quiz_code: string | null;
};

function formatDateTime(dateValue: string | null) {
  if (!dateValue) return "—";
  return new Date(dateValue).toLocaleString();
}

function formatEventType(type: string | null) {
  if (!type) return "Activity";

  return type
    .replaceAll("-", " ")
    .replaceAll("_", " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function truncateMiddle(value: string | null, start = 8, end = 5) {
  if (!value) return "—";
  if (value.length <= start + end + 3) return value;

  return `${value.slice(0, start)}...${value.slice(-end)}`;
}

function formatStatus(status: string | null) {
  if (status === "in-progress") return "In Progress";
  if (status === "completed") return "Completed";
  if (status === "timed-out") return "Timed Out";
  if (status === "abandoned") return "Abandoned";

  return status || "—";
}

function getEventIcon(type: string | null) {
  if (type === "approved" || type === "completed") return CheckCircle2;
  if (type === "rejected") return ShieldAlert;
  if (type === "time-expired" || type === "timed-out") return TimerOff;
  if (type === "fullscreen-exit") return Maximize;
  if (type === "copy-attempt") return Clipboard;
  if (type === "paste-attempt") return ClipboardPaste;
  if (type?.includes("return")) return RefreshCcw;
  if (type?.includes("tab")) return AlertTriangle;
  if (type?.includes("abandoned")) return ShieldAlert;

  return Activity;
}

function getEventClass(type: string | null) {
  if (!type) return "border-white/10 bg-white/5 text-slate-300";

  if (type === "approved" || type === "completed") {
    return "border-emerald-400/20 bg-emerald-500/10 text-emerald-200";
  }

  if (type === "rejected" || type.includes("abandoned")) {
    return "border-red-400/20 bg-red-500/10 text-red-200";
  }

  if (type === "time-expired" || type === "timed-out") {
    return "border-yellow-400/20 bg-yellow-500/10 text-yellow-200";
  }

  if (
    type.includes("copy") ||
    type.includes("paste") ||
    type.includes("fullscreen") ||
    type.includes("tab")
  ) {
    return "border-orange-400/20 bg-orange-500/10 text-orange-200";
  }

  return "border-cyan-400/20 bg-cyan-400/10 text-cyan-200";
}

export default function AdminEventsTable({
  initialEvents,
  initialHasMore,
  pageSize,
}: {
  initialEvents: SessionEvent[];
  initialHasMore: boolean;
  pageSize: number;
}) {
  const [events, setEvents] = useState<SessionEvent[]>(initialEvents);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [eventTypeFilter, setEventTypeFilter] = useState("all");
  const [selectedEvent, setSelectedEvent] = useState<SessionEvent | null>(null);
  const [isLoadingMore, startLoadingMore] = useTransition();
  const [isRefreshing, startRefreshing] = useTransition();
  const loaderRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearch(search.trim());
    }, 350);

    return () => window.clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    startRefreshing(async () => {
      const result = await getAdminEventsPageAction({
        page: 0,
        pageSize,
        search: debouncedSearch,
        eventType: eventTypeFilter,
      });

      setEvents(result.events);
      setHasMore(result.hasMore);
      setPage(0);
    });
  }, [debouncedSearch, eventTypeFilter, pageSize]);

  useEffect(() => {
    const node = loaderRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const firstEntry = entries[0];

        if (!firstEntry?.isIntersecting || !hasMore || isLoadingMore) return;

        startLoadingMore(async () => {
          const nextPage = page + 1;

          const result = await getAdminEventsPageAction({
            page: nextPage,
            pageSize,
            search: debouncedSearch,
            eventType: eventTypeFilter,
          });

          setEvents((current) => {
            const existingIds = new Set(current.map((event) => event.id));
            const nextEvents = result.events.filter(
              (event) => !existingIds.has(event.id),
            );

            return [...current, ...nextEvents];
          });

          setHasMore(result.hasMore);
          setPage(nextPage);
        });
      },
      { rootMargin: "300px" },
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [
    hasMore,
    isLoadingMore,
    page,
    pageSize,
    debouncedSearch,
    eventTypeFilter,
  ]);

  const eventTypes = useMemo(
    () => Array.from(new Set(events.map((event) => event.type).filter(Boolean))),
    [events],
  );

  return (
    <>
      <div className="grid gap-3 border-b border-white/10 px-5 py-4 lg:grid-cols-[1fr_180px]">
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />

          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search event, session, or description..."
            className="h-11 pl-11"
          />
        </div>

        <select
          value={eventTypeFilter}
          onChange={(event) => setEventTypeFilter(event.target.value)}
          className="h-11 rounded-xl border border-white/10 bg-black/20 px-4 pr-10 text-sm text-white outline-none"
        >
          <option value="all">All events</option>
          {eventTypes.map((eventType) => (
            <option key={eventType} value={eventType ?? ""}>
              {formatEventType(eventType)}
            </option>
          ))}
        </select>
      </div>

      {isRefreshing && (
        <div className="flex items-center gap-2 border-b border-white/10 px-5 py-3 text-sm text-slate-400">
          <Loader2 className="h-4 w-4 animate-spin" />
          Refreshing activity logs...
        </div>
      )}

      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[1180px] table-auto text-left text-sm">
          <thead className="border-b border-white/10 text-slate-400">
            <tr>
              <th className="w-[250px] px-5 py-3 font-medium">Event</th>
              <th className="w-[230px] px-5 py-3 font-medium">Student</th>
              <th className="w-[250px] px-5 py-3 font-medium">Quiz</th>
              <th className="w-[320px] px-5 py-3 font-medium">Description</th>
              <th className="w-[170px] px-5 py-3 font-medium">Time</th>
              <th className="w-[210px] px-5 py-3 font-medium">Actions</th>
            </tr>
          </thead>

          <tbody>
            {events.map((event) => {
              const Icon = getEventIcon(event.type);

              return (
                <tr key={event.id} className="border-b border-white/5">
                  <td className="px-5 py-4">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10 text-cyan-200">
                        <Icon className="h-5 w-5" />
                      </div>

                      <div className="min-w-0">
                        <span
                          className={`inline-flex max-w-[160px] rounded-full border px-3 py-1 text-xs font-medium ${getEventClass(
                            event.type,
                          )}`}
                        >
                          <span className="truncate">
                            {formatEventType(event.type)}
                          </span>
                        </span>

                        <p
                          title={event.session_id || "—"}
                          className="mt-1 truncate text-xs text-slate-500"
                        >
                          Session: {truncateMiddle(event.session_id)}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-5 py-4">
                    <p
                      title={event.student_name || "Unknown student"}
                      className="max-w-[180px] truncate font-medium text-white"
                    >
                      {event.student_name || "Unknown student"}
                    </p>

                    <p
                      title={event.student_id || "—"}
                      className="mt-1 truncate text-xs text-slate-500"
                    >
                      ID: {truncateMiddle(event.student_id)}
                    </p>
                  </td>

                  <td className="px-5 py-4">
                    <p
                      title={event.quiz_title || "Unknown quiz"}
                      className="max-w-[190px] truncate font-medium text-white"
                    >
                      {event.quiz_title || "Unknown quiz"}
                    </p>

                    <p className="mt-1 text-xs text-cyan-300">
                      Code: {event.quiz_code || "—"}
                    </p>
                  </td>

                  <td className="px-5 py-4 text-slate-300">
                    <p
                      title={event.description || "—"}
                      className="max-w-[290px] truncate"
                    >
                      {event.description || "—"}
                    </p>

                    {event.duration_seconds !== null && (
                      <p className="mt-1 text-xs text-slate-500">
                        Duration: {event.duration_seconds}s
                      </p>
                    )}
                  </td>

                  <td className="px-5 py-4 text-slate-400">
                    <span className="block max-w-[150px] truncate">
                      {formatDateTime(event.timestamp)}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedEvent(event)}
                        className="h-10 w-[95px]"
                      >
                        <Eye className="h-4 w-4" />
                        View
                      </Button>

                      <DeleteEventButton eventId={event.id} />
                    </div>
                  </td>
                </tr>
              );
            })}

            {!events.length && !isRefreshing && (
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

      <div className="divide-y divide-white/10 md:hidden">
        {events.map((event) => {
          const Icon = getEventIcon(event.type);

          return (
            <div key={event.id} className="space-y-4 px-5 py-5">
              <div className="flex min-w-0 items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10 text-cyan-200">
                  <Icon className="h-5 w-5" />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-white">
                    {formatEventType(event.type)}
                  </p>

                  <p className="mt-1 truncate text-xs text-slate-500">
                    {event.description || "No description"}
                  </p>

                  <div className="mt-2 flex flex-wrap gap-2">
                    <span
                      className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${getEventClass(
                        event.type,
                      )}`}
                    >
                      {formatEventType(event.type)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid gap-3 rounded-2xl border border-white/10 bg-white/[0.02] p-4 text-sm">
                <div className="flex justify-between gap-3">
                  <span className="text-slate-500">Student</span>
                  <span className="max-w-[190px] truncate text-right text-slate-300">
                    {event.student_name || "Unknown student"}
                  </span>
                </div>

                <div className="flex justify-between gap-3">
                  <span className="text-slate-500">Quiz</span>
                  <span className="max-w-[190px] truncate text-right text-slate-300">
                    {event.quiz_title || "Unknown quiz"}
                  </span>
                </div>

                <div className="flex justify-between gap-3">
                  <span className="text-slate-500">Time</span>
                  <span className="text-right text-slate-300">
                    {formatDateTime(event.timestamp)}
                  </span>
                </div>
              </div>

              <div className="grid gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setSelectedEvent(event)}
                  className="h-11 w-full"
                >
                  <Eye className="h-4 w-4" />
                  View Details
                </Button>

                <DeleteEventButton eventId={event.id} />
              </div>
            </div>
          );
        })}

        {!events.length && !isRefreshing && (
          <div className="px-5 py-10 text-center text-slate-400">
            No activity logs found.
          </div>
        )}
      </div>

      <div ref={loaderRef} className="px-5 py-5 text-center text-sm text-slate-400">
        {isLoadingMore ? (
          <span className="inline-flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading more activity logs...
          </span>
        ) : hasMore ? (
          "Scroll to load more activity logs"
        ) : events.length > 0 ? (
          "No more activity logs to load."
        ) : null}
      </div>

      <Dialog
        open={selectedEvent !== null}
        onOpenChange={() => setSelectedEvent(null)}
      >
        <DialogContent className="max-h-[85vh] w-[calc(100vw-2rem)] max-w-3xl overflow-y-auto border-cyan-400/20 bg-slate-950 p-5 sm:p-6">
          {selectedEvent && (
            <>
              <DialogHeader>
                <DialogTitle className="break-words text-2xl">
                  {formatEventType(selectedEvent.type)}
                </DialogTitle>

                <DialogDescription>
                  Review the full audit record for this activity log.
                </DialogDescription>
              </DialogHeader>

              <div className="mt-5 grid gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm md:grid-cols-2">
                <div>
                  <p className="text-slate-500">Event Type</p>
                  <span
                    className={`mt-1 inline-flex rounded-full border px-3 py-1 text-xs font-medium ${getEventClass(
                      selectedEvent.type,
                    )}`}
                  >
                    {formatEventType(selectedEvent.type)}
                  </span>
                </div>

                <div>
                  <p className="text-slate-500">Timestamp</p>
                  <p className="mt-1 text-white">
                    {formatDateTime(selectedEvent.timestamp)}
                  </p>
                </div>

                <div>
                  <p className="text-slate-500">Student</p>
                  <p className="mt-1 text-white">
                    {selectedEvent.student_name || "Unknown student"}
                  </p>
                </div>

                <div>
                  <p className="text-slate-500">Student ID</p>
                  <p className="mt-1 break-words text-white">
                    {selectedEvent.student_id || "—"}
                  </p>
                </div>

                <div>
                  <p className="text-slate-500">Quiz</p>
                  <p className="mt-1 font-semibold text-white">
                    {selectedEvent.quiz_title || "Unknown quiz"}
                  </p>
                  <p className="mt-1 text-xs text-cyan-300">
                    Code: {selectedEvent.quiz_code || "—"}
                  </p>
                </div>

                <div>
                  <p className="text-slate-500">Session Status</p>
                  <p className="mt-1 text-white">
                    {formatStatus(selectedEvent.session_status)}
                  </p>
                </div>

                <div>
                  <p className="text-slate-500">Score</p>
                  <p className="mt-1 text-white">
                    {selectedEvent.session_score ?? "—"}
                  </p>
                </div>

                {selectedEvent.duration_seconds !== null && (
                  <div>
                    <p className="text-slate-500">Duration</p>
                    <p className="mt-1 text-white">
                      {selectedEvent.duration_seconds}s
                    </p>
                  </div>
                )}

                <div className="md:col-span-2">
                  <p className="text-slate-500">Description</p>
                  <p className="mt-1 break-words text-white">
                    {selectedEvent.description || "—"}
                  </p>
                </div>

                <div className="md:col-span-2">
                  <p className="text-slate-500">Session ID</p>
                  <p className="mt-1 break-words text-white">
                    {selectedEvent.session_id || "—"}
                  </p>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}