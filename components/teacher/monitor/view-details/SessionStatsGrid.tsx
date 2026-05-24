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
  answer: number | string | undefined
) {
  if (answer === undefined || answer === "") return false;

  if (question.type === "identification") {
    return normalize(String(answer)) === normalize(question.correctTextAnswer || "");
  }

  return answer === question.correctAnswer;
}

function getScore(session: QuizSession, quiz: Quiz | null) {
  if (typeof session.score === "number") {
    return {
      correct: session.score,
      total: quiz?.questions.length ?? 0,
    };
  }

  if (!quiz?.questions.length) {
    return {
      correct: 0,
      total: 0,
    };
  }

  const correct = quiz.questions.reduce((total, question, index) => {
    return total + (isAnswerCorrect(question, session.answers[index]) ? 1 : 0);
  }, 0);

  return {
    correct,
    total: quiz.questions.length,
  };
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
    warning: "text-orange-300",
    danger: "text-red-300",
    info: "text-cyan-300",
  }[tone];

  return (
    <div className="min-h-[78px] rounded-2xl border border-white/10 bg-white/[0.04] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
      <p className="text-xs text-slate-400">{label}</p>
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

  return (
    <div className="grid shrink-0 grid-cols-3 gap-3 lg:grid-cols-8">
      <StatCard
        label="Status"
        value={session.status}
        tone={session.status === "completed" ? "success" : "info"}
      />

      <StatCard
        label="Score"
        value={score.total > 0 ? `${score.correct}/${score.total}` : "Not graded"}
        tone={score.total > 0 ? "success" : "default"}
      />

      <StatCard
        label="Tab Switches"
        value={session.tabSwitches}
        tone={session.tabSwitches > 0 ? "danger" : "success"}
      />

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