"use client";

import { useMemo, useState, useTransition } from "react";
import {
  Clock,
  Search,
  ShieldCheck,
  Trash2,
  User,
  UserCog,
} from "lucide-react";

import ConfirmDialog from "@/components/shared/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  deleteUserAction,
  updateUserRoleAction,
} from "@/lib/actions/admin.actions";

type AdminUser = {
  id: string;
  email: string;
  role: string;
  is_owner: boolean;
  created_at: string | null;
  last_sign_in_at: string | null;
};

type UserStatus = "active" | "idle" | "dormant" | "never-used";

type PendingAction =
  | { type: "role"; user: AdminUser; nextRole: "admin" | "teacher" }
  | { type: "delete"; user: AdminUser }
  | null;

type AdminUsersTableProps = {
  users: AdminUser[];
  currentUserId: string | null;
  adminCount: number;
};

function formatDate(dateValue: string | null) {
  if (!dateValue) return "—";
  return new Date(dateValue).toLocaleDateString();
}

function formatRelativeTime(dateValue: string | null) {
  if (!dateValue) return "Never";

  const diffMs = Date.now() - new Date(dateValue).getTime();
  const minutes = Math.max(1, Math.floor(diffMs / 60000));

  if (minutes < 60) return `${minutes} min${minutes === 1 ? "" : "s"} ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;

  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} day${days === 1 ? "" : "s"} ago`;

  const months = Math.floor(days / 30);
  return `${months} month${months === 1 ? "" : "s"} ago`;
}

function getUserStatus(lastSignInAt: string | null): UserStatus {
  if (!lastSignInAt) return "never-used";

  const diffDays = (Date.now() - new Date(lastSignInAt).getTime()) / 86400000;

  if (diffDays <= 7) return "active";
  if (diffDays <= 30) return "idle";
  return "dormant";
}

function getStatusLabel(status: UserStatus) {
  if (status === "active") return "Active";
  if (status === "idle") return "Idle";
  if (status === "dormant") return "Dormant";
  return "Never Used";
}

function getStatusClass(status: UserStatus) {
  if (status === "active") {
    return "border-emerald-400/20 bg-emerald-500/10 text-emerald-200";
  }

  if (status === "idle") {
    return "border-yellow-400/20 bg-yellow-500/10 text-yellow-200";
  }

  if (status === "dormant") {
    return "border-red-400/20 bg-red-500/10 text-red-200";
  }

  return "border-white/10 bg-white/5 text-slate-300";
}

function getRoleClass(role: string) {
  if (role === "admin") {
    return "border-violet-400/20 bg-violet-500/10 text-violet-200";
  }

  return "border-cyan-400/20 bg-cyan-400/10 text-cyan-200";
}

export default function AdminUsersTable({
  users,
  currentUserId,
  adminCount,
}: AdminUsersTableProps) {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [pendingAction, setPendingAction] = useState<PendingAction>(null);
  const [pendingUserId, setPendingUserId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();

    return users.filter((user) => {
      const status = getUserStatus(user.last_sign_in_at);

      const matchesSearch = user.email.toLowerCase().includes(query);

      const matchesRole =
        roleFilter === "all"
          ? true
          : roleFilter === "owner"
            ? user.is_owner
            : user.role === roleFilter;

      const matchesStatus =
        statusFilter === "all" ? true : status === statusFilter;

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, search, roleFilter, statusFilter]);

  function confirmAction() {
    if (!pendingAction) return;

    const action = pendingAction;
    setPendingUserId(action.user.id);

    startTransition(async () => {
      try {
        if (action.type === "role") {
          await updateUserRoleAction(action.user.id, action.nextRole);
        } else {
          await deleteUserAction(action.user.id);
        }

        setPendingAction(null);
      } finally {
        setPendingUserId(null);
      }
    });
  }

  return (
    <>
      <div className="grid gap-3 border-b border-white/10 px-5 py-4 lg:grid-cols-[1fr_180px_180px]">
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search user email..."
            className="h-11 pl-11"
          />
        </div>

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="h-11 rounded-xl border border-white/10 bg-black/20 px-4 pr-10 text-sm text-white outline-none"
        >
          <option value="all">All roles</option>
          <option value="owner">Owner</option>
          <option value="admin">Admins</option>
          <option value="teacher">Teachers</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-11 rounded-xl border border-white/10 bg-black/20 px-4 pr-10 text-sm text-white outline-none"
        >
          <option value="all">All statuses</option>
          <option value="active">Active</option>
          <option value="idle">Idle</option>
          <option value="dormant">Dormant</option>
          <option value="never-used">Never Used</option>
        </select>
      </div>

      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[1180px] table-auto text-left text-sm">
          <thead className="border-b border-white/10 text-slate-400">
            <tr>
              <th className="w-[340px] px-5 py-3 font-medium">User</th>
              <th className="w-[180px] px-5 py-3 font-medium">Role</th>
              <th className="w-[170px] px-5 py-3 font-medium">Last Login</th>
              <th className="w-[150px] px-5 py-3 font-medium">Status</th>
              <th className="w-[150px] px-5 py-3 font-medium">Created</th>
              <th className="w-[230px] px-5 py-3 font-medium">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredUsers.map((user) => {
              const isCurrentUser = currentUserId === user.id;
              const isLastAdmin = user.role === "admin" && adminCount <= 1;
              const isProtected = user.is_owner || isCurrentUser || isLastAdmin;
              const status = getUserStatus(user.last_sign_in_at);
              const nextRole = user.role === "admin" ? "teacher" : "admin";
              const rowIsPending = isPending && pendingUserId === user.id;

              return (
                <tr key={user.id} className="border-b border-white/5">
                  <td className="px-5 py-4">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10 text-cyan-200">
                        {user.role === "admin" ? (
                          <ShieldCheck className="h-5 w-5" />
                        ) : (
                          <User className="h-5 w-5" />
                        )}
                      </div>

                      <div className="min-w-0">
                        <p className="truncate font-semibold text-white">
                          {user.email}
                        </p>
                        <p className="mt-1 truncate text-xs text-slate-500">
                          User ID: {user.id}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex flex-wrap gap-2">
                      <span
                        className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${getRoleClass(
                          user.role,
                        )}`}
                      >
                        {user.role}
                      </span>

                      {user.is_owner && (
                        <span className="inline-flex rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-medium text-cyan-200">
                          Owner
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="px-5 py-4 text-slate-400">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-slate-600" />
                      {formatRelativeTime(user.last_sign_in_at)}
                    </div>
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${getStatusClass(
                        status,
                      )}`}
                    >
                      {getStatusLabel(status)}
                    </span>
                  </td>

                  <td className="px-5 py-4 text-slate-400">
                    {formatDate(user.created_at)}
                  </td>

                  <td className="px-5 py-4">
                    {isProtected ? (
                      <span className="inline-flex h-9 min-w-[150px] items-center justify-center rounded-xl border border-white/10 bg-white/5 px-4 text-xs font-medium text-slate-400">
                        {user.is_owner
                          ? "Protected Owner"
                          : isCurrentUser
                            ? "Current Admin"
                            : "Last Admin"}
                      </span>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          onClick={() =>
                            setPendingAction({
                              type: "role",
                              user,
                              nextRole,
                            })
                          }
                          disabled={rowIsPending}
                          className="h-10 w-[130px]"
                        >
                          {nextRole === "admin" ? (
                            <ShieldCheck className="h-4 w-4" />
                          ) : (
                            <UserCog className="h-4 w-4" />
                          )}
                          {rowIsPending
                            ? "Updating..."
                            : nextRole === "admin"
                              ? "Make Admin"
                              : "Make Teacher"}
                        </Button>

                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() =>
                            setPendingAction({ type: "delete", user })
                          }
                          disabled={rowIsPending}
                          className="h-10 w-[95px]"
                        >
                          <Trash2 className="h-4 w-4" />
                          {rowIsPending ? "..." : "Delete"}
                        </Button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}

            {!filteredUsers.length && (
              <tr>
                <td
                  colSpan={6}
                  className="px-5 py-10 text-center text-slate-400"
                >
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="divide-y divide-white/10 md:hidden">
        {filteredUsers.map((user) => {
          const isCurrentUser = currentUserId === user.id;
          const isLastAdmin = user.role === "admin" && adminCount <= 1;
          const isProtected = user.is_owner || isCurrentUser || isLastAdmin;
          const status = getUserStatus(user.last_sign_in_at);
          const nextRole = user.role === "admin" ? "teacher" : "admin";
          const rowIsPending = isPending && pendingUserId === user.id;

          return (
            <div key={user.id} className="space-y-4 px-5 py-5">
              <div className="flex min-w-0 items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10 text-cyan-200">
                  {user.role === "admin" ? (
                    <ShieldCheck className="h-5 w-5" />
                  ) : (
                    <User className="h-5 w-5" />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-white">
                    {user.email}
                  </p>

                  <div className="mt-2 flex flex-wrap gap-2">
                    <span
                      className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${getRoleClass(
                        user.role,
                      )}`}
                    >
                      {user.role}
                    </span>

                    {user.is_owner && (
                      <span className="inline-flex rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-medium text-cyan-200">
                        Owner
                      </span>
                    )}

                    <span
                      className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${getStatusClass(
                        status,
                      )}`}
                    >
                      {getStatusLabel(status)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid gap-3 rounded-2xl border border-white/10 bg-white/[0.02] p-4 text-sm">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-slate-500">Last Login</span>
                  <span className="text-right text-slate-300">
                    {formatRelativeTime(user.last_sign_in_at)}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <span className="text-slate-500">Created</span>
                  <span className="text-right text-slate-300">
                    {formatDate(user.created_at)}
                  </span>
                </div>
              </div>

              <div className="grid gap-2">
                {isProtected ? (
                  <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-center text-xs font-medium text-slate-400">
                    {user.is_owner
                      ? "Protected Owner"
                      : isCurrentUser
                        ? "Current Admin"
                        : "Last Admin"}
                  </div>
                ) : (
                  <>
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() =>
                        setPendingAction({ type: "role", user, nextRole })
                      }
                      disabled={rowIsPending}
                      className="h-11 w-full"
                    >
                      {nextRole === "admin" ? (
                        <ShieldCheck className="h-4 w-4" />
                      ) : (
                        <UserCog className="h-4 w-4" />
                      )}
                      {rowIsPending
                        ? "Updating..."
                        : nextRole === "admin"
                          ? "Make Admin"
                          : "Make Teacher"}
                    </Button>

                    <Button
                      type="button"
                      variant="destructive"
                      onClick={() => setPendingAction({ type: "delete", user })}
                      disabled={rowIsPending}
                      className="h-11 w-full"
                    >
                      <Trash2 className="h-4 w-4" />
                      {rowIsPending ? "Deleting..." : "Delete"}
                    </Button>
                  </>
                )}
              </div>
            </div>
          );
        })}

        {!filteredUsers.length && (
          <div className="px-5 py-10 text-center text-slate-400">
            No users found.
          </div>
        )}
      </div>

      <ConfirmDialog
        open={pendingAction !== null}
        title={
          pendingAction?.type === "delete"
            ? "Delete user?"
            : `Make ${pendingAction?.user.email} a ${pendingAction?.nextRole}?`
        }
        description={
          pendingAction?.type === "delete"
            ? `This will permanently delete ${pendingAction.user.email} and remove the Supabase Auth account too. This action cannot be undone.`
            : `This will update ${pendingAction?.user.email}'s role to ${pendingAction?.nextRole}.`
        }
        confirmText={
          pendingAction?.type === "delete"
            ? "Delete User"
            : pendingAction?.nextRole === "admin"
              ? "Make Admin"
              : "Make Teacher"
        }
        loadingText={
          pendingAction?.type === "delete" ? "Deleting..." : "Updating..."
        }
        confirmVariant={
          pendingAction?.type === "delete" ? "destructive" : "secondary"
        }
        isLoading={isPending}
        onOpenChange={(open) => {
          if (!open && !isPending) setPendingAction(null);
        }}
        onConfirm={confirmAction}
      />
    </>
  );
}
