"use client";

import { useState } from "react";

type AnswerMap = Record<number, number | string>;

export function useQuizAnswers() {
  const [answers, setAnswers] = useState<AnswerMap>({});

  return {
    answers,
    setAnswers,
  };
}