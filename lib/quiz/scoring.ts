import type { Quiz } from "@/lib/shared/types";

type AnswerMap = Record<number, number | string>;
type Question = Quiz["questions"][number];

// Single source of truth for whether one answer is correct (used by scoring and answer review).
export function isAnswerCorrect(question: Question, answer: number | string | undefined) {
  if (question.type === "identification") {
    const studentAnswer = typeof answer === "string" ? answer.trim().toLowerCase() : "";
    const correctAnswer = question.correctTextAnswer?.trim().toLowerCase();

    return Boolean(studentAnswer) && studentAnswer === correctAnswer;
  }

  return Number(answer) === question.correctAnswer;
}

export function calculateQuizScore(quiz: Quiz, answers: AnswerMap) {
  return quiz.questions.reduce(
    (score, question, index) => score + (isAnswerCorrect(question, answers[index]) ? 1 : 0),
    0,
  );
}
