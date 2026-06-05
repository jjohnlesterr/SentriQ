import { createClient } from "@supabase/supabase-js";
import {
  BookOpen,
  CheckCircle2,
  FileQuestion,
  ShieldCheck,
  Users,
} from "lucide-react";

import AdminShell from "@/components/admin/AdminShell";
import AdminQuizzesTable from "@/components/admin/AdminQuizzesTable";
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
  icon: typeof BookOpen;
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

export default async function AdminQuizzesPage() {
  const supabase = createSupabaseAdminClient();

  const { data: quizzes } = await supabase
    .from("quizzes")
    .select(
      "id, title, description, code, created_by, published, status, created_at, time_limit_minutes, join_locked",
    )
    .order("created_at", { ascending: false });

const { data: questions, error: questionsError } = await supabase
  .from("questions")
  .select("*")
  .order("position", { ascending: true });

if (questionsError) {
  console.error("Questions query failed:", questionsError.message);
}

  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, email");

  const { data: sessions } = await supabase.from("sessions").select("quiz_id");

  const profilesById = new Map(
    (profiles ?? []).map((profile) => [profile.id, profile.email]),
  );

  const questionsByQuizId = new Map<string, NonNullable<typeof questions>>();

  for (const question of questions ?? []) {
    if (!question.quiz_id) continue;

    const existing = questionsByQuizId.get(question.quiz_id) ?? [];
    existing.push(question);
    questionsByQuizId.set(question.quiz_id, existing);
  }

  const sessionsByQuizId = new Map<string, number>();

  for (const session of sessions ?? []) {
    if (!session.quiz_id) continue;

    sessionsByQuizId.set(
      session.quiz_id,
      (sessionsByQuizId.get(session.quiz_id) ?? 0) + 1,
    );
  }

  const enrichedQuizzes =
    quizzes?.map((quiz) => {
      const quizQuestions = questionsByQuizId.get(quiz.id) ?? [];

      return {
        ...quiz,
        creator_email: quiz.created_by
          ? (profilesById.get(quiz.created_by) ?? quiz.created_by)
          : null,
        questions: quizQuestions,
        question_count: quizQuestions.length,
        session_count: sessionsByQuizId.get(quiz.id) ?? 0,
      };
    }) ?? [];

  const totalQuizzes = enrichedQuizzes.length;
  const publishedCount = enrichedQuizzes.filter(
    (quiz) => quiz.published === true || quiz.status === "published",
  ).length;
  const draftCount = totalQuizzes - publishedCount;
  const totalQuestions = questions?.length ?? 0;

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
            Search, review, and manage quizzes created in the system.
          </p>
        </div>

        <div className="-mx-4 overflow-x-auto px-4 pb-2 [scrollbar-width:none] sm:-mx-6 sm:px-6 md:mx-0 md:overflow-visible md:px-0 md:pb-0">
          <div className="flex w-max gap-3 pr-4 md:grid md:w-full md:grid-cols-4 md:gap-4 md:pr-0">
            <StatCard
              title="Total Quizzes"
              value={totalQuizzes}
              icon={BookOpen}
            />
            <StatCard
              title="Published"
              value={publishedCount}
              icon={CheckCircle2}
            />
            <StatCard title="Drafts" value={draftCount} icon={FileQuestion} />
            <StatCard title="Questions" value={totalQuestions} icon={Users} />
          </div>
        </div>

        <GlassCard className="overflow-hidden p-0">
          <div className="border-b border-white/10 px-5 py-5">
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-cyan-300" />
              <h2 className="text-lg font-semibold">Quiz Records</h2>
            </div>

            <p className="mt-1 text-sm text-slate-400">
              Review quiz details, question count, creator, and usage.
            </p>
          </div>

          <AdminQuizzesTable quizzes={enrichedQuizzes} />
        </GlassCard>
      </div>
    </AdminShell>
  );
}
