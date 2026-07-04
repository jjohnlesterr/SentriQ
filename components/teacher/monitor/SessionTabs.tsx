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
          <div className="relative flex-1 rounded-2xl border border-cyan-400/10 bg-[#081121] shadow-[0_0_0_1px_rgba(34,211,238,0.03)] transition focus-within:border-cyan-400/30 focus-within:ring-2 focus-within:ring-cyan-400/10">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-cyan-300/70" />

            <Input
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setSelectedIds([]);
              }}
              placeholder="Search sessions..."
              maxLength={100}
              className="h-12 rounded-2xl border-0 bg-transparent pl-11 text-white placeholder:text-slate-500 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {hasPendingItems && !selectMode && (
              <Button
                type="button"
                variant="success"
                onClick={handleApproveAll}
                className="h-12 rounded-2xl px-5 font-semibold"
              >
                <CheckCheck className="h-4 w-4" />
                Approve All ({pendingOnly.length})
              </Button>
            )}

            {filteredItems.length > 0 && (
              <Button
                type="button"
                variant={selectMode ? "secondary" : "ghost"}
                onClick={toggleSelectMode}
                className="h-12 rounded-2xl border border-white/10 bg-white/5 px-5 font-semibold text-white hover:bg-white/10"
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
                className="h-12 rounded-2xl border border-white/10 bg-white/5 px-5 font-semibold text-white hover:bg-white/10"
              >
                {allFilteredSelected ? "Clear All" : "Select All"}
              </Button>
            )}
          </div>
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
        <div className="fixed bottom-5 left-1/2 z-50 w-[calc(100vw-2rem)] max-w-3xl -translate-x-1/2 rounded-3xl border border-violet-400/20 bg-slate-950/95 p-3 shadow-[0_20px_80px_rgba(0,0,0,0.65)] backdrop-blur-xl lg:left-[calc(50%+8rem)]">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-violet-500 text-sm font-black text-white">
                {selectedCount}
              </div>

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
                className="h-11 rounded-2xl border border-white/10 bg-white/5 px-5 text-white hover:bg-white/10"
              >
                <RotateCcw className="h-4 w-4" />
                Clear
              </Button>

              <Button
                type="button"
                variant="destructive"
                onClick={() => setDeleteDialogOpen(true)}
                disabled={isDeleting}
                className="h-11 rounded-2xl px-5 font-semibold"
              >
                <Trash2 className="h-4 w-4" />
                Delete Selected
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
        confirmText="Delete Sessions"
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