"use client";

import { Menu } from "lucide-react";

import TeacherPageLayout from "@/components/layout/TeacherPageLayout";
import PageLoader from "@/components/shared/PageLoader";

import MonitorHeader from "@/components/teacher/monitor/MonitorHeader";
import MonitorStats from "@/components/teacher/monitor/MonitorStats";
import SessionTabs from "@/components/teacher/monitor/SessionTabs";
import SessionDetailsDialog from "@/components/teacher/monitor/SessionDetailsDialog";

import { Button } from "@/components/ui/button";

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
              if (!open) {
                monitor.setOpenSessionId(null);
              }
            }}
            formatTime={monitor.formatTime}
          />
        </div>
      )}
    </TeacherPageLayout>
  );
}
