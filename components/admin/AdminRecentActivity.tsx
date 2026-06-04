"use client";

import Link from "next/link";
import { Activity, ArrowRight, RefreshCcw, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useExpandableList } from "@/hooks/shared/useExpandableList";

type RecentEvent = {
  id: string;
  session_id: string | null;
  type: string | null;
  timestamp: string | null;
  description: string | null;
};

type Props = {
  events: RecentEvent[];
};

function formatRelativeTime(dateValue: string | null) {
  if (!dateValue) return "Unknown time";

  const diffMs = Date.now() - new Date(dateValue).getTime();
  const minutes = Math.max(1, Math.floor(diffMs / 60000));

  if (minutes < 60) return `${minutes} min${minutes === 1 ? "" : "s"} ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;

  const days = Math.floor(hours / 24);
  return `${days} day${days === 1 ? "" : "s"} ago`;
}

function formatEventLabel(type: string | null, description: string | null) {
  if (description) return description;
  if (!type) return "Activity recorded";

  return type
    .replaceAll("-", " ")
    .replaceAll("_", " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function getEventIcon(type: string | null) {
  if (type?.includes("return")) return RefreshCcw;
  if (type?.includes("tab")) return Users;

  return Activity;
}

function getIconClass(type: string | null) {
  if (type === "abandoned") return "bg-orange-500/10 text-orange-300";
  if (type === "completed") return "bg-emerald-500/10 text-emerald-300";
  if (type === "time-expired") return "bg-yellow-500/10 text-yellow-300";
  if (type === "tab-returned") return "bg-amber-500/10 text-amber-300";
  if (type === "copy-attempt" || type === "paste-attempt") {
    return "bg-red-500/10 text-red-300";
  }

  return "bg-cyan-500/10 text-cyan-300";
}

function getBadgeClass(type: string | null) {
  if (!type) return "bg-white/10 text-slate-300";
  if (type === "abandoned") return "bg-orange-500/10 text-orange-300";
  if (type === "completed") return "bg-emerald-500/10 text-emerald-300";
  if (type === "time-expired") return "bg-yellow-500/10 text-yellow-300";
  if (type === "tab-left") return "bg-sky-500/10 text-sky-300";
  if (type === "tab-returned") return "bg-amber-500/10 text-amber-300";
  if (type === "copy-attempt" || type === "paste-attempt") {
    return "bg-red-500/10 text-red-300";
  }

  return "bg-cyan-500/10 text-cyan-300";
}

export default function AdminRecentActivity({ events }: Props) {
  const {
    visibleItems,
    visibleCount,
    totalCount,
    hasMoreItems,
    canShowLess,
    showMore,
    showLess,
  } = useExpandableList(events, 5, 5);

  const nextVisibleCount = Math.min(visibleCount + 5, totalCount);
  const nextShowCount = nextVisibleCount - visibleCount;

  return (
    <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03]">
      <div className="flex flex-col gap-3 border-b border-white/10 px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white">Recent Activity</h2>
          <p className="mt-1 text-sm text-slate-400">
            Latest events recorded by the system.
          </p>
        </div>

        <Link href="/admin/events">
          <Button variant="secondary" size="sm">
            View All Logs
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>

      <div className="hidden grid-cols-[1fr_180px_130px] border-b border-white/10 px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-400 md:grid">
        <p>Event</p>
        <p>Type</p>
        <p className="text-right">Time</p>
      </div>

      <div className="divide-y divide-white/10">
        {visibleItems.map((event) => {
          const Icon = getEventIcon(event.type);

          return (
            <div
              key={event.id}
              className="grid gap-3 px-5 py-4 md:grid-cols-[1fr_180px_130px] md:items-center"
            >
              <div className="flex min-w-0 items-center gap-3">
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${getIconClass(
                    event.type,
                  )}`}
                >
                  <Icon className="h-5 w-5" />
                </div>

                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-white">
                    {formatEventLabel(event.type, event.description)}
                  </p>

                  <p className="mt-1 truncate text-xs text-slate-500">
                    {event.session_id
                      ? `Session ID: ${event.session_id}`
                      : "System event"}
                  </p>
                </div>
              </div>

              <div>
                <span
                  className={`inline-flex rounded-lg px-3 py-1 text-xs font-semibold ${getBadgeClass(
                    event.type,
                  )}`}
                >
                  {event.type || "activity"}
                </span>
              </div>

              <p className="text-sm text-slate-500 md:text-right">
                {formatRelativeTime(event.timestamp)}
              </p>
            </div>
          );
        })}

        {!events.length && (
          <div className="px-5 py-10 text-center text-slate-400">
            No activity logs yet.
          </div>
        )}
      </div>

      {(hasMoreItems || canShowLess) && (
        <div className="border-t border-white/10 px-5 py-4 text-center">
          <p className="mb-3 text-xs text-slate-400">
            Showing {visibleCount} of {totalCount} activity logs
          </p>

          <div className="mx-auto flex max-w-[540px] flex-col gap-3 sm:flex-row sm:justify-center">
            {canShowLess && (
              <Button
                type="button"
                variant="ghost"
                onClick={showLess}
                className="h-11 w-full rounded-2xl border border-white/10 bg-white/5 text-sm font-semibold text-white hover:bg-white/10 sm:max-w-[220px]"
              >
                Show Less
              </Button>
            )}

            {hasMoreItems && (
              <Button
                type="button"
                variant="ghost"
                onClick={showMore}
                className="h-11 w-full rounded-2xl border border-white/10 bg-white/5 text-sm font-semibold text-white hover:bg-white/10 sm:max-w-[220px]"
              >
                Show {nextShowCount} More
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
