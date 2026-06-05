import { createClient } from "@supabase/supabase-js";
import { Activity, AlertTriangle, Clipboard, Maximize, ShieldCheck } from "lucide-react";

import AdminShell from "@/components/admin/AdminShell";
import AdminEventsTable from "@/components/admin/AdminEventsTable";
import { GlassCard } from "@/components/shared/GlassCard";

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
  icon: typeof Activity;
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

export default async function AdminEventsPage() {
  const supabase = createSupabaseAdminClient();

  const { data: events } = await supabase
    .from("session_events")
    .select("id, session_id, type, timestamp, description, duration_seconds")
    .order("timestamp", { ascending: false });

  const { data: sessions } = await supabase
    .from("sessions")
    .select("id, quiz_id, student_name, student_id, status, score");

  const { data: quizzes } = await supabase
    .from("quizzes")
    .select("id, title, code");

  const sessionsById = new Map(
    (sessions ?? []).map((session) => [session.id, session]),
  );

  const quizzesById = new Map((quizzes ?? []).map((quiz) => [quiz.id, quiz]));

  const enrichedEvents =
    events?.map((event) => {
      const session = event.session_id
        ? sessionsById.get(event.session_id)
        : null;

      const quiz = session?.quiz_id ? quizzesById.get(session.quiz_id) : null;

      return {
        ...event,
        student_name: session?.student_name ?? null,
        student_id: session?.student_id ?? null,
        session_status: session?.status ?? null,
        session_score: session?.score ?? null,
        quiz_title: quiz?.title ?? null,
        quiz_code: quiz?.code ?? null,
      };
    }) ?? [];

  const totalEvents = enrichedEvents.length;
  const riskyEvents = enrichedEvents.filter((event) => {
    const type = event.type ?? "";
    return (
      type.includes("copy") ||
      type.includes("paste") ||
      type.includes("fullscreen") ||
      type.includes("tab") ||
      type.includes("abandoned") ||
      type.includes("time-expired")
    );
  }).length;
  const copyAttempts = enrichedEvents.filter((event) =>
    event.type?.includes("copy"),
  ).length;
  const fullscreenExits = enrichedEvents.filter((event) =>
    event.type?.includes("fullscreen"),
  ).length;

  return (
    <AdminShell>
      <div className="mx-auto max-w-7xl space-y-6">
        <div>
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-200">
            <ShieldCheck className="h-4 w-4" />
            Admin Control Panel
          </div>

          <h1 className="text-3xl font-bold md:text-4xl">Activity Logs</h1>

          <p className="mt-2 text-sm text-slate-400">
            Search and review all recorded session events and activities.
          </p>
        </div>

        <div className="-mx-4 overflow-x-auto px-4 pb-2 [scrollbar-width:none] sm:-mx-6 sm:px-6 md:mx-0 md:overflow-visible md:px-0 md:pb-0">
          <div className="flex w-max gap-3 pr-4 md:grid md:w-full md:grid-cols-4 md:gap-4 md:pr-0">
            <StatCard title="Total Logs" value={totalEvents} icon={Activity} />
            <StatCard title="Risky Events" value={riskyEvents} icon={AlertTriangle} />
            <StatCard title="Copy Attempts" value={copyAttempts} icon={Clipboard} />
            <StatCard title="Fullscreen Exits" value={fullscreenExits} icon={Maximize} />
          </div>
        </div>

        <GlassCard className="overflow-hidden p-0">
          <div className="border-b border-white/10 px-5 py-5">
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-cyan-300" />
              <h2 className="text-lg font-semibold">Activity Records</h2>
            </div>

            <p className="mt-1 text-sm text-slate-400">
              Review event type, student, quiz, session, and timestamp.
            </p>
          </div>

          <AdminEventsTable events={enrichedEvents} />
        </GlassCard>
      </div>
    </AdminShell>
  );
}