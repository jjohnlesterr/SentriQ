import type { Quiz, QuizSession } from "@/lib/shared/types";

type Props = {
  session: QuizSession;
  quiz: Quiz | null;
};

function countEvents(session: QuizSession, type: string) {
  return session.events.filter((event) => event.type === type).length;
}

function normalize(value: string) {
  return value.trim().toLowerCase();
}

function isAnswerCorrect(
  question: Quiz["questions"][number],
  answer: number | string | undefined,
) {
  if (answer === undefined || answer === "") return false;

  if (question.type === "identification") {
    return (
      normalize(String(answer)) === normalize(question.correctTextAnswer || "")
    );
  }

  return answer === question.correctAnswer;
}

function getEffectiveQuiz(session: QuizSession, quiz: Quiz | null) {
  return session.quizSnapshot ?? quiz;
}

function getScore(session: QuizSession, quiz: Quiz | null) {
  const effectiveQuiz = getEffectiveQuiz(session, quiz);
  const questions = effectiveQuiz?.questions ?? [];

  if (typeof session.score === "number") {
    return {
      correct: session.score,
      total: questions.length,
    };
  }

  if (!questions.length) {
    return {
      correct: 0,
      total: 0,
    };
  }

  const correct = questions.reduce((total, question, index) => {
    return total + (isAnswerCorrect(question, session.answers[index]) ? 1 : 0);
  }, 0);

  return {
    correct,
    total: questions.length,
  };
}

function formatTimeSpent(session: QuizSession) {
  if (!session.startedAt) return "—";

  const startedAtMs = new Date(session.startedAt).getTime();

  if (Number.isNaN(startedAtMs)) return "—";

  const endedAt =
    session.completedAt || session.timedOutAt || new Date().toISOString();

  const endedAtMs = new Date(endedAt).getTime();

  if (Number.isNaN(endedAtMs)) return "—";

  const totalSeconds = Math.max(
    0,
    Math.floor((endedAtMs - startedAtMs) / 1000),
  );
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }

  if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  }

  return `${seconds}s`;
}

function getStatusTone(status: QuizSession["status"]) {
  if (status === "completed") return "success";
  if (status === "timed-out") return "warning";
  if (status === "abandoned") return "danger";
  if (status === "in-progress") return "info";

  return "default";
}

function StatCard({
  label,
  value,
  tone = "default",
}: {
  label: string;
  value: string | number;
  tone?: "default" | "success" | "warning" | "danger" | "info";
}) {
  const toneClass = {
    default: "text-white",
    success: "text-emerald-300",
    warning: "text-yellow-300",
    danger: "text-red-400",
    info: "text-cyan-300",
  }[tone];

  return (
    <div className="min-h-[68px] rounded-2xl border border-white/10 bg-white/[0.04] p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] sm:min-h-[78px] sm:p-4">
      <p className="text-[11px] leading-4 text-slate-400 sm:text-xs">{label}</p>

      <p className={`mt-1 text-sm font-bold capitalize ${toneClass}`}>
        {value}
      </p>
    </div>
  );
}

export default function SessionStatsGrid({ session, quiz }: Props) {
  const tabLeft = countEvents(session, "tab-left");
  const fullscreenExit = countEvents(session, "fullscreen-exit");
  const copyAttempt = countEvents(session, "copy-attempt");
  const pasteAttempt = countEvents(session, "paste-attempt");
  const score = getScore(session, quiz);
  const timeSpent = formatTimeSpent(session);

  return (
    <div className="grid shrink-0 grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 lg:grid-cols-8">
      <StatCard
        label="Status"
        value={session.status}
        tone={getStatusTone(session.status)}
      />

      <StatCard
        label="Score"
        value={
          score.total > 0 ? `${score.correct}/${score.total}` : "Not graded"
        }
        tone={score.total > 0 ? "success" : "default"}
      />

      <StatCard label="Time Spent" value={timeSpent} tone="info" />

      <StatCard
        label="Tab Left"
        value={tabLeft}
        tone={tabLeft > 0 ? "danger" : "success"}
      />

      <StatCard
        label="Fullscreen Exit"
        value={fullscreenExit}
        tone={fullscreenExit > 0 ? "warning" : "success"}
      />

      <StatCard
        label="Copy"
        value={copyAttempt}
        tone={copyAttempt > 0 ? "warning" : "success"}
      />

      <StatCard
        label="Paste"
        value={pasteAttempt}
        tone={pasteAttempt > 0 ? "danger" : "success"}
      />

      <StatCard
        label="Report Access"
        value={session.reportVisibility}
        tone="info"
      />
    </div>
  );
}
