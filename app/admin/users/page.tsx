import { createClient } from "@supabase/supabase-js";
import { ShieldCheck, UserCheck, UserCog, Users } from "lucide-react";

import AdminShell from "@/components/admin/AdminShell";
import AdminUsersTable from "@/components/admin/AdminUsersTable";
import { GlassCard } from "@/components/shared/GlassCard";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function createSupabaseAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl) throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL");
  if (!serviceRoleKey) throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY");

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
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

function isActiveThisWeek(lastSignInAt: string | null) {
  if (!lastSignInAt) return false;

  const diffMs = Date.now() - new Date(lastSignInAt).getTime();
  const diffDays = diffMs / 86400000;

  return diffDays <= 7;
}

export default async function AdminUsersPage() {
  const supabase = await createSupabaseServerClient();
  const supabaseAdmin = createSupabaseAdminClient();

  const {
    data: { user: currentUser },
  } = await supabase.auth.getUser();

  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, email, role, created_at, is_owner")
    .order("created_at", { ascending: false });

  const {
    data: { users: authUsers },
  } = await supabaseAdmin.auth.admin.listUsers({
    page: 1,
    perPage: 1000,
  });

  const users =
    profiles?.map((profile) => {
      const authUser = authUsers.find((item) => item.id === profile.id);

      return {
        id: profile.id,
        email: profile.email,
        role: profile.role,
        is_owner: profile.is_owner ?? false,
        created_at: authUser?.created_at ?? profile.created_at,
        last_sign_in_at: authUser?.last_sign_in_at ?? null,
      };
    }) ?? [];

  const totalUsers = users.length;
  const adminCount = users.filter((user) => user.role === "admin").length;
  const teacherCount = users.filter((user) => user.role === "teacher").length;
  const ownerCount = users.filter((user) => user.is_owner).length;
  const activeUsersCount = users.filter((user) =>
    isActiveThisWeek(user.last_sign_in_at),
  ).length;

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
            <StatCard title="Total Users" value={totalUsers} icon={Users} />
            <StatCard title="Admins" value={adminCount} icon={ShieldCheck} />
            <StatCard title="Teachers" value={teacherCount} icon={UserCog} />
            <StatCard
              title="Active This Week"
              value={activeUsersCount}
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

            {ownerCount === 0 && (
              <div className="rounded-2xl border border-yellow-400/20 bg-yellow-500/10 px-4 py-3 text-sm text-yellow-200">
                No owner account is configured.
              </div>
            )}
          </div>

          <AdminUsersTable
            users={users}
            currentUserId={currentUser?.id ?? null}
            adminCount={adminCount}
          />
        </GlassCard>
      </div>
    </AdminShell>
  );
}
