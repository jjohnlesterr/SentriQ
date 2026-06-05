"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@supabase/supabase-js";

import { createSupabaseServerClient } from "@/lib/supabase/server";

function createSupabaseAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl) throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL");
  if (!serviceRoleKey) throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY");

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

async function requireAdmin() {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("Unauthorized");
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role, email, is_owner")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError) {
    throw new Error(`Profile check failed: ${profileError.message}`);
  }

  if (!profile) {
    throw new Error(`No profile found for ${user.email}`);
  }

  if (profile.role !== "admin") {
    throw new Error(
      `Admin access required. Current user: ${profile.email}, role: ${profile.role}`,
    );
  }

  return { supabase, user, profile };
}

async function getTargetProfile(userId: string) {
  const supabase = await createSupabaseServerClient();

  const { data: targetProfile, error } = await supabase
    .from("profiles")
    .select("id, email, role, is_owner")
    .eq("id", userId)
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!targetProfile) throw new Error("Target user profile not found.");

  return targetProfile;
}

async function getAdminCount() {
  const supabase = await createSupabaseServerClient();

  const { count, error } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true })
    .eq("role", "admin");

  if (error) throw new Error(error.message);

  return count ?? 0;
}

export async function deleteQuizAction(quizId: string) {
  const { supabase } = await requireAdmin();

  const { error } = await supabase.from("quizzes").delete().eq("id", quizId);

  if (error) throw new Error(error.message);

  revalidatePath("/admin/quizzes");
  revalidatePath("/admin/dashboard");
}

export async function deleteUserAction(userId: string) {
  const { user } = await requireAdmin();
  const targetProfile = await getTargetProfile(userId);

  if (user.id === userId) {
    throw new Error("You cannot delete your own admin account.");
  }

  if (targetProfile.is_owner) {
    throw new Error("The owner account cannot be deleted.");
  }

  if (targetProfile.role === "admin") {
    const adminCount = await getAdminCount();

    if (adminCount <= 1) {
      throw new Error("Cannot delete the last admin account.");
    }
  }

  const supabaseAdmin = createSupabaseAdminClient();

  const { error: authDeleteError } =
    await supabaseAdmin.auth.admin.deleteUser(userId);

  if (authDeleteError) {
    throw new Error(authDeleteError.message);
  }

  revalidatePath("/admin/users");
  revalidatePath("/admin/dashboard");
}

export async function deleteSessionAction(sessionId: string) {
  const { supabase } = await requireAdmin();

  await supabase.from("session_events").delete().eq("session_id", sessionId);

  const { error } = await supabase
    .from("sessions")
    .delete()
    .eq("id", sessionId);

  if (error) throw new Error(error.message);

  revalidatePath("/admin/sessions");
  revalidatePath("/admin/events");
  revalidatePath("/admin/dashboard");
}

export async function updateUserRoleAction(
  userId: string,
  role: "admin" | "teacher",
) {
  const { supabase, user } = await requireAdmin();
  const targetProfile = await getTargetProfile(userId);

  if (targetProfile.is_owner && role !== "admin") {
    throw new Error("The owner account cannot be demoted.");
  }

  if (user.id === userId && role !== "admin") {
    throw new Error("You cannot remove your own admin access.");
  }

  if (targetProfile.role === "admin" && role !== "admin") {
    const adminCount = await getAdminCount();

    if (adminCount <= 1) {
      throw new Error("Cannot remove the last admin.");
    }
  }

  const { error } = await supabase
    .from("profiles")
    .update({ role })
    .eq("id", userId);

  if (error) throw new Error(error.message);

  revalidatePath("/admin/users");
  revalidatePath("/admin/dashboard");
}

export async function deleteEventAction(eventId: string) {
  const { supabase } = await requireAdmin();

  const { error } = await supabase
    .from("session_events")
    .delete()
    .eq("id", eventId);

  if (error) throw new Error(error.message);

  revalidatePath("/admin/events");
  revalidatePath("/admin/dashboard");
}
