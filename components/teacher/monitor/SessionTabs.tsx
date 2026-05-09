"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import EmptyState from "@/components/shared/EmptyState";
import SessionCard from "@/components/teacher/monitor/SessionCard";

import type { QuizSession } from "@/lib/types";

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
        <TabsTrigger
          value="pending"
          className="flex-1 rounded-xl px-3 py-2 text-[11px] sm:text-sm md:flex-none md:px-4"
        >
          Pending ({pendingRequests.length})
        </TabsTrigger>

        <TabsTrigger
          value="all"
          className="flex-1 rounded-xl px-3 py-2 text-[11px] sm:text-sm md:flex-none md:px-4"
        >
          All Sessions ({sessions.length})
        </TabsTrigger>

        <TabsTrigger
          value="progress"
          className="flex-1 rounded-xl px-3 py-2 text-[11px] sm:text-sm md:flex-none md:px-4"
        >
          In Progress ({inProgress.length})
        </TabsTrigger>

        <TabsTrigger
          value="suspicious"
          className="flex-1 rounded-xl px-3 py-2 text-[11px] sm:text-sm md:flex-none md:px-4"
        >
          Suspicious ({suspicious.length})
        </TabsTrigger>
      </TabsList>

      <TabsContent value="pending" className="space-y-4">
        {pendingRequests.length === 0 ? (
          <EmptyState title="No pending join requests." />
        ) : (
          pendingRequests.map((session) => (
            <SessionCard
              key={session.id}
              session={session}
              onView={onViewSession}
              onApprove={onApproveSession}
              onReject={onRejectSession}
              formatTime={formatTime}
            />
          ))
        )}
      </TabsContent>

      <TabsContent value="all" className="space-y-4">
        {sessions.length === 0 ? (
          <EmptyState title="No students have joined this quiz yet." />
        ) : (
          sessions.map((session) => (
            <SessionCard
              key={session.id}
              session={session}
              onView={onViewSession}
              onApprove={onApproveSession}
              onReject={onRejectSession}
              formatTime={formatTime}
            />
          ))
        )}
      </TabsContent>

      <TabsContent value="progress" className="space-y-4">
        {inProgress.length === 0 ? (
          <EmptyState title="No active sessions." />
        ) : (
          inProgress.map((session) => (
            <SessionCard
              key={session.id}
              session={session}
              onView={onViewSession}
              onApprove={onApproveSession}
              onReject={onRejectSession}
              formatTime={formatTime}
            />
          ))
        )}
      </TabsContent>

      <TabsContent value="suspicious" className="space-y-4">
        {suspicious.length === 0 ? (
          <EmptyState title="No suspicious activity detected." />
        ) : (
          suspicious.map((session) => (
            <SessionCard
              key={session.id}
              session={session}
              onView={onViewSession}
              onApprove={onApproveSession}
              onReject={onRejectSession}
              formatTime={formatTime}
            />
          ))
        )}
      </TabsContent>
    </Tabs>
  );
}