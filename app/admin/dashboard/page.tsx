import {
  Activity,
  BookOpen,
  ClipboardList,
  ShieldCheck,
  Users,
} from "lucide-react";

import AdminRecentActivity from "@/components/admin/AdminRecentActivity";
import AdminShell from "@/components/admin/AdminShell";
import { GlassCard } from "@/components/shared/GlassCard";
import { createSupabaseServerClient } from "@/lib/supabase/server";

async function getTableCount(tableName: string) {
  const supabase = await createSupabaseServerClient();

  const { count, error } = await supabase
    .from(tableName)
    .select("*", { count: "exact", head: true });

  if (error) return 0;

  return count ?? 0;
}

async function getFilteredCount(
  tableName: string,
  column: string,
  value: string | boolean,
) {
  const supabase = await createSupabaseServerClient();

  const { count, error } = await supabase
    .from(tableName)
    .select("*", { count: "exact", head: true })
    .eq(column, value);

  if (error) return 0;

  return count ?? 0;
}

function StatCard({
  title,
  value,
  icon: Icon,
}: {
  title: string;
  value: number;
  icon: typeof Users;
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

function OverviewGroup({
  title,
  icon: Icon,
  iconClassName,
  items,
}: {
  title: string;
  icon: typeof Users;
  iconClassName: string;
  items: {
    label: string;
    value: number;
  }[];
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 md:p-5 xl:border-0 xl:bg-transparent xl:p-0">
      <div className="flex items-center gap-3">
        <Icon className={`h-6 w-6 ${iconClassName}`} />
        <h3 className="font-semibold text-white">{title}</h3>
      </div>

      <div className="mt-4 space-y-2">
        {items.map((item, index) => (
          <div
            key={item.label}
            className={
              index < items.length - 1
                ? "flex items-center justify-between border-b border-white/10 pb-2"
                : "flex items-center justify-between"
            }
          >
            <span className="text-slate-400">{item.label}</span>
            <span className="font-bold text-white">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default async function AdminDashboardPage() {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("email")
    .eq("id", user?.id)
    .maybeSingle();

  const [
    usersCount,
    quizzesCount,
    sessionsCount,
    activityLogsCount,
    teachersCount,
    adminsCount,
    publishedQuizzesCount,
    draftQuizzesCount,
    completedSessionsCount,
    inProgressSessionsCount,
    timedOutSessionsCount,
    abandonedSessionsCount,
  ] = await Promise.all([
    getTableCount("profiles"),
    getTableCount("quizzes"),
    getTableCount("sessions"),
    getTableCount("session_events"),
    getFilteredCount("profiles", "role", "teacher"),
    getFilteredCount("profiles", "role", "admin"),
    getFilteredCount("quizzes", "published", true),
    getFilteredCount("quizzes", "published", false),
    getFilteredCount("sessions", "status", "completed"),
    getFilteredCount("sessions", "status", "in-progress"),
    getFilteredCount("sessions", "status", "timed-out"),
    getFilteredCount("sessions", "status", "abandoned"),
  ]);

  const { data: recentEvents } = await supabase
    .from("session_events")
    .select("id, session_id, type, timestamp, description")
    .order("timestamp", { ascending: false })
    .range(0, Math.max(activityLogsCount - 1, 0));

  return (
    <AdminShell>
      <div className="mx-auto max-w-7xl space-y-6">
        <div>
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-200">
            <ShieldCheck className="h-4 w-4" />
            Admin Control Panel
          </div>

          <h1 className="text-3xl font-bold md:text-4xl">Admin Dashboard</h1>

          <p className="mt-2 text-sm text-slate-400">
            Welcome back,{" "}
            <span className="text-cyan-300">
              {profile?.email ?? user?.email ?? "Administrator"}
            </span>
          </p>
        </div>

        <div className="-mx-4 overflow-x-auto px-4 pb-2 [scrollbar-width:none] sm:-mx-6 sm:px-6 md:mx-0 md:overflow-visible md:px-0 md:pb-0">
          <div className="flex w-max gap-3 pr-4 md:grid md:w-full md:grid-cols-4 md:gap-4 md:pr-0">
            <StatCard title="Total Users" value={usersCount} icon={Users} />
            <StatCard
              title="Total Quizzes"
              value={quizzesCount}
              icon={BookOpen}
            />
            <StatCard
              title="Total Sessions"
              value={sessionsCount}
              icon={Activity}
            />
            <StatCard
              title="Total Activity Logs"
              value={activityLogsCount}
              icon={ClipboardList}
            />
          </div>
        </div>

        <GlassCard className="p-5">
          <h2 className="text-lg font-semibold">System Overview</h2>
          <p className="mt-1 text-sm text-slate-400">
            Overview of key system statistics.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3 xl:gap-6 xl:divide-x xl:divide-white/10">
            <div className="xl:pr-6">
              <OverviewGroup
                title="Users"
                icon={Users}
                iconClassName="text-cyan-300"
                items={[
                  { label: "Admins", value: adminsCount },
                  { label: "Teachers", value: teachersCount },
                ]}
              />
            </div>

            <div className="xl:px-6">
              <OverviewGroup
                title="Quizzes"
                icon={BookOpen}
                iconClassName="text-violet-300"
                items={[
                  { label: "Published", value: publishedQuizzesCount },
                  { label: "Draft", value: draftQuizzesCount },
                ]}
              />
            </div>

            <div className="md:col-span-2 xl:col-span-1 xl:pl-6">
              <OverviewGroup
                title="Sessions"
                icon={Activity}
                iconClassName="text-emerald-300"
                items={[
                  { label: "Completed", value: completedSessionsCount },
                  { label: "In Progress", value: inProgressSessionsCount },
                  { label: "Timed Out", value: timedOutSessionsCount },
                  { label: "Abandoned", value: abandonedSessionsCount },
                ]}
              />
            </div>
          </div>
        </GlassCard>

        <AdminRecentActivity events={recentEvents ?? []} />
      </div>
    </AdminShell>
  );
}
