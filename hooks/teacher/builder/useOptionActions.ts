"use client";

import type { Dispatch, SetStateAction } from "react";
import { toast } from "sonner";

import type { Question } from "@/lib/shared/types";

function reorder<T>(items: T[], fromIndex: number, toIndex: number) {
  const updated = [...items];
  const [moved] = updated.splice(fromIndex, 1);
  updated.splice(toIndex, 0, moved);
  return updated;
}

type Params = {
  questions: Question[];
  setQuestions: Dispatch<SetStateAction<Question[]>>;
};

export function useOptionActions({ questions, setQuestions }: Params) {
  function updateOption(
    questionIndex: number,
    optionIndex: number,
    value: string,
  ) {
    setQuestions((prev) =>
      prev.map((question, index) => {
        if (index !== questionIndex) return question;

        return {
          ...question,
          options: question.options.map((option, currentOptionIndex) =>
            currentOptionIndex === optionIndex ? value : option,
          ),
        };
      }),
    );
  }

  function addOption(questionIndex: number) {
    const question = questions[questionIndex];

    if (!question) {
      toast.error("Question not found.");
      return;
    }

    if (question.options.length >= 10) {
      toast.error("You can only add up to 10 options.");
      return;
    }

    setQuestions((prev) =>
      prev.map((item, index) => {
        if (index !== questionIndex) return item;

        return {
          ...item,
          options: [...item.options, ""],
        };
      }),
    );
  }

  function removeOption(questionIndex: number, optionIndex: number) {
    const question = questions[questionIndex];

    if (!question) {
      toast.error("Question not found.");
      return;
    }

    if (question.options.length <= 2) {
      toast.error("Multiple choice questions must have at least 2 options.");
      return;
    }

    setQuestions((prev) =>
      prev.map((item, index) => {
        if (index !== questionIndex) return item;

        const updatedOptions = item.options.filter(
          (_, currentOptionIndex) => currentOptionIndex !== optionIndex,
        );

        let updatedCorrectAnswer = item.correctAnswer;

        if (optionIndex === item.correctAnswer) {
          updatedCorrectAnswer = 0;
        } else if (optionIndex < item.correctAnswer) {
          updatedCorrectAnswer = item.correctAnswer - 1;
        }

        return {
          ...item,
          options: updatedOptions,
          correctAnswer: updatedCorrectAnswer,
        };
      }),
    );
  }

  function moveOptionUp(questionIndex: number, optionIndex: number) {
    if (optionIndex <= 0) {
      toast.error("This option is already at the top.");
      return;
    }

    setQuestions((prev) =>
      prev.map((question, index) => {
        if (index !== questionIndex) return question;

        const updatedOptions = reorder(
          question.options,
          optionIndex,
          optionIndex - 1,
        );

        let updatedCorrectAnswer = question.correctAnswer;

        if (question.correctAnswer === optionIndex) {
          updatedCorrectAnswer = optionIndex - 1;
        } else if (question.correctAnswer === optionIndex - 1) {
          updatedCorrectAnswer = optionIndex;
        }

        return {
          ...question,
          options: updatedOptions,
          correctAnswer: updatedCorrectAnswer,
        };
      }),
    );
  }

  function moveOptionDown(questionIndex: number, optionIndex: number) {
    const question = questions[questionIndex];

    if (!question) {
      toast.error("Question not found.");
      return;
    }

    if (optionIndex >= question.options.length - 1) {
      toast.error("This option is already at the bottom.");
      return;
    }

    setQuestions((prev) =>
      prev.map((item, index) => {
        if (index !== questionIndex) return item;

        const updatedOptions = reorder(
          item.options,
          optionIndex,
          optionIndex + 1,
        );

        let updatedCorrectAnswer = item.correctAnswer;

        if (item.correctAnswer === optionIndex) {
          updatedCorrectAnswer = optionIndex + 1;
        } else if (item.correctAnswer === optionIndex + 1) {
          updatedCorrectAnswer = optionIndex;
        }

        return {
          ...item,
          options: updatedOptions,
          correctAnswer: updatedCorrectAnswer,
        };
      }),
    );
  }

  function duplicateOption(questionIndex: number, optionIndex: number) {
    const question = questions[questionIndex];

    if (!question) {
      toast.error("Question not found.");
      return;
    }

    if (question.options.length >= 10) {
      toast.error("You can only add up to 10 options.");
      return;
    }

    const option = question.options[optionIndex];

    if (option === undefined) {
      toast.error("Option not found.");
      return;
    }

    setQuestions((prev) =>
      prev.map((item, index) => {
        if (index !== questionIndex) return item;

        const updatedOptions = [...item.options];

        updatedOptions.splice(
          optionIndex + 1,
          0,
          option ? `${option} Copy` : "",
        );

        return {
          ...item,
          options: updatedOptions,
        };
      }),
    );

    toast.success("Option duplicated.");
  }

  return {
    updateOption,
    addOption,
    removeOption,
    moveOptionUp,
    moveOptionDown,
    duplicateOption,
  };
}
