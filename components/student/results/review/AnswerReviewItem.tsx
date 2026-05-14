import { CheckCircle2, XCircle } from "lucide-react";

import type { Quiz } from "@/lib/shared/types";

type Question = Quiz["questions"][number];

type AnswerReviewItemProps = {
  question: Question;
  index: number;
  answer: number | string | undefined;
};

function normalize(value: string) {
  return value.trim().toLowerCase();
}

function getStudentAnswerText(question: Question, answer: number | string | undefined) {
  if (answer === undefined || answer === "") return "No answer";

  if (question.type === "identification") {
    return String(answer);
  }

  if (typeof answer === "number") {
    return question.options[answer] ?? "Invalid answer";
  }

  return String(answer);
}

function getCorrectAnswerText(question: Question) {
  if (question.type === "identification") {
    return question.correctTextAnswer || "No correct answer set";
  }

  return question.options[question.correctAnswer] || "No correct answer set";
}

function isAnswerCorrect(question: Question, answer: number | string | undefined) {
  if (answer === undefined || answer === "") return false;

  if (question.type === "identification") {
    return normalize(String(answer)) === normalize(question.correctTextAnswer || "");
  }

  return answer === question.correctAnswer;
}

export default function AnswerReviewItem({
  question,
  index,
  answer,
}: AnswerReviewItemProps) {
  const correct = isAnswerCorrect(question, answer);

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-slate-400">
          Question {index + 1}
        </p>

        <span
          className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold ${
            correct
              ? "border-emerald-400/20 bg-emerald-500/10 text-emerald-300"
              : "border-red-400/20 bg-red-500/10 text-red-300"
          }`}
        >
          {correct ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
          {correct ? "Correct" : "Wrong"}
        </span>
      </div>

      <p className="text-sm font-semibold text-white">{question.text}</p>

      <div className="mt-3 grid gap-3 text-sm md:grid-cols-2">
        <div className="rounded-xl border border-white/10 bg-slate-950/40 p-3">
          <p className="text-xs text-slate-500">Your Answer</p>
          <p className="mt-1 text-slate-200">
            {getStudentAnswerText(question, answer)}
          </p>
        </div>

        <div className="rounded-xl border border-emerald-400/20 bg-emerald-500/10 p-3">
          <p className="text-xs text-emerald-200/80">Correct Answer</p>
          <p className="mt-1 font-semibold text-emerald-200">
            {getCorrectAnswerText(question)}
          </p>
        </div>
      </div>
    </div>
  );
}