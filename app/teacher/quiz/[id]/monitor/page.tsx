"use client";

import { Loader2, Menu } from "lucide-react";

import PageShell from "@/components/layout/PageShell";
import TeacherAppSidebar from "@/components/layout/sidebar/TeacherAppSidebar";
import MonitorHeader from "@/components/teacher/monitor/MonitorHeader";
import MonitorStats from "@/components/teacher/monitor/MonitorStats";
import SessionTabs from "@/components/teacher/monitor/SessionTabs";
import SessionDetailsDialog from "@/components/teacher/monitor/SessionDetailsDialog";
import { Button } from "@/components/ui/button";
import { useTeacherMonitor } from "@/hooks/useTeacherMonitor";

export default function TeacherMonitorPage() {
  const monitor = useTeacherMonitor();

  return (
    <PageShell>
      <TeacherAppSidebar
        teacherName={monitor.teacherName}
        quizzes={monitor.quizzes}
        activePage="monitor"
        activeQuizId={monitor.quiz?.id}
        open={monitor.sidebarOpen}
        onClose={() => monitor.setSidebarOpen(false)}
        onLogout={monitor.logout}
        onNewQuiz={monitor.goNewQuiz}
      />

      <main className="lg:pl-64">
        {monitor.isLoading ? (
          <div className="flex min-h-screen items-center justify-center px-4">
            <div className="inline-flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-slate-200 backdrop-blur-md">
              <Loader2 className="h-5 w-5 animate-spin text-blue-300" />
              Loading monitor...
            </div>
          </div>
        ) : (
          <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 md:px-10 md:py-8 lg:px-16">
            <div className="mb-4 lg:hidden">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => monitor.setSidebarOpen(true)}
                className="h-11 w-11 rounded-2xl p-0"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </div>

            <MonitorHeader
              quiz={monitor.quiz}
              autoRefresh={monitor.autoRefresh}
              lastUpdated={monitor.lastUpdated}
              reportVisibilityState={monitor.reportVisibilityState}
              onBack={monitor.goBack}
              onRefresh={monitor.loadData}
              onToggleAutoRefresh={monitor.toggleAutoRefresh}
              onBulkUpdateReportVisibility={
                monitor.handleBulkUpdateReportVisibility
              }
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
          </div>
        )}
      </main>
    </PageShell>
  );
}