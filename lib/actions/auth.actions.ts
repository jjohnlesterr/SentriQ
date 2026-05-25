"use server";

import { loginSchema, registerSchema } from "@/lib/validations/auth.schema";
import { sanitizeText } from "@/lib/validations/sanitize";

import { supabaseBrowser } from "@/lib/supabase/browser";

function getFirstValidationError(error: unknown) {
  if (
    error &&
    typeof error === "object" &&
    "issues" in error &&
    Array.isArray(error.issues) &&
    error.issues[0]?.message
  ) {
    return error.issues[0].message;
  }

  return "Invalid form input.";
}

export async function teacherLogin(email: string, password: string) {
  const parsed = loginSchema.safeParse({
    email: sanitizeText(email).toLowerCase(),
    password,
  });

  if (!parsed.success) {
    throw new Error(getFirstValidationError(parsed.error));
  }

  const { data, error } = await supabaseBrowser.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data.user;
}

export async function teacherRegister(email: string, password: string) {
  const parsed = registerSchema.safeParse({
    email: sanitizeText(email).toLowerCase(),
    password,
  });

  if (!parsed.success) {
    throw new Error(getFirstValidationError(parsed.error));
  }

  const { data, error } = await supabaseBrowser.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data.user;
}

export async function teacherLogout() {
  await supabaseBrowser.auth.signOut();
}