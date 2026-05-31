import Link from "next/link";
import { Activity, BookOpen, ShieldCheck, Users } from "lucide-react";

import { GlassCard } from "@/components/shared/GlassCard";
import { Button } from "@/components/ui/button";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import AdminLogoutButton from "@/components/admin/AdminLogoutButton";

async function getTableCount(tableName: string) {
  const supabase = await createSupabaseServerClient();

  const { count, error } = await supabase
    .from(tableName)
    .select("*", { count: "exact", head: true });

  if (error) {
    return 0;
  }

  return count ?? 0;
}

export default async function AdminDashboardPage() {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("email, role")
    .eq("id", user?.id)
    .maybeSingle();

  const [usersCount, quizzesCount, sessionsCount] = await Promise.all([
    getTableCount("profiles"),
    getTableCount("quizzes"),
    getTableCount("sessions"),
  ]);

  return (
    <main className="min-h-screen px-4 py-6 text-white sm:px-6 md:px-10">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-200">
              <ShieldCheck className="h-4 w-4" />
              Admin Control Panel
            </div>

            <h1 className="text-3xl font-bold md:text-4xl">Admin Dashboard</h1>

            <p className="mt-2 text-sm text-slate-400">
              Logged in as {profile?.email ?? "Admin"}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link href="/teacher/dashboard">
              <Button variant="secondary">Teacher View</Button>
            </Link>

            <AdminLogoutButton />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <GlassCard className="p-5">
            <Users className="mb-4 h-6 w-6 text-cyan-300" />
            <p className="text-sm text-slate-400">Total Users</p>
            <h2 className="mt-2 text-3xl font-bold">{usersCount}</h2>
          </GlassCard>

          <GlassCard className="p-5">
            <BookOpen className="mb-4 h-6 w-6 text-cyan-300" />
            <p className="text-sm text-slate-400">Total Quizzes</p>
            <h2 className="mt-2 text-3xl font-bold">{quizzesCount}</h2>
          </GlassCard>

          <GlassCard className="p-5">
            <Activity className="mb-4 h-6 w-6 text-cyan-300" />
            <p className="text-sm text-slate-400">Total Sessions</p>
            <h2 className="mt-2 text-3xl font-bold">{sessionsCount}</h2>
          </GlassCard>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Link href="/admin/users">
            <GlassCard className="h-full p-5 transition hover:border-cyan-400/40">
              <Users className="mb-4 h-6 w-6 text-cyan-300" />
              <h2 className="text-lg font-semibold">Users</h2>
              <p className="mt-2 text-sm text-slate-400">
                View and manage teacher accounts.
              </p>
            </GlassCard>
          </Link>

          <Link href="/admin/quizzes">
            <GlassCard className="h-full p-5 transition hover:border-cyan-400/40">
              <BookOpen className="mb-4 h-6 w-6 text-cyan-300" />
              <h2 className="text-lg font-semibold">Quizzes</h2>
              <p className="mt-2 text-sm text-slate-400">
                View all quizzes created in the system.
              </p>
            </GlassCard>
          </Link>

          <Link href="/admin/sessions">
            <GlassCard className="h-full p-5 transition hover:border-cyan-400/40">
              <Activity className="mb-4 h-6 w-6 text-cyan-300" />
              <h2 className="text-lg font-semibold">Sessions</h2>
              <p className="mt-2 text-sm text-slate-400">
                Monitor quiz sessions and activity.
              </p>
            </GlassCard>
          </Link>

          <Link href="/admin/events">
            <GlassCard className="h-full p-5 transition hover:border-cyan-400/40">
              <ShieldCheck className="mb-4 h-6 w-6 text-cyan-300" />
              <h2 className="text-lg font-semibold">Activity Logs</h2>
              <p className="mt-2 text-sm text-slate-400">
                Review suspicious activity and session events.
              </p>
            </GlassCard>
          </Link>
        </div>
      </div>
    </main>
  );
}
