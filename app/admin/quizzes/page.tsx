import { BookOpen, ShieldCheck } from "lucide-react";

import AdminShell from "@/components/admin/AdminShell";
import AdminQuizzesTable from "@/components/admin/AdminQuizzesTable";
import { GlassCard } from "@/components/shared/GlassCard";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function AdminQuizzesPage() {
  const supabase = await createSupabaseServerClient();

  const { data: quizzes } = await supabase
    .from("quizzes")
    .select("id, title, code, created_by, published, status, created_at")
    .order("created_at", { ascending: false });

  return (
    <AdminShell>
      <div className="mx-auto max-w-7xl space-y-6">
        <div>
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-200">
            <ShieldCheck className="h-4 w-4" />
            Admin Control Panel
          </div>

          <h1 className="text-3xl font-bold md:text-4xl">Quizzes</h1>

          <p className="mt-2 text-sm text-slate-400">
            Search, review, and delete quizzes created in the system.
          </p>
        </div>

        <GlassCard className="overflow-hidden p-0">
          <div className="border-b border-white/10 px-5 py-4">
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-cyan-300" />
              <h2 className="text-lg font-semibold">Quiz Records</h2>
            </div>
          </div>

          <AdminQuizzesTable quizzes={quizzes ?? []} />
        </GlassCard>
      </div>
    </AdminShell>
  );
}