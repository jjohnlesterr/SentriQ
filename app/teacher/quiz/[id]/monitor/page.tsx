"use client";

import { Loader2 } from "lucide-react";

import PageShell from "@/components/layout/PageShell";
import MonitorHeader from "@/components/teacher/monitor/MonitorHeader";
import MonitorStats from "@/components/teacher/monitor/MonitorStats";
import SessionTabs from "@/components/teacher/monitor/SessionTabs";
import SessionDetailsDialog from "@/components/teacher/monitor/SessionDetailsDialog";
import { useTeacherMonitor } from "@/hooks/useTeacherMonitor";

export default function TeacherMonitorPage() {
  const monitor = useTeacherMonitor();

  if (monitor.isLoading) {
    return (
      <PageShell>
        <div className="flex min-h-screen items-center justify-center px-4">
          <div className="inline-flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-slate-200 backdrop-blur-md">
            <Loader2 className="h-5 w-5 animate-spin text-blue-300" />
            Loading monitor...
          </div>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <section className="mx-auto max-w-7xl px-4 py-5 sm:px-6 md:px-10 md:py-8 lg:px-16">
        <MonitorHeader
          quiz={monitor.quiz}
          autoRefresh={monitor.autoRefresh}
          lastUpdated={monitor.lastUpdated}
          onBack={monitor.goBack}
          onRefresh={monitor.loadData}
          onToggleAutoRefresh={monitor.toggleAutoRefresh}
        />

        <MonitorStats
          total={monitor.approvedSessions.length}
          inProgress={monitor.inProgress.length}
          completed={monitor.completed.length}
          suspicious={monitor.suspicious.length}
        />

        <SessionTabs
          sessions={monitor.approvedSessions}
          pendingRequests={monitor.pendingRequests}
          inProgress={monitor.inProgress}
          suspicious={monitor.suspicious}
          onViewSession={monitor.setOpenSessionId}
          onApproveSession={monitor.handleApproveSession}
          onRejectSession={monitor.handleRejectSession}
          formatTime={monitor.formatTime}
        />

        <SessionDetailsDialog
          open={!!monitor.openSessionId}
          session={monitor.selectedSession}
          quiz={monitor.quiz}
          onOpenChange={(open) => {
            if (!open) monitor.setOpenSessionId(null);
          }}
          formatTime={monitor.formatTime}
        />
      </section>
    </PageShell>
  );
}