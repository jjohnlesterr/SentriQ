"use client";

import { Search } from "lucide-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import EmptyState from "@/components/shared/EmptyState";
import SessionCard from "@/components/teacher/monitor/SessionCard";

import { useExpandableList } from "@/hooks/shared/useExpandableList";
import { useSearchableList } from "@/hooks/shared/useSearchableList";

import type { QuizSession } from "@/lib/shared/types";

type Props = {
  sessions: QuizSession[];
  pendingRequests: QuizSession[];
  inProgress: QuizSession[];
  suspicious: QuizSession[];
  onViewSession: (id: string) => void;
  onApproveSession: (id: string) => void;
  onRejectSession: (id: string) => void;
  formatTime: (value: Date | string | undefined) => string;
};

const VISIBLE_LIMIT = 5;

function SessionList({
  items,
  emptyTitle,
  onViewSession,
  onApproveSession,
  onRejectSession,
  formatTime,
}: {
  items: QuizSession[];
  emptyTitle: string;
  onViewSession: (id: string) => void;
  onApproveSession: (id: string) => void;
  onRejectSession: (id: string) => void;
  formatTime: (value: Date | string | undefined) => string;
}) {
  const { search, setSearch, filteredItems } = useSearchableList({
    items,
    searchBy: (session) =>
      `${session.studentName} ${session.status} ${session.approvalStatus} ${session.reportVisibility}`,
  });

  const {
    expanded,
    visibleItems,
    hasHiddenItems,
    hiddenCount,
    showMore,
    showLess,
  } = useExpandableList(filteredItems, VISIBLE_LIMIT);

  return (
    <div className="space-y-4">
      <div className="relative rounded-2xl border border-cyan-400/10 bg-[#081121] shadow-[0_0_0_1px_rgba(34,211,238,0.03)] transition focus-within:border-cyan-400/30 focus-within:ring-2 focus-within:ring-cyan-400/10">
        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-cyan-300/70" />

        <Input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search sessions..."
          maxLength={100}
          className="h-12 rounded-2xl border-0 bg-transparent pl-11 text-white placeholder:text-slate-500 focus-visible:ring-0 focus-visible:ring-offset-0"
        />
      </div>

      {items.length === 0 ? (
        <EmptyState title={emptyTitle} />
      ) : filteredItems.length === 0 ? (
        <EmptyState title="No matching sessions found." />
      ) : (
        <>
          <div className="space-y-4">
            {visibleItems.map((session) => (
              <SessionCard
                key={session.id}
                session={session}
                onView={onViewSession}
                onApprove={onApproveSession}
                onReject={onRejectSession}
                formatTime={formatTime}
              />
            ))}
          </div>

          {hasHiddenItems && (
            <Button
              type="button"
              variant="ghost"
              onClick={expanded ? showLess : showMore}
              className="h-11 w-full rounded-2xl border border-white/10 bg-white/5 text-sm text-white hover:bg-white/10"
            >
              {expanded ? "See Less" : `See More (${hiddenCount})`}
            </Button>
          )}
        </>
      )}
    </div>
  );
}

export default function SessionTabs({
  sessions,
  pendingRequests,
  inProgress,
  suspicious,
  onViewSession,
  onApproveSession,
  onRejectSession,
  formatTime,
}: Props) {
  return (
    <Tabs defaultValue="pending" className="w-full">
      <TabsList className="mb-5 h-auto w-full flex-wrap rounded-2xl border border-white/10 bg-white/5 p-1 backdrop-blur-xl md:mb-6 md:w-auto">
        <TabsTrigger value="pending" className="flex-1 rounded-xl px-3 py-2 text-[11px] sm:text-sm md:flex-none md:px-4">
          Pending ({pendingRequests.length})
        </TabsTrigger>

        <TabsTrigger value="all" className="flex-1 rounded-xl px-3 py-2 text-[11px] sm:text-sm md:flex-none md:px-4">
          All Sessions ({sessions.length})
        </TabsTrigger>

        <TabsTrigger value="progress" className="flex-1 rounded-xl px-3 py-2 text-[11px] sm:text-sm md:flex-none md:px-4">
          In Progress ({inProgress.length})
        </TabsTrigger>

        <TabsTrigger value="suspicious" className="flex-1 rounded-xl px-3 py-2 text-[11px] sm:text-sm md:flex-none md:px-4">
          Suspicious ({suspicious.length})
        </TabsTrigger>
      </TabsList>

      <TabsContent value="pending">
        <SessionList
          items={pendingRequests}
          emptyTitle="No pending join requests."
          onViewSession={onViewSession}
          onApproveSession={onApproveSession}
          onRejectSession={onRejectSession}
          formatTime={formatTime}
        />
      </TabsContent>

      <TabsContent value="all">
        <SessionList
          items={sessions}
          emptyTitle="No students have joined this quiz yet."
          onViewSession={onViewSession}
          onApproveSession={onApproveSession}
          onRejectSession={onRejectSession}
          formatTime={formatTime}
        />
      </TabsContent>

      <TabsContent value="progress">
        <SessionList
          items={inProgress}
          emptyTitle="No active sessions."
          onViewSession={onViewSession}
          onApproveSession={onApproveSession}
          onRejectSession={onRejectSession}
          formatTime={formatTime}
        />
      </TabsContent>

      <TabsContent value="suspicious">
        <SessionList
          items={suspicious}
          emptyTitle="No suspicious activity detected."
          onViewSession={onViewSession}
          onApproveSession={onApproveSession}
          onRejectSession={onRejectSession}
          formatTime={formatTime}
        />
      </TabsContent>
    </Tabs>
  );
}