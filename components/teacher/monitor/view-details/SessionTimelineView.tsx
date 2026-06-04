"use client";

import { useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Clipboard,
  ClipboardPaste,
  Clock,
  Maximize,
  RotateCcw,
  ShieldAlert,
  TimerOff,
  UserRoundCheck,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import type { QuizSession, SessionEventType } from "@/lib/shared/types";

const PREVIEW_LIMIT = 5;

function getEventLabel(type: SessionEventType) {
  const labels: Record<SessionEventType, string> = {
    "join-requested": "Join Requested",
    approved: "Approved",
    rejected: "Rejected",
    started: "Started",
    "tab-left": "Tab Switch Detected",
    "tab-returned": "Returned to Quiz",
    "fullscreen-exit": "Exited Fullscreen",
    "copy-attempt": "Copy Detected",
    "paste-attempt": "Paste Detected",
    "answered-question": "Answered Question",
    completed: "Completed",
    "time-expired": "Time Expired",
    abandoned: "Session Abandoned",
  };

  return labels[type];
}

function getEventMeta(type: SessionEventType) {
  if (type === "join-requested") {
    return {
      icon: UserRoundCheck,
      className: "border-indigo-300/20 bg-indigo-500/20 text-indigo-200",
    };
  }

  if (type === "abandoned") {
    return {
      icon: AlertTriangle,
      className: "border-orange-300/20 bg-orange-500/20 text-orange-200",
    };
  }

  if (type === "time-expired") {
    return {
      icon: TimerOff,
      className: "border-yellow-300/20 bg-yellow-500/20 text-yellow-200",
    };
  }

  if (
    type === "approved" ||
    type === "completed" ||
    type === "answered-question"
  ) {
    return {
      icon: CheckCircle2,
      className: "border-emerald-300/20 bg-emerald-500/20 text-emerald-200",
    };
  }

  if (type === "rejected" || type === "tab-left") {
    return {
      icon: type === "rejected" ? ShieldAlert : AlertTriangle,
      className: "border-red-300/20 bg-red-500/20 text-red-200",
    };
  }

  if (type === "fullscreen-exit") {
    return {
      icon: Maximize,
      className: "border-orange-300/20 bg-orange-500/20 text-orange-200",
    };
  }

  if (type === "copy-attempt") {
    return {
      icon: Clipboard,
      className: "border-amber-300/20 bg-amber-500/20 text-amber-200",
    };
  }

  if (type === "paste-attempt") {
    return {
      icon: ClipboardPaste,
      className: "border-pink-300/20 bg-pink-500/20 text-pink-200",
    };
  }

  if (type === "tab-returned") {
    return {
      icon: RotateCcw,
      className: "border-cyan-300/20 bg-cyan-500/20 text-cyan-200",
    };
  }

  return {
    icon: Clock,
    className: "border-blue-300/20 bg-blue-500/20 text-blue-200",
  };
}

export default function SessionTimelineView({
  session,
  formatTime,
  compact = false,
}: {
  session: QuizSession;
  formatTime: (value: Date | string | undefined) => string;
  compact?: boolean;
}) {
  const [visibleCount, setVisibleCount] = useState(PREVIEW_LIMIT);

  if (session.events.length === 0) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 text-sm text-slate-400">
        No events recorded.
      </div>
    );
  }

  const events = compact
    ? session.events.slice(0, visibleCount)
    : session.events;

  const hasMore = compact && visibleCount < session.events.length;
  const canShowLess = compact && visibleCount > PREVIEW_LIMIT;
  const hiddenCount = session.events.length - visibleCount;
  const nextCount = Math.min(PREVIEW_LIMIT, hiddenCount);

  return (
    <div className="relative pl-2">
      {events.map((event, index) => {
        const meta = getEventMeta(event.type);
        const Icon = meta.icon;
        const isLast = index === events.length - 1;

        return (
          <div
            key={`${event.type}-${index}`}
            className="relative flex gap-4 pb-6"
          >
            {!isLast && (
              <div className="absolute left-[19px] top-10 h-full w-px bg-white/10" />
            )}

            <div
              className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border ${meta.className}`}
            >
              <Icon className="h-4 w-4" />
            </div>

            <div className="min-w-0 pt-0.5">
              <p className="text-sm font-bold text-white">
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
        );
      })}

      {(hasMore || canShowLess) && (
        <div className="ml-12 flex flex-col gap-2">
          {hasMore && (
            <Button
              type="button"
              variant="ghost"
              onClick={() =>
                setVisibleCount((current) =>
                  Math.min(current + PREVIEW_LIMIT, session.events.length),
                )
              }
              className="h-10 w-full rounded-2xl border border-white/10 bg-white/5 text-sm text-white hover:bg-white/10"
            >
              See More ({nextCount})
            </Button>
          )}

          {canShowLess && (
            <Button
              type="button"
              variant="ghost"
              onClick={() => setVisibleCount(PREVIEW_LIMIT)}
              className="h-10 w-full rounded-2xl border border-white/10 bg-white/5 text-sm text-slate-300 hover:bg-white/10 hover:text-white"
            >
              See Less
            </Button>
          )}
        </div>
      )}

      {!hasMore && (
        <div className="ml-12 mt-4 border-t border-white/10 pt-4 text-center text-xs text-slate-500">
          End of activity
        </div>
      )}
    </div>
  );
}
