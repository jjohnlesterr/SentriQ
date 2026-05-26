import { z } from "zod";

import { VALIDATION_LIMITS } from "./constants";
import {
  sanitizeText,
  hasDuplicateAnswers,
  isMeaningfulText,
} from "./sanitize";

const optionalDescriptionSchema = z
  .string()
  .transform((value) => sanitizeText(value))
  .refine((value) => value.length === 0 || isMeaningfulText(value), {
    message: "Quiz description is invalid.",
  })
  .refine(
    (value) =>
      value.length === 0 ||
      value.length <= VALIDATION_LIMITS.QUIZ_DESCRIPTION_MAX,
    {
      message: "Quiz description is too long.",
    },
  );

const quizTitleSchema = z
  .string()
  .transform((value) => sanitizeText(value))
  .refine((value) => isMeaningfulText(value), {
    message: "Quiz title is invalid.",
  })
  .refine((value) => value.length >= VALIDATION_LIMITS.QUIZ_TITLE_MIN, {
    message: "Quiz title is too short.",
  })
  .refine((value) => value.length <= VALIDATION_LIMITS.QUIZ_TITLE_MAX, {
    message: "Quiz title is too long.",
  });

const optionSchema = z
  .string()
  .transform((value) => sanitizeText(value))
  .refine((value) => value.length > 0, {
    message: "Option cannot be empty.",
  })
  .refine((value) => value.length <= VALIDATION_LIMITS.OPTION_MAX, {
    message: "Option is too long.",
  });

export const questionSchema = z
  .object({
    id: z.string(),

    type: z.enum(["multiple_choice", "true_false", "identification"]),

    text: z
      .string()
      .transform((value) => sanitizeText(value))
      .refine((value) => isMeaningfulText(value), {
        message: "Question is invalid.",
      })
      .refine((value) => value.length >= VALIDATION_LIMITS.QUESTION_MIN, {
        message: "Question is too short.",
      })
      .refine((value) => value.length <= VALIDATION_LIMITS.QUESTION_MAX, {
        message: "Question is too long.",
      }),

    hint: z
      .string()
      .transform((value) => sanitizeText(value))
      .refine((value) => value.length <= 120, {
        message: "Hint is too long.",
      })
      .optional(),

    options: z.array(optionSchema),

    correctAnswer: z.number(),

    correctTextAnswer: z.string().optional(),
  })
  .superRefine((question, ctx) => {
    if (question.type === "multiple_choice") {
      if (question.options.length < 2) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Multiple choice must have at least 2 options.",
          path: ["options"],
        });
      }

      if (hasDuplicateAnswers(question.options)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Duplicate answers are not allowed.",
          path: ["options"],
        });
      }

      if (
        question.correctAnswer < 0 ||
        question.correctAnswer >= question.options.length
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Correct answer is invalid.",
          path: ["correctAnswer"],
        });
      }
    }

    if (question.type === "true_false") {
      if (question.correctAnswer !== 0 && question.correctAnswer !== 1) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "True/False answer is invalid.",
          path: ["correctAnswer"],
        });
      }
    }

    if (question.type === "identification") {
      const cleanedAnswer = sanitizeText(question.correctTextAnswer || "");

      if (!isMeaningfulText(cleanedAnswer)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Identification answer is invalid.",
          path: ["correctTextAnswer"],
        });
      }

      if (cleanedAnswer.length > VALIDATION_LIMITS.IDENTIFICATION_ANSWER_MAX) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Identification answer is too long.",
          path: ["correctTextAnswer"],
        });
      }
    }
  });

export const createQuizSchema = z.object({
  title: quizTitleSchema,
  description: optionalDescriptionSchema,
  teacherId: z.string().min(1, "Teacher ID is required."),
});

export const updateQuizSchema = z.object({
  quizId: z.string().min(1, "Quiz ID is required."),
  title: quizTitleSchema,
  description: optionalDescriptionSchema,
  questions: z.array(questionSchema),
});

export const publishQuizSchema = z.object({
  quizId: z.string().min(1, "Quiz ID is required."),
});