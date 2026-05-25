import { z } from "zod";

import { VALIDATION_LIMITS } from "./constants";
import {
  sanitizeText,
  isMeaningfulText,
} from "./sanitize";

export const loginSchema = z.object({
  email: z
    .string()
    .email("Invalid email.")
    .max(VALIDATION_LIMITS.EMAIL_MAX)
    .transform((value) =>
      sanitizeText(value.toLowerCase())
    ),

  password: z
    .string()
    .min(VALIDATION_LIMITS.PASSWORD_MIN)
    .max(VALIDATION_LIMITS.PASSWORD_MAX),
});

export const registerSchema = z.object({
  name: z
    .string()
    .transform((value) => sanitizeText(value))
    .refine((value) => isMeaningfulText(value), {
      message: "Invalid name.",
    })
    .refine(
      (value) =>
        value.length >=
        VALIDATION_LIMITS.STUDENT_NAME_MIN,
      {
        message: "Name is too short.",
      }
    )
    .refine(
      (value) =>
        value.length <=
        VALIDATION_LIMITS.STUDENT_NAME_MAX,
      {
        message: "Name is too long.",
      }
    ),

  email: z
    .string()
    .email("Invalid email.")
    .max(VALIDATION_LIMITS.EMAIL_MAX)
    .transform((value) =>
      sanitizeText(value.toLowerCase())
    ),

  password: z
    .string()
    .min(VALIDATION_LIMITS.PASSWORD_MIN)
    .max(VALIDATION_LIMITS.PASSWORD_MAX),
});