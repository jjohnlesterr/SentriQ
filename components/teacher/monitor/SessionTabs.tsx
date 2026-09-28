"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  CheckCheck,
  Loader2,
  RotateCcw,
  Search,
  SquareCheckBig,
  Trash2,
  X,
} from "lucide-react";

import ConfirmDialog from "@/components/shared/ConfirmDialog";
import EmptyState from "@/components/shared/EmptyState";
import SessionCard from "@/components/teacher/monitor/SessionCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { useInfiniteScroll } from "@/hooks/shared/useInfiniteScroll";
import { useSearchableList } from "@/hooks/shared/useSearchableList";
import { deleteTeacherSessions } from "@/lib/actions/session.actions";

import type { Quiz, QuizSession } from "@/lib/shared/types";

type Props = {
  quiz: Quiz | null;
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
const LOAD_STEP = 5;

function SessionList({
  quiz,
  items,
  emptyTitle,
  onViewSession,
  onApproveSession,
  onRejectSession,
  formatTime,
}: {
  quiz: Quiz | null;
  items: QuizSession[];
  emptyTitle: string;
  onViewSession: (id: string) => void;
  onApproveSession: (id: string) => void;
  onRejectSession: (id: string) => void;
  formatTime: (value: Date | string | undefined) => string;
}) {
  const router = useRouter();

  const [selectMode, setSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, startDeleteTransition] = useTransition();

  const { search, setSearch, filteredItems } = useSearchableList({
    items,
    searchBy: (session) =>
      `${session.studentName} ${session.status} ${session.approvalStatus} ${session.reportVisibility}`,
  });

  const { visibleItems, hasMoreItems, loaderRef } = useInfiniteScroll(
    filteredItems,
    VISIBLE_LIMIT,
    LOAD_STEP,
  );

  const pendingOnly = items.filter(
    (session) => session.approvalStatus === "pending",
  );

  const hasPendingItems = pendingOnly.length > 0;

  const selectedCount = selectedIds.length;

  const filteredIds = useMemo(
    () => filteredItems.map((session) => session.id),
    [filteredItems],
  );

  const allFilteredSelected =
    filteredIds.length > 0 &&
    filteredIds.every((sessionId) => selectedIds.includes(sessionId));

  function handleApproveAll() {
    pendingOnly.forEach((session) => {
      onApproveSession(session.id);
    });
  }

  function toggleSelectMode() {
    setSelectMode((current) => {
      const next = !current;

      if (!next) {
        setSelectedIds([]);
      }

      return next;
    });
  }

  function toggleSelected(sessionId: string) {
    setSelectedIds((current) =>
      current.includes(sessionId)
        ? current.filter((id) => id !== sessionId)
        : [...current, sessionId],
    );
  }

  function selectAllFiltered() {
    setSelectedIds(filteredIds);
  }

  function clearSelection() {
    setSelectedIds([]);
  }

  function handleDeleteSelected() {
    if (selectedIds.length === 0) return;

    startDeleteTransition(async () => {
      await deleteTeacherSessions(selectedIds);

      setDeleteDialogOpen(false);
      setSelectedIds([]);
      setSelectMode(false);

      router.refresh();
    });
  }

  return (
    <>
      <div className="space-y-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />

            <Input
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setSelectedIds([]);
              }}
              placeholder="Search students"
              aria-label="Search students"
              maxLength={100}
              className="h-10 pl-10"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {hasPendingItems && !selectMode && (
              <Button
                type="button"
                variant="success"
                onClick={handleApproveAll}
              >
                <CheckCheck className="h-4 w-4" />
                Approve all ({pendingOnly.length})
              </Button>
            )}

            {filteredItems.length > 0 && (
              <Button
                type="button"
                variant={selectMode ? "secondary" : "ghost"}
                onClick={toggleSelectMode}
              >
                {selectMode ? (
                  <>
                    <X className="h-4 w-4" />
                    Cancel
                  </>
                ) : (
                  <>
                    <SquareCheckBig className="h-4 w-4" />
                    Select
                  </>
                )}
              </Button>
            )}

            {selectMode && filteredItems.length > 0 && (
              <Button
                type="button"
                variant="ghost"
                onClick={allFilteredSelected ? clearSelection : selectAllFiltered}
              >
                {allFilteredSelected ? "Clear all" : "Select all"}
              </Button>
            )}
          </div>
        </div>

        {items.length === 0 ? (
          <EmptyState title={emptyTitle} />
        ) : filteredItems.length === 0 ? (
          <EmptyState title="No students match your search." />
        ) : (
          <>
            <div className="space-y-2.5">
              {visibleItems.map((session) => (
                <SessionCard
                  key={session.id}
                  quiz={quiz}
                  session={session}
                  onView={onViewSession}
                  onApprove={onApproveSession}
                  onReject={onRejectSession}
                  formatTime={formatTime}
                  selectMode={selectMode}
                  selected={selectedIds.includes(session.id)}
                  onToggleSelected={toggleSelected}
                />
              ))}
            </div>

            {hasMoreItems && (
              <div
                ref={loaderRef}
                className="flex items-center justify-center py-5 text-sm text-slate-400"
              >
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading more sessions...
              </div>
            )}
          </>
        )}
      </div>

      {selectMode && selectedCount > 0 && (
        <div className="fixed bottom-5 left-1/2 z-50 w-[calc(100vw-2rem)] max-w-3xl -translate-x-1/2 rounded-xl border border-line-strong bg-surface-raised p-3 shadow-[0_16px_48px_-12px_rgba(0,0,0,0.8)] lg:left-[calc(50%+8rem)]">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3 px-1">
              <div>
                <p className="text-sm font-semibold text-white">
                  {selectedCount} selected
                </p>
                <p className="text-xs text-slate-400">
                  Selected sessions will be permanently deleted.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:flex">
              <Button
                type="button"
                variant="ghost"
                onClick={clearSelection}
                disabled={isDeleting}
              >
                <RotateCcw className="h-4 w-4" />
                Clear
              </Button>

              <Button
                type="button"
                variant="destructive"
                onClick={() => setDeleteDialogOpen(true)}
                disabled={isDeleting}
              >
                <Trash2 className="h-4 w-4" />
                Delete selected
              </Button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={deleteDialogOpen}
        title="Delete selected sessions?"
        description={`This will permanently delete ${selectedCount} selected session${
          selectedCount === 1 ? "" : "s"
        }, including answers, scores, and monitoring activity logs. This action cannot be undone.`}
        confirmText="Delete sessions"
        loadingText="Deleting..."
        confirmVariant="destructive"
        isLoading={isDeleting}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeleteSelected}
      />
    </>
  );
}

export default function SessionTabs({
  quiz,
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
      <TabsList className="mb-5 h-auto w-full flex-wrap md:w-auto">
        <TabsTrigger
          value="pending"
          className="flex-1 gap-1.5 text-xs sm:text-sm md:flex-none"
        >
          Pending <span className="tabular-nums text-slate-500">{pendingRequests.length}</span>
        </TabsTrigger>

        <TabsTrigger
          value="all"
          className="flex-1 gap-1.5 text-xs sm:text-sm md:flex-none"
        >
          All <span className="tabular-nums text-slate-500">{sessions.length}</span>
        </TabsTrigger>

        <TabsTrigger
          value="progress"
          className="flex-1 gap-1.5 text-xs sm:text-sm md:flex-none"
        >
          In progress <span className="tabular-nums text-slate-500">{inProgress.length}</span>
        </TabsTrigger>

        <TabsTrigger
          value="suspicious"
          className="flex-1 gap-1.5 text-xs sm:text-sm md:flex-none"
        >
          Flagged <span className="tabular-nums text-slate-500">{suspicious.length}</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="pending">
        <SessionList
          quiz={quiz}
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
          quiz={quiz}
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
          quiz={quiz}
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
          quiz={quiz}
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