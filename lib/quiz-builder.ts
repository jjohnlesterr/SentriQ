import type { Question, QuestionType } from "@/lib/types";

export function createEmptyQuestion(): Question {
  return {
    id: Date.now().toString(),
    type: "multiple_choice",
    text: "",
    options: ["", "", "", ""],
    correctAnswer: 0,
    correctTextAnswer: "",
  };
}

export function isQuestionComplete(question: Question | undefined) {
  if (!question) return true;

  if (!question.text.trim()) {
    return false;
  }

  if (question.type === "identification") {
    return !!question.correctTextAnswer?.trim();
  }

  return question.options.every((option) => option.trim() !== "");
}

export function getQuestionTypeDefaults(
  current: Question,
  type: QuestionType
): Partial<Question> {
  if (type === "multiple_choice") {
    return {
      type,
      options:
        current.options && current.options.length > 0
          ? current.options
          : ["", "", "", ""],
      correctAnswer: 0,
      correctTextAnswer: "",
    };
  }

  if (type === "true_false") {
    return {
      type,
      options: ["True", "False"],
      correctAnswer: 0,
      correctTextAnswer: "",
    };
  }

  return {
    type,
    options: [],
    correctAnswer: 0,
    correctTextAnswer: "",
  };
}