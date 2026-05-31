import Link from "next/link";
import { Activity, ArrowLeft, ShieldCheck } from "lucide-react";

import AdminSessionsTable from "@/components/admin/AdminSessionsTable";
import { GlassCard } from "@/components/shared/GlassCard";
import { Button } from "@/components/ui/button";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function AdminSessionsPage() {
  const supabase = await createSupabaseServerClient();

  const { data: sessions } = await supabase
    .from("sessions")
    .select(
      "id, quiz_id, student_name, student_id, started_at, completed_at, status, approval_status, score, tab_switches",
    )
    .order("started_at", { ascending: false });

  return (
    <main className="min-h-screen px-4 py-6 text-white sm:px-6 md:px-10">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-200">
              <ShieldCheck className="h-4 w-4" />
              Admin Control Panel
            </div>

            <h1 className="text-3xl font-bold md:text-4xl">Sessions</h1>

            <p className="mt-2 text-sm text-slate-400">
              Search, monitor, and delete quiz sessions.
            </p>
          </div>

          <Link href="/admin/dashboard">
            <Button variant="secondary">
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
        </div>

        <GlassCard className="overflow-hidden p-0">
          <div className="border-b border-white/10 px-5 py-4">
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-cyan-300" />
              <h2 className="text-lg font-semibold">Session Records</h2>
            </div>
          </div>

          <AdminSessionsTable sessions={sessions ?? []} />
        </GlassCard>
      </div>
    </main>
  );
}
