"use client";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

import EmptySessionState from "@/components/teacher/monitor/EmptySessionState";
import SessionCard from "@/components/teacher/monitor/SessionCard";

import type { QuizSession } from "@/lib/types";

type Props = {
  sessions: QuizSession[];
  inProgress: QuizSession[];
  suspicious: QuizSession[];
  onViewSession: (id: string) => void;
  formatTime: (value: Date | string | undefined) => string;
};

export default function SessionTabs({
  sessions,
  inProgress,
  suspicious,
  onViewSession,
  formatTime,
}: Props) {
  return (
    <Tabs defaultValue="all" className="w-full">
      <TabsList className="mb-6 h-auto rounded-2xl border border-white/10 bg-white/5 p-1 backdrop-blur-xl">
        <TabsTrigger value="all" className="rounded-xl px-4 py-2">
          All Sessions ({sessions.length})
        </TabsTrigger>

        <TabsTrigger value="progress" className="rounded-xl px-4 py-2">
          In Progress ({inProgress.length})
        </TabsTrigger>

        <TabsTrigger value="suspicious" className="rounded-xl px-4 py-2">
          Suspicious ({suspicious.length})
        </TabsTrigger>
      </TabsList>

      <TabsContent value="all" className="space-y-4">
        {sessions.length === 0 ? (
          <EmptySessionState message="No students have joined this quiz yet." />
        ) : (
          sessions.map((session) => (
            <SessionCard
              key={session.id}
              session={session}
              onView={onViewSession}
              formatTime={formatTime}
            />
          ))
        )}
      </TabsContent>

      <TabsContent value="progress" className="space-y-4">
        {inProgress.length === 0 ? (
          <EmptySessionState message="No active sessions." />
        ) : (
          inProgress.map((session) => (
            <SessionCard
              key={session.id}
              session={session}
              onView={onViewSession}
              formatTime={formatTime}
            />
          ))
        )}
      </TabsContent>

      <TabsContent value="suspicious" className="space-y-4">
        {suspicious.length === 0 ? (
          <EmptySessionState message="No suspicious activity detected." />
        ) : (
          suspicious.map((session) => (
            <SessionCard
              key={session.id}
              session={session}
              onView={onViewSession}
              formatTime={formatTime}
            />
          ))
        )}
      </TabsContent>
    </Tabs>
  );
}