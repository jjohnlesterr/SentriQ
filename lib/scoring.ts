import type { Quiz } from "@/lib/types";

type AnswerMap = Record<number, number | string>;

export function calculateQuizScore(quiz: Quiz, answers: AnswerMap) {
  let score = 0;

  quiz.questions.forEach((question, index) => {
    const answer = answers[index];

    if (question.type === "identification") {
      const studentAnswer = typeof answer === "string" ? answer.trim().toLowerCase() : "";
      const correctAnswer = question.correctTextAnswer?.trim().toLowerCase();

      if (studentAnswer && studentAnswer === correctAnswer) {
        score++;
      }

      return;
    }

    if (Number(answer) === question.correctAnswer) {
      score++;
    }
  });

  return score;
}