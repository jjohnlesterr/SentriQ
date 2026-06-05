import { createClient } from "@supabase/supabase-js";
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  ShieldCheck,
  TimerOff,
} from "lucide-react";

import AdminShell from "@/components/admin/AdminShell";
import AdminSessionsTable from "@/components/admin/AdminSessionsTable";
import { GlassCard } from "@/components/shared/GlassCard";
import { cleanupInactiveSessions } from "@/lib/actions";

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

export default async function AdminSessionsPage() {
  await cleanupInactiveSessions();

  const supabase = createSupabaseAdminClient();

  const { data: sessions } = await supabase
    .from("sessions")
    .select("*")
    .order("started_at", { ascending: false });

  const { data: quizzes } = await supabase
    .from("quizzes")
    .select("id, title, code");

  const { data: events } = await supabase
    .from("session_events")
    .select("id, session_id, type, timestamp, description, duration_seconds")
    .order("timestamp", { ascending: true });

  const { data: questions } = await supabase
    .from("questions")
    .select("id, quiz_id, text, position")
    .order("position", { ascending: true });

  const quizzesById = new Map((quizzes ?? []).map((quiz) => [quiz.id, quiz]));

  const eventsBySessionId = new Map<string, NonNullable<typeof events>>();

  for (const event of events ?? []) {
    if (!event.session_id) continue;

    const existing = eventsBySessionId.get(event.session_id) ?? [];
    existing.push(event);
    eventsBySessionId.set(event.session_id, existing);
  }

  const questionsByQuizId = new Map<string, NonNullable<typeof questions>>();

  for (const question of questions ?? []) {
    if (!question.quiz_id) continue;

    const existing = questionsByQuizId.get(question.quiz_id) ?? [];
    existing.push(question);
    questionsByQuizId.set(question.quiz_id, existing);
  }

  const enrichedSessions =
    sessions?.map((session) => {
      const quiz = session.quiz_id ? quizzesById.get(session.quiz_id) : null;

      return {
        ...session,
        quiz_title: quiz?.title ?? null,
        quiz_code: quiz?.code ?? null,
        events: eventsBySessionId.get(session.id) ?? [],
        questions: session.quiz_id
          ? (questionsByQuizId.get(session.quiz_id) ?? [])
          : [],
      };
    }) ?? [];

  const totalSessions = enrichedSessions.length;
  const completedCount = enrichedSessions.filter(
    (session) => session.status === "completed",
  ).length;
  const timedOutCount = enrichedSessions.filter(
    (session) => session.status === "timed-out",
  ).length;
  const abandonedCount = enrichedSessions.filter(
    (session) => session.status === "abandoned",
  ).length;

  return (
    <AdminShell>
      <div className="mx-auto max-w-7xl space-y-6">
        <div>
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-200">
            <ShieldCheck className="h-4 w-4" />
            Admin Control Panel
          </div>

          <h1 className="text-3xl font-bold md:text-4xl">Sessions</h1>

          <p className="mt-2 text-sm text-slate-400">
            Monitor quiz attempts, risk indicators, answers, and activity logs.
          </p>
        </div>

        <div className="-mx-4 overflow-x-auto px-4 pb-2 [scrollbar-width:none] sm:-mx-6 sm:px-6 md:mx-0 md:overflow-visible md:px-0 md:pb-0">
          <div className="flex w-max gap-3 pr-4 md:grid md:w-full md:grid-cols-4 md:gap-4 md:pr-0">
            <StatCard
              title="Total Sessions"
              value={totalSessions}
              icon={Activity}
            />
            <StatCard
              title="Completed"
              value={completedCount}
              icon={CheckCircle2}
            />
            <StatCard title="Timed Out" value={timedOutCount} icon={TimerOff} />
            <StatCard
              title="Abandoned"
              value={abandonedCount}
              icon={AlertTriangle}
            />
          </div>
        </div>

        <GlassCard className="overflow-hidden p-0">
          <div className="border-b border-white/10 px-5 py-5">
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-cyan-300" />
              <h2 className="text-lg font-semibold">Session Records</h2>
            </div>

            <p className="mt-1 text-sm text-slate-400">
              Review session results, quiz details, risk level, and activity
              timeline.
            </p>
          </div>

          <AdminSessionsTable sessions={enrichedSessions} />
        </GlassCard>
      </div>
    </AdminShell>
  );
}
