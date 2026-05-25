import { INVALID_PATTERNS } from "./constants";

export function sanitizeText(value: string) {
  if (!value) return "";

  let sanitized = value.trim().replace(/\s+/g, " ").replace(/\n+/g, " ");

  INVALID_PATTERNS.forEach((pattern) => {
    sanitized = sanitized.replace(pattern, "");
  });

  return sanitized;
}

export function isMeaningfulText(value: string) {
  if (!value) return false;

  const cleaned = sanitizeText(value);

  if (cleaned.length < 2) return false;

  const meaninglessPatterns = [
    /^(asd|asdf|qwe|qwerty|zxc|test|aaa|111)+$/i,
    /^[0-9]+$/,
    /^[^a-zA-Z0-9]+$/,
  ];

  return !meaninglessPatterns.some((pattern) => pattern.test(cleaned));
}

export function hasDuplicateAnswers(values: string[]) {
  const normalized = values.map((value) => sanitizeText(value).toLowerCase());

  return new Set(normalized).size !== normalized.length;
}
