"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";

import DeleteUserButton from "@/components/admin/DeleteUserButton";
import UpdateUserRoleButton from "@/components/admin/UpdateUserRoleButton";
import { Input } from "@/components/ui/input";

type Profile = {
  id: string;
  email: string;
  role: string;
  created_at: string | null;
};

type AdminUsersTableProps = {
  profiles: Profile[];
};

export default function AdminUsersTable({ profiles }: AdminUsersTableProps) {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  const filteredProfiles = useMemo(() => {
    return profiles.filter((profile) => {
      const matchesSearch = profile.email
        .toLowerCase()
        .includes(search.trim().toLowerCase());

      const matchesRole =
        roleFilter === "all" ? true : profile.role === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [profiles, search, roleFilter]);

  return (
    <>
      <div className="grid gap-3 border-b border-white/10 px-5 py-4 md:grid-cols-[1fr_180px]">
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
          className="h-11 rounded-xl border border-white/10 bg-black/20 px-4 text-sm text-white outline-none"
        >
          <option value="all">All roles</option>
          <option value="admin">Admins</option>
          <option value="teacher">Teachers</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[1000px] text-left text-sm">
          <thead className="border-b border-white/10 text-slate-400">
            <tr>
              <th className="px-5 py-3 font-medium">Email</th>
              <th className="px-5 py-3 font-medium">Role</th>
              <th className="px-5 py-3 font-medium">Created</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredProfiles.map((profile) => (
              <tr key={profile.id} className="border-b border-white/5">
                <td className="px-5 py-4 text-white">{profile.email}</td>

                <td className="px-5 py-4">
                  <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs text-cyan-200">
                    {profile.role}
                  </span>
                </td>

                <td className="px-5 py-4 text-slate-400">
                  {profile.created_at
                    ? new Date(profile.created_at).toLocaleDateString()
                    : "—"}
                </td>

                <td className="px-5 py-4 text-emerald-300">Active</td>

                <td className="px-5 py-4">
                  <div className="flex flex-wrap gap-2">
                    <UpdateUserRoleButton
                      userId={profile.id}
                      currentRole={profile.role}
                      email={profile.email}
                    />

                    {profile.role === "admin" ? (
                      <span className="self-center text-xs text-slate-500">
                        Protected
                      </span>
                    ) : (
                      <DeleteUserButton
                        userId={profile.id}
                        email={profile.email}
                      />
                    )}
                  </div>
                </td>
              </tr>
            ))}

            {!filteredProfiles.length && (
              <tr>
                <td
                  colSpan={5}
                  className="px-5 py-10 text-center text-slate-400"
                >
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}