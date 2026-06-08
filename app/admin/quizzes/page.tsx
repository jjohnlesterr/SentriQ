import {
  BookOpen,
  CheckCircle2,
  FileQuestion,
  ShieldCheck,
  Users,
} from "lucide-react";

import AdminQuizzesTable from "@/components/admin/AdminQuizzesTable";
import AdminShell from "@/components/admin/AdminShell";
import { GlassCard } from "@/components/shared/GlassCard";
import {
  getAdminQuizzesPageAction,
  getQuizStatsAction,
} from "@/lib/actions/admin.actions";

const PAGE_SIZE = 50;

function StatCard({
  title,
  value,
  icon: Icon,
}: {
  title: string;
  value: number;
  icon: typeof BookOpen;
}) {
  return (
    <GlassCard className="h-[104px] w-[168px] shrink-0 p-4 md:h-[120px] md:w-auto md:p-5">
      <div className="flex items-center gap-3">
        <Icon className="h-6 w-6 text-cyan-300" />
        <h2 className="text-4xl font-bold leading-none text-cyan-300">
          {value}
        </h2>
      </div>

      <p className="mt-7 text-sm text-slate-400 md:mt-8">{title}</p>
    </GlassCard>
  );
}

export default async function AdminQuizzesPage() {
  const [stats, firstPage] = await Promise.all([
    getQuizStatsAction(),
    getAdminQuizzesPageAction({
      page: 0,
      pageSize: PAGE_SIZE,
      search: "",
      status: "all",
    }),
  ]);

  return (
    <AdminShell>
      <div className="mx-auto max-w-7xl space-y-6">
        <div>
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-200">
            <ShieldCheck className="h-4 w-4" />
            Admin Control Panel
          </div>

          <h1 className="text-3xl font-bold md:text-4xl">Quizzes</h1>

          <p className="mt-2 text-sm text-slate-400">
            Search, review, and manage quizzes created in the system.
          </p>
        </div>

        <div className="-mx-4 overflow-x-auto px-4 pb-2 [scrollbar-width:none] sm:-mx-6 sm:px-6 md:mx-0 md:overflow-visible md:px-0 md:pb-0">
          <div className="flex w-max gap-3 pr-4 md:grid md:w-full md:grid-cols-4 md:gap-4 md:pr-0">
            <StatCard
              title="Total Quizzes"
              value={stats.totalQuizzes}
              icon={BookOpen}
            />
            <StatCard
              title="Published"
              value={stats.publishedCount}
              icon={CheckCircle2}
            />
            <StatCard
              title="Drafts"
              value={stats.draftCount}
              icon={FileQuestion}
            />
            <StatCard
              title="Questions"
              value={stats.totalQuestions}
              icon={Users}
            />
          </div>
        </div>

        <GlassCard className="overflow-hidden p-0">
          <div className="border-b border-white/10 px-5 py-5">
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-cyan-300" />
              <h2 className="text-lg font-semibold">Quiz Records</h2>
            </div>

            <p className="mt-1 text-sm text-slate-400">
              Review quiz details, question count, creator, and usage.
            </p>
          </div>

          <AdminQuizzesTable
            initialQuizzes={firstPage.quizzes}
            initialHasMore={firstPage.hasMore}
            pageSize={PAGE_SIZE}
          />
        </GlassCard>
      </div>
    </AdminShell>
  );
}