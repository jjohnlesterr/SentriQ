import { z } from "zod";
import { sanitizeText, isMeaningfulText } from "./sanitize";

export const sanitizedString = z
  .string()
  .transform((value) => sanitizeText(value));

export const meaningfulString = z
  .string()
  .transform((value) => sanitizeText(value))
  .refine((value) => isMeaningfulText(value), {
    message: "Input contains invalid or meaningless text.",
  });