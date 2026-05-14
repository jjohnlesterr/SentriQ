"use client";

import type { Dispatch, SetStateAction } from "react";

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
    value: string
  ) {
    setQuestions((prev) =>
      prev.map((question, index) => {
        if (index !== questionIndex) return question;

        return {
          ...question,
          options: question.options.map((option, currentOptionIndex) =>
            currentOptionIndex === optionIndex ? value : option
          ),
        };
      })
    );
  }

  function addOption(questionIndex: number) {
    setQuestions((prev) =>
      prev.map((question, index) => {
        if (index !== questionIndex) return question;

        return {
          ...question,
          options: [...question.options, ""],
        };
      })
    );
  }

  function removeOption(questionIndex: number, optionIndex: number) {
    setQuestions((prev) =>
      prev.map((question, index) => {
        if (index !== questionIndex) return question;
        if (question.options.length <= 2) return question;

        const updatedOptions = question.options.filter(
          (_, currentOptionIndex) => currentOptionIndex !== optionIndex
        );

        let updatedCorrectAnswer = question.correctAnswer;

        if (optionIndex === question.correctAnswer) {
          updatedCorrectAnswer = 0;
        } else if (optionIndex < question.correctAnswer) {
          updatedCorrectAnswer = question.correctAnswer - 1;
        }

        return {
          ...question,
          options: updatedOptions,
          correctAnswer: updatedCorrectAnswer,
        };
      })
    );
  }

  function moveOptionUp(questionIndex: number, optionIndex: number) {
    if (optionIndex <= 0) return;

    setQuestions((prev) =>
      prev.map((question, index) => {
        if (index !== questionIndex) return question;

        const updatedOptions = reorder(
          question.options,
          optionIndex,
          optionIndex - 1
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
      })
    );
  }

  function moveOptionDown(questionIndex: number, optionIndex: number) {
    const question = questions[questionIndex];

    if (!question || optionIndex >= question.options.length - 1) return;

    setQuestions((prev) =>
      prev.map((item, index) => {
        if (index !== questionIndex) return item;

        const updatedOptions = reorder(
          item.options,
          optionIndex,
          optionIndex + 1
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
      })
    );
  }

  function duplicateOption(questionIndex: number, optionIndex: number) {
    setQuestions((prev) =>
      prev.map((question, index) => {
        if (index !== questionIndex) return question;
        if (question.options.length >= 10) return question;

        const option = question.options[optionIndex] || "";
        const updatedOptions = [...question.options];

        updatedOptions.splice(
          optionIndex + 1,
          0,
          option ? `${option} Copy` : ""
        );

        return {
          ...question,
          options: updatedOptions,
        };
      })
    );
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