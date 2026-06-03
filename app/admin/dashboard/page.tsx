import Link from "next/link";
import {
  Activity,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ClipboardList,
  FileText,
  PlayCircle,
  ShieldCheck,
  UserCog,
  Users,
} from "lucide-react";

import AdminShell from "@/components/admin/AdminShell";
import { GlassCard } from "@/components/shared/GlassCard";
import { Button } from "@/components/ui/button";
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

function formatRelativeTime(dateValue: string | null) {
  if (!dateValue) return "Unknown time";

  const diffMs = Date.now() - new Date(dateValue).getTime();
  const minutes = Math.max(1, Math.floor(diffMs / 60000));

  if (minutes < 60) return `${minutes} min${minutes === 1 ? "" : "s"} ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;

  const days = Math.floor(hours / 24);
  return `${days} day${days === 1 ? "" : "s"} ago`;
}

function formatEventLabel(type: string | null, description: string | null) {
  if (description) return description;
  if (!type) return "Activity recorded";

  return type
    .replaceAll("-", " ")
    .replaceAll("_", " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
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
    <GlassCard className="p-5">
      <Icon className="mb-4 h-6 w-6 text-cyan-300" />
      <p className="text-sm text-slate-400">{title}</p>
      <h2 className="mt-2 text-3xl font-bold">{value}</h2>
    </GlassCard>
  );
}

function OverviewItem({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: number;
  icon: typeof Users;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-300">
        <Icon className="h-5 w-5" />
      </div>

      <p className="text-sm text-slate-400">{label}</p>
      <p className="mt-2 text-2xl font-bold text-white">{value}</p>
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
    activeSessionsCount,
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
    getFilteredCount("sessions", "status", "active"),
  ]);

  const { data: recentEvents } = await supabase
    .from("session_events")
    .select("id, session_id, type, timestamp, description")
    .order("timestamp", { ascending: false })
    .limit(5);

  return (
    <AdminShell>
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
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

          <Link href="/teacher/dashboard">
            <Button variant="secondary">
              <UserCog className="h-4 w-4" />
              Teacher View
            </Button>
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
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

        <GlassCard className="p-5">
          <h2 className="text-lg font-semibold">System Overview</h2>
          <p className="mt-1 text-sm text-slate-400">
            Quick status summary across users, quizzes, and sessions.
          </p>

          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <OverviewItem label="Teachers" value={teachersCount} icon={Users} />
            <OverviewItem
              label="Admins"
              value={adminsCount}
              icon={ShieldCheck}
            />
            <OverviewItem
              label="Published Quizzes"
              value={publishedQuizzesCount}
              icon={BookOpen}
            />
            <OverviewItem
              label="Draft Quizzes"
              value={draftQuizzesCount}
              icon={FileText}
            />
            <OverviewItem
              label="Completed Sessions"
              value={completedSessionsCount}
              icon={CheckCircle2}
            />
            <OverviewItem
              label="Active Sessions"
              value={activeSessionsCount}
              icon={PlayCircle}
            />
          </div>
        </GlassCard>

        <GlassCard className="overflow-hidden p-0">
          <div className="flex flex-col gap-3 border-b border-white/10 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold">Recent Activity</h2>
              <p className="mt-1 text-sm text-slate-400">
                Latest events recorded by the system.
              </p>
            </div>

            <Link href="/admin/events">
              <Button variant="secondary" size="sm">
                View All Logs
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="divide-y divide-white/10">
            {(recentEvents ?? []).map((event) => (
              <div
                key={event.id}
                className="grid gap-3 px-5 py-4 md:grid-cols-[1fr_280px_110px] md:items-center"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-white">
                    {formatEventLabel(event.type, event.description)}
                  </p>
                  <p className="mt-1 truncate text-xs text-slate-500">
                    {event.session_id
                      ? `Session ID: ${event.session_id}`
                      : "System event"}
                  </p>
                </div>

                <p className="truncate text-sm text-slate-400">
                  {event.type || "activity"}
                </p>

                <p className="text-sm text-slate-500 md:text-right">
                  {formatRelativeTime(event.timestamp)}
                </p>
              </div>
            ))}

            {!recentEvents?.length && (
              <div className="px-5 py-10 text-center text-slate-400">
                No activity logs yet.
              </div>
            )}
          </div>
        </GlassCard>
      </div>
    </AdminShell>
  );
}
