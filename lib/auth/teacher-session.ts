import { supabaseBrowser } from "@/lib/supabase/browser";

export async function getTeacherSession() {
  const {
    data: { session },
  } = await supabaseBrowser.auth.getSession();

  return session;
}

export async function clearTeacherSession() {
  await supabaseBrowser.auth.signOut();
}