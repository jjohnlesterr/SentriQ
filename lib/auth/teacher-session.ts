import { supabaseBrowser } from "@/lib/supabase/browser";

export async function getTeacherSession() {
  const {
    data: { session },
  } = await supabaseBrowser.auth.getSession();

  return session;
}

export async function getCurrentUserRole(userId: string) {
  const { data: profile } = await supabaseBrowser
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .maybeSingle();

  // Matches the proxy: accounts without a profile row are treated as teachers.
  return profile?.role ?? "teacher";
}

export async function clearTeacherSession() {
  const { error } = await supabaseBrowser.auth.signOut();

  // If revoking the session server-side fails (e.g. offline), still clear it locally.
  if (error) {
    await supabaseBrowser.auth.signOut({ scope: "local" });
  }
}
