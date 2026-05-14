"use server";

import { supabaseBrowser } from "@/lib/supabase/browser";

export async function teacherLogin(
  email: string,
  password: string
) {
  const { data, error } = await supabaseBrowser.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data.user;
}

export async function teacherRegister(
  email: string,
  password: string
) {
  const { data, error } = await supabaseBrowser.auth.signUp({
    email,
    password,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data.user;
}

export async function teacherLogout() {
  await supabaseBrowser.auth.signOut();
}