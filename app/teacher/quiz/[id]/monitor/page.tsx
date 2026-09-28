"use client";

import { Menu } from "lucide-react";

import TeacherPageLayout from "@/components/layout/TeacherPageLayout";
import AppLogo from "@/components/shared/AppLogo";
import PageLoader from "@/components/shared/PageLoader";

import MonitorHeader from "@/components/teacher/monitor/MonitorHeader";
import MonitorStats from "@/components/teacher/monitor/MonitorStats";
import SessionTabs from "@/components/teacher/monitor/SessionTabs";
import SessionDetailsDialog from "@/components/teacher/monitor/view-details/SessionDetailsDialog";

import { useTeacherMonitor } from "@/hooks/teacher/useTeacherMonitor";

export default function TeacherMonitorPage() {
  const monitor = useTeacherMonitor();

  return (
    <TeacherPageLayout
      teacherName={monitor.teacherName}
      quizzes={monitor.quizzes}
      activePage="monitor"
      activeQuizId={monitor.quiz?.id}
      sidebarOpen={monitor.sidebarOpen}
      onCloseSidebar={() => monitor.setSidebarOpen(false)}
      onLogout={monitor.logout}
      onNewQuiz={monitor.goNewQuiz}
    >
      {monitor.isLoading ? (
        <PageLoader label="Loading monitor..." />
      ) : (
        <div className="min-h-screen">
          <main className="mx-auto min-w-0 max-w-6xl px-4 py-6 sm:px-6 md:py-8 lg:px-8">
            <div className="mb-6 flex items-center justify-between lg:hidden">
              <button
                type="button"
                onClick={() => monitor.setSidebarOpen(true)}
                aria-label="Open sidebar"
                className="-ml-2 flex h-10 w-10 items-center justify-center rounded-md text-slate-300 transition-colors hover:bg-white/[0.05] hover:text-white"
              >
                <Menu className="h-5 w-5" />
              </button>

              <AppLogo className="text-lg" />

              <div className="h-10 w-10" />
            </div>

            <MonitorHeader
              quiz={monitor.quiz}
              lastUpdated={monitor.lastUpdated}
              reportVisibilityState={monitor.reportVisibilityState}
              onBack={monitor.goBack}
              onBulkUpdateReportVisibility={
                monitor.handleBulkUpdateReportVisibility
              }
              onToggleJoining={monitor.handleToggleJoining}
            />

            <MonitorStats
              total={monitor.approvedSessions.length}
              inProgress={monitor.inProgress.length}
              completed={monitor.completed.length}
              suspicious={monitor.suspicious.length}
            />

            <SessionTabs
              quiz={monitor.quiz}
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
                if (!open) {
                  monitor.setOpenSessionId(null);
                }
              }}
              formatTime={monitor.formatTime}
            />
          </main>
        </div>
      )}
    </TeacherPageLayout>
  );
}
