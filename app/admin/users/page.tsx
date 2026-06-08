import { ShieldCheck, UserCheck, UserCog, Users } from "lucide-react";

import AdminShell from "@/components/admin/AdminShell";
import AdminUsersTable from "@/components/admin/AdminUsersTable";
import { GlassCard } from "@/components/shared/GlassCard";
import {
  getAdminUsersPageAction,
  getUserStatsAction,
} from "@/lib/actions/admin.actions";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const PAGE_SIZE = 50;

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

export default async function AdminUsersPage() {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user: currentUser },
  } = await supabase.auth.getUser();

  const [stats, firstPage] = await Promise.all([
    getUserStatsAction(),
    getAdminUsersPageAction({
      page: 0,
      pageSize: PAGE_SIZE,
      search: "",
      role: "all",
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

          <h1 className="text-3xl font-bold md:text-4xl">Users</h1>

          <p className="mt-2 text-sm text-slate-400">
            Manage platform accounts, roles, and login activity.
          </p>
        </div>

        <div className="-mx-4 overflow-x-auto px-4 pb-2 [scrollbar-width:none] sm:-mx-6 sm:px-6 md:mx-0 md:overflow-visible md:px-0 md:pb-0">
          <div className="flex w-max gap-3 pr-4 md:grid md:w-full md:grid-cols-4 md:gap-4 md:pr-0">
            <StatCard
              title="Total Users"
              value={stats.totalUsers}
              icon={Users}
            />
            <StatCard
              title="Admins"
              value={stats.adminCount}
              icon={ShieldCheck}
            />
            <StatCard
              title="Teachers"
              value={stats.teacherCount}
              icon={UserCog}
            />
            <StatCard
              title="Active This Week"
              value={stats.activeUsersCount}
              icon={UserCheck}
            />
          </div>
        </div>

        <GlassCard className="overflow-hidden p-0">
          <div className="flex flex-col gap-3 border-b border-white/10 px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-cyan-300" />
                <h2 className="text-lg font-semibold">User Accounts</h2>
              </div>

              <p className="mt-1 text-sm text-slate-400">
                Review account roles, login status, and admin permissions.
              </p>
            </div>

            {stats.ownerCount === 0 && (
              <div className="rounded-2xl border border-yellow-400/20 bg-yellow-500/10 px-4 py-3 text-sm text-yellow-200">
                No owner account is configured.
              </div>
            )}
          </div>

          <div className="px-5 pb-5">
            <AdminUsersTable
              initialUsers={firstPage.users}
              initialHasMore={firstPage.hasMore}
              pageSize={PAGE_SIZE}
              currentUserId={currentUser?.id ?? null}
              adminCount={stats.adminCount}
            />
          </div>
        </GlassCard>
      </div>
    </AdminShell>
  );
}
