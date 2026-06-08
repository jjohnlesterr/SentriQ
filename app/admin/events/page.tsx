import {
  Activity,
  AlertTriangle,
  Clipboard,
  Maximize,
  ShieldCheck,
} from "lucide-react";

import AdminEventsTable from "@/components/admin/AdminEventsTable";
import AdminShell from "@/components/admin/AdminShell";
import { GlassCard } from "@/components/shared/GlassCard";
import {
  getAdminEventsPageAction,
  getEventStatsAction,
} from "@/lib/actions/admin.actions";

const PAGE_SIZE = 50;

function StatCard({
  title,
  value,
  icon: Icon,
}: {
  title: string;
  value: number;
  icon: typeof Activity;
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

export default async function AdminEventsPage() {
  const [stats, firstPage] = await Promise.all([
    getEventStatsAction(),
    getAdminEventsPageAction({
      page: 0,
      pageSize: PAGE_SIZE,
      search: "",
      eventType: "all",
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

          <h1 className="text-3xl font-bold md:text-4xl">Activity Logs</h1>

          <p className="mt-2 text-sm text-slate-400">
            Search and review all recorded session events and activities.
          </p>
        </div>

        <div className="-mx-4 overflow-x-auto px-4 pb-2 [scrollbar-width:none] sm:-mx-6 sm:px-6 md:mx-0 md:overflow-visible md:px-0 md:pb-0">
          <div className="flex w-max gap-3 pr-4 md:grid md:w-full md:grid-cols-4 md:gap-4 md:pr-0">
            <StatCard title="Total Logs" value={stats.totalEvents} icon={Activity} />
            <StatCard title="Risky Events" value={stats.riskyEvents} icon={AlertTriangle} />
            <StatCard title="Copy Attempts" value={stats.copyAttempts} icon={Clipboard} />
            <StatCard title="Fullscreen Exits" value={stats.fullscreenExits} icon={Maximize} />
          </div>
        </div>

        <GlassCard className="overflow-hidden p-0">
          <div className="border-b border-white/10 px-5 py-5">
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-cyan-300" />
              <h2 className="text-lg font-semibold">Activity Records</h2>
            </div>

            <p className="mt-1 text-sm text-slate-400">
              Review event type, student, quiz, session, and timestamp.
            </p>
          </div>

          <AdminEventsTable
            initialEvents={firstPage.events}
            initialHasMore={firstPage.hasMore}
            pageSize={PAGE_SIZE}
          />
        </GlassCard>
      </div>
    </AdminShell>
  );
}