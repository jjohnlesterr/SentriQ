import type { ReactNode } from "react";

import AdminLayoutClient from "@/components/admin/AdminLayoutClient";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type Props = {
  children: ReactNode;
};

export default async function AdminShell({ children }: Props) {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("email")
    .eq("id", user?.id)
    .maybeSingle();

  return (
    <AdminLayoutClient adminEmail={profile?.email ?? user?.email ?? "Admin"}>
      {children}
    </AdminLayoutClient>
  );
}
