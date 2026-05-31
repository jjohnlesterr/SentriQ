"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createClient } from "@supabase/supabase-js";

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
    .select("role, email")
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

  return supabase;
}

export async function deleteQuizAction(quizId: string) {
  const supabase = await requireAdmin();

  const { error } = await supabase.from("quizzes").delete().eq("id", quizId);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/quizzes");
  revalidatePath("/admin/dashboard");
}

export async function deleteUserAction(userId: string) {
  const supabase = await requireAdmin();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user?.id === userId) {
    throw new Error("You cannot delete your own admin account.");
  }

  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  );

  const { error: authDeleteError } =
    await supabaseAdmin.auth.admin.deleteUser(userId);

  if (authDeleteError) {
    throw new Error(authDeleteError.message);
  }

  revalidatePath("/admin/users");
  revalidatePath("/admin/dashboard");
}

export async function deleteSessionAction(sessionId: string) {
  const supabase = await requireAdmin();

  await supabase.from("session_events").delete().eq("session_id", sessionId);

  const { error } = await supabase
    .from("sessions")
    .delete()
    .eq("id", sessionId);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/sessions");
  revalidatePath("/admin/events");
  revalidatePath("/admin/dashboard");
}

export async function updateUserRoleAction(
  userId: string,
  role: "admin" | "teacher",
) {
  const supabase = await requireAdmin();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user?.id === userId && role !== "admin") {
    throw new Error("You cannot remove your own admin access.");
  }

  const { error } = await supabase
    .from("profiles")
    .update({ role })
    .eq("id", userId);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/users");
  revalidatePath("/admin/dashboard");
}
