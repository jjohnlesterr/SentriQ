"use server";

import { revalidatePath } from "next/cache";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

type AdminSessionsPageInput = {
  page: number;
  pageSize: number;
  search?: string;
  status?: string;
};

type AdminEventsPageInput = {
  page: number;
  pageSize: number;
  search?: string;
  eventType?: string;
};

type AdminQuizzesPageInput = {
  page: number;
  pageSize: number;
  search?: string;
  status?: string;
};

type AdminUsersPageInput = {
  page: number;
  pageSize: number;
  search?: string;
  role?: string;
  status?: string;
};

type AuthUserSummary = {
  id: string;
  created_at?: string | null;
  last_sign_in_at?: string | null;
};

function isSuspiciousEventType(type: string | null) {
  if (!type) return false;

  return (
    type.includes("copy") ||
    type.includes("paste") ||
    type.includes("fullscreen") ||
    type.includes("tab") ||
    type.includes("abandoned") ||
    type.includes("time-expired")
  );
}

function isActiveThisWeek(lastSignInAt: string | null | undefined) {
  if (!lastSignInAt) return false;

  const diffMs = Date.now() - new Date(lastSignInAt).getTime();
  const diffDays = diffMs / 86400000;

  return diffDays <= 7;
}

function getUserStatus(lastSignInAt: string | null | undefined) {
  if (!lastSignInAt) return "never-used";

  const diffDays = (Date.now() - new Date(lastSignInAt).getTime()) / 86400000;

  if (diffDays <= 7) return "active";
  if (diffDays <= 30) return "idle";
  return "dormant";
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

async function getAllAuthUsers() {
  const supabaseAdmin = createSupabaseAdminClient();

  const users: AuthUserSummary[] = [];
  let page = 1;
  const perPage = 1000;

  while (true) {
    const {
      data: { users: pageUsers },
      error,
    } = await supabaseAdmin.auth.admin.listUsers({
      page,
      perPage,
    });

    if (error) throw new Error(error.message);

    users.push(
      ...pageUsers.map((user) => ({
        id: user.id,
        created_at: user.created_at,
        last_sign_in_at: user.last_sign_in_at,
      })),
    );

    if (pageUsers.length < perPage) break;

    page += 1;
  }

  return users;
}

async function getSessionStatusCount(status: string) {
  const supabaseAdmin = createSupabaseAdminClient();

  const { count, error } = await supabaseAdmin
    .from("sessions")
    .select("*", { count: "exact", head: true })
    .eq("status", status);

  if (error) throw new Error(error.message);

  return count ?? 0;
}

export async function getUserStatsAction() {
  await requireAdmin();

  const supabaseAdmin = createSupabaseAdminClient();

  const [
    { count: totalUsers, error: totalError },
    { count: adminCount, error: adminError },
    { count: teacherCount, error: teacherError },
    { count: ownerCount, error: ownerError },
    authUsers,
  ] = await Promise.all([
    supabaseAdmin
      .from("profiles")
      .select("*", { count: "exact", head: true }),

    supabaseAdmin
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .eq("role", "admin"),

    supabaseAdmin
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .eq("role", "teacher"),

    supabaseAdmin
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .eq("is_owner", true),

    getAllAuthUsers(),
  ]);

  if (totalError) throw new Error(totalError.message);
  if (adminError) throw new Error(adminError.message);
  if (teacherError) throw new Error(teacherError.message);
  if (ownerError) throw new Error(ownerError.message);

  return {
    totalUsers: totalUsers ?? 0,
    adminCount: adminCount ?? 0,
    teacherCount: teacherCount ?? 0,
    ownerCount: ownerCount ?? 0,
    activeUsersCount: authUsers.filter((user) =>
      isActiveThisWeek(user.last_sign_in_at),
    ).length,
  };
}

export async function getAdminUsersPageAction({
  page,
  pageSize,
  search = "",
  role = "all",
  status = "all",
}: AdminUsersPageInput) {
  await requireAdmin();

  const supabaseAdmin = createSupabaseAdminClient();
  const safePage = Math.max(0, page);
  const safePageSize = Math.min(Math.max(1, pageSize), 100);
  const from = safePage * safePageSize;
  const to = from + safePageSize - 1;
  const query = search.trim().replaceAll(",", " ");

  const authUsers = await getAllAuthUsers();
  const authUsersById = new Map(authUsers.map((user) => [user.id, user]));

  let profilesQuery = supabaseAdmin
    .from("profiles")
    .select("id, email, role, created_at, is_owner")
    .order("created_at", { ascending: false });

  if (role === "owner") {
    profilesQuery = profilesQuery.eq("is_owner", true);
  } else if (role !== "all") {
    profilesQuery = profilesQuery.eq("role", role);
  }

  if (query) {
    profilesQuery = profilesQuery.or(
      [`email.ilike.%${query}%`, `role.ilike.%${query}%`].join(","),
    );
  }

  const shouldFilterByStatus = status !== "all";

  if (!shouldFilterByStatus) {
    profilesQuery = profilesQuery.range(from, to);
  }

  const { data: profiles, error: profilesError } = await profilesQuery;

  if (profilesError) throw new Error(profilesError.message);

  const enrichedUsers = (profiles ?? []).map((profile) => {
    const authUser = authUsersById.get(profile.id);

    return {
      id: profile.id,
      email: profile.email,
      role: profile.role,
      is_owner: profile.is_owner ?? false,
      created_at: authUser?.created_at ?? profile.created_at,
      last_sign_in_at: authUser?.last_sign_in_at ?? null,
    };
  });

  const filteredUsers = shouldFilterByStatus
    ? enrichedUsers.filter(
        (user) => getUserStatus(user.last_sign_in_at) === status,
      )
    : enrichedUsers;

  const paginatedUsers = shouldFilterByStatus
    ? filteredUsers.slice(from, to + 1)
    : filteredUsers;

  return {
    users: paginatedUsers,
    hasMore: shouldFilterByStatus
      ? filteredUsers.length > to + 1
      : enrichedUsers.length === safePageSize,
  };
}

export async function getQuizStatsAction() {
  await requireAdmin();

  const supabaseAdmin = createSupabaseAdminClient();

  const [
    { count: totalQuizzes, error: quizzesError },
    { count: totalQuestions, error: questionsError },
    { count: publishedCount, error: publishedError },
    { count: draftCount, error: draftError },
  ] = await Promise.all([
    supabaseAdmin.from("quizzes").select("*", { count: "exact", head: true }),

    supabaseAdmin.from("questions").select("*", { count: "exact", head: true }),

    supabaseAdmin
      .from("quizzes")
      .select("*", { count: "exact", head: true })
      .eq("published", true),

    supabaseAdmin
      .from("quizzes")
      .select("*", { count: "exact", head: true })
      .eq("published", false),
  ]);

  if (quizzesError) throw new Error(quizzesError.message);
  if (questionsError) throw new Error(questionsError.message);
  if (publishedError) throw new Error(publishedError.message);
  if (draftError) throw new Error(draftError.message);

  return {
    totalQuizzes: totalQuizzes ?? 0,
    totalQuestions: totalQuestions ?? 0,
    publishedCount: publishedCount ?? 0,
    draftCount: draftCount ?? 0,
  };
}

export async function getAdminQuizzesPageAction({
  page,
  pageSize,
  search = "",
  status = "all",
}: AdminQuizzesPageInput) {
  await requireAdmin();

  const supabaseAdmin = createSupabaseAdminClient();
  const safePage = Math.max(0, page);
  const safePageSize = Math.min(Math.max(1, pageSize), 100);
  const from = safePage * safePageSize;
  const to = from + safePageSize - 1;
  const query = search.trim().replaceAll(",", " ");

  let quizzesQuery = supabaseAdmin
    .from("quizzes")
    .select(
      `
      id,
      title,
      description,
      code,
      created_at,
      created_by,
      published,
      status,
      time_limit_minutes,
      join_locked
    `,
    )
    .order("created_at", { ascending: false })
    .range(from, to);

  if (status === "published") {
    quizzesQuery = quizzesQuery.eq("published", true);
  }

  if (status === "draft") {
    quizzesQuery = quizzesQuery.eq("published", false);
  }

  if (query) {
    quizzesQuery = quizzesQuery.or(
      [
        `title.ilike.%${query}%`,
        `description.ilike.%${query}%`,
        `code.ilike.%${query}%`,
        `status.ilike.%${query}%`,
      ].join(","),
    );
  }

  const { data: quizzes, error: quizzesError } = await quizzesQuery;

  if (quizzesError) {
    throw new Error(quizzesError.message);
  }

  const quizRows = quizzes ?? [];
  const quizIds = quizRows.map((quiz) => quiz.id);

  const uuidPattern =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

  const creatorIds = Array.from(
    new Set(
      quizRows
        .map((quiz) => quiz.created_by)
        .filter((value): value is string =>
          Boolean(value && uuidPattern.test(value)),
        ),
    ),
  );

  const [
    { data: profiles, error: profilesError },
    { data: questions, error: questionsError },
    { data: sessions, error: sessionsError },
  ] = await Promise.all([
    creatorIds.length
      ? supabaseAdmin.from("profiles").select("id, email").in("id", creatorIds)
      : Promise.resolve({ data: [], error: null }),

    quizIds.length
      ? supabaseAdmin
          .from("questions")
          .select("id, quiz_id")
          .in("quiz_id", quizIds)
      : Promise.resolve({ data: [], error: null }),

    quizIds.length
      ? supabaseAdmin
          .from("sessions")
          .select("id, quiz_id")
          .in("quiz_id", quizIds)
      : Promise.resolve({ data: [], error: null }),
  ]);

  if (profilesError) throw new Error(profilesError.message);
  if (questionsError) throw new Error(questionsError.message);
  if (sessionsError) throw new Error(sessionsError.message);

  const profileMap = new Map(
    (profiles ?? []).map((profile) => [profile.id, profile]),
  );

  const questionCountMap = new Map<string, number>();
  const sessionCountMap = new Map<string, number>();

  for (const question of questions ?? []) {
    if (!question.quiz_id) continue;

    questionCountMap.set(
      question.quiz_id,
      (questionCountMap.get(question.quiz_id) ?? 0) + 1,
    );
  }

  for (const session of sessions ?? []) {
    if (!session.quiz_id) continue;

    sessionCountMap.set(
      session.quiz_id,
      (sessionCountMap.get(session.quiz_id) ?? 0) + 1,
    );
  }

  const enrichedQuizzes = quizRows.map((quiz) => ({
    ...quiz,
    creator_email:
      (quiz.created_by ? profileMap.get(quiz.created_by)?.email : null) ??
      quiz.created_by ??
      null,
    question_count: questionCountMap.get(quiz.id) ?? 0,
    session_count: sessionCountMap.get(quiz.id) ?? 0,
    status:
      quiz.published === true || quiz.status === "published"
        ? "published"
        : "draft",
    questions: [],
  }));

  return {
    quizzes: enrichedQuizzes,
    hasMore: quizRows.length === safePageSize,
  };
}

export async function getSessionStatsAction() {
  await requireAdmin();

  const supabaseAdmin = createSupabaseAdminClient();

  const { count: totalSessions, error: totalError } = await supabaseAdmin
    .from("sessions")
    .select("*", { count: "exact", head: true });

  if (totalError) throw new Error(totalError.message);

  const [completedCount, timedOutCount, abandonedCount] = await Promise.all([
    getSessionStatusCount("completed"),
    getSessionStatusCount("timed-out"),
    getSessionStatusCount("abandoned"),
  ]);

  return {
    totalSessions: totalSessions ?? 0,
    completedCount,
    timedOutCount,
    abandonedCount,
  };
}

export async function getAdminSessionsPageAction({
  page,
  pageSize,
  search = "",
  status = "all",
}: AdminSessionsPageInput) {
  await requireAdmin();

  const supabaseAdmin = createSupabaseAdminClient();
  const safePage = Math.max(0, page);
  const safePageSize = Math.min(Math.max(1, pageSize), 100);
  const from = safePage * safePageSize;
  const to = from + safePageSize - 1;
  const query = search.trim().replaceAll(",", " ");

  let sessionsQuery = supabaseAdmin
    .from("sessions")
    .select(
      `
      id,
      quiz_id,
      student_name,
      student_id,
      started_at,
      completed_at,
      timed_out_at,
      last_seen_at,
      current_question,
      tab_switches,
      status,
      approval_status,
      report_visibility,
      score
    `,
    )
    .order("started_at", { ascending: false })
    .range(from, to);

  if (status !== "all") {
    sessionsQuery = sessionsQuery.eq("status", status);
  }

  if (query) {
    sessionsQuery = sessionsQuery.or(
      [
        `student_name.ilike.%${query}%`,
        `student_id.ilike.%${query}%`,
        `status.ilike.%${query}%`,
        `approval_status.ilike.%${query}%`,
      ].join(","),
    );
  }

  const { data: sessions, error: sessionsError } = await sessionsQuery;

  if (sessionsError) throw new Error(sessionsError.message);

  const sessionRows = sessions ?? [];
  const sessionIds = sessionRows.map((session) => session.id);
  const quizIds = Array.from(
    new Set(sessionRows.map((session) => session.quiz_id).filter(Boolean)),
  ) as string[];

  const [
    { data: quizzes, error: quizzesError },
    { data: events, error: eventsError },
  ] = await Promise.all([
    quizIds.length
      ? supabaseAdmin
          .from("quizzes")
          .select("id, title, code")
          .in("id", quizIds)
      : Promise.resolve({ data: [], error: null }),

    sessionIds.length
      ? supabaseAdmin
          .from("session_events")
          .select("id, session_id, type")
          .in("session_id", sessionIds)
      : Promise.resolve({ data: [], error: null }),
  ]);

  if (quizzesError) throw new Error(quizzesError.message);
  if (eventsError) throw new Error(eventsError.message);

  const quizzesById = new Map((quizzes ?? []).map((quiz) => [quiz.id, quiz]));

  const eventCountBySessionId = new Map<string, number>();
  const suspiciousCountBySessionId = new Map<string, number>();

  for (const event of events ?? []) {
    if (!event.session_id) continue;

    eventCountBySessionId.set(
      event.session_id,
      (eventCountBySessionId.get(event.session_id) ?? 0) + 1,
    );

    if (isSuspiciousEventType(event.type)) {
      suspiciousCountBySessionId.set(
        event.session_id,
        (suspiciousCountBySessionId.get(event.session_id) ?? 0) + 1,
      );
    }
  }

  const enrichedSessions = sessionRows.map((session) => {
    const quiz = session.quiz_id ? quizzesById.get(session.quiz_id) : null;

    return {
      ...session,
      quiz_title: quiz?.title ?? null,
      quiz_code: quiz?.code ?? null,
      answers: null,
      event_count: eventCountBySessionId.get(session.id) ?? 0,
      suspicious_event_count: suspiciousCountBySessionId.get(session.id) ?? 0,
      events: [],
      questions: [],
    };
  });

  return {
    sessions: enrichedSessions,
    hasMore: sessionRows.length === safePageSize,
  };
}

export async function getSessionDetailsAction(sessionId: string) {
  await requireAdmin();

  const supabaseAdmin = createSupabaseAdminClient();

  const { data: session, error: sessionError } = await supabaseAdmin
    .from("sessions")
    .select("id, quiz_id, answers")
    .eq("id", sessionId)
    .maybeSingle();

  if (sessionError) throw new Error(sessionError.message);
  if (!session) throw new Error("Session not found.");

  const [
    { data: events, error: eventsError },
    { data: questions, error: questionsError },
  ] = await Promise.all([
    supabaseAdmin
      .from("session_events")
      .select("id, session_id, type, timestamp, description, duration_seconds")
      .eq("session_id", sessionId)
      .order("timestamp", { ascending: true }),

    supabaseAdmin
      .from("questions")
      .select("id, quiz_id, text, position")
      .eq("quiz_id", session.quiz_id)
      .order("position", { ascending: true }),
  ]);

  if (eventsError) throw new Error(eventsError.message);
  if (questionsError) throw new Error(questionsError.message);

  const fullEvents = events ?? [];

  return {
    answers: session.answers ?? {},
    events: fullEvents,
    questions: questions ?? [],
    suspiciousEventCount: fullEvents.filter((event) =>
      isSuspiciousEventType(event.type),
    ).length,
  };
}

export async function getEventStatsAction() {
  await requireAdmin();

  const supabaseAdmin = createSupabaseAdminClient();

  const { count: totalEvents, error: totalError } = await supabaseAdmin
    .from("session_events")
    .select("*", { count: "exact", head: true });

  if (totalError) throw new Error(totalError.message);

  const { count: riskyEvents, error: riskyError } = await supabaseAdmin
    .from("session_events")
    .select("*", { count: "exact", head: true })
    .or(
      [
        "type.ilike.%copy%",
        "type.ilike.%paste%",
        "type.ilike.%fullscreen%",
        "type.ilike.%tab%",
        "type.ilike.%abandoned%",
        "type.ilike.%time-expired%",
      ].join(","),
    );

  if (riskyError) throw new Error(riskyError.message);

  const { count: copyAttempts, error: copyError } = await supabaseAdmin
    .from("session_events")
    .select("*", { count: "exact", head: true })
    .ilike("type", "%copy%");

  if (copyError) throw new Error(copyError.message);

  const { count: fullscreenExits, error: fullscreenError } = await supabaseAdmin
    .from("session_events")
    .select("*", { count: "exact", head: true })
    .ilike("type", "%fullscreen%");

  if (fullscreenError) throw new Error(fullscreenError.message);

  return {
    totalEvents: totalEvents ?? 0,
    riskyEvents: riskyEvents ?? 0,
    copyAttempts: copyAttempts ?? 0,
    fullscreenExits: fullscreenExits ?? 0,
  };
}

export async function getAdminEventsPageAction({
  page,
  pageSize,
  search = "",
  eventType = "all",
}: AdminEventsPageInput) {
  await requireAdmin();

  const supabaseAdmin = createSupabaseAdminClient();
  const safePage = Math.max(0, page);
  const safePageSize = Math.min(Math.max(1, pageSize), 100);
  const from = safePage * safePageSize;
  const to = from + safePageSize - 1;
  const query = search.trim().replaceAll(",", " ");

  let eventsQuery = supabaseAdmin
    .from("session_events")
    .select("id, session_id, type, timestamp, description, duration_seconds")
    .order("timestamp", { ascending: false })
    .range(from, to);

  if (eventType !== "all") {
    eventsQuery = eventsQuery.eq("type", eventType);
  }

  if (query) {
    eventsQuery = eventsQuery.or(
      [
        `type.ilike.%${query}%`,
        `session_id.ilike.%${query}%`,
        `description.ilike.%${query}%`,
      ].join(","),
    );
  }

  const { data: events, error: eventsError } = await eventsQuery;

  if (eventsError) throw new Error(eventsError.message);

  const eventRows = events ?? [];
  const sessionIds = Array.from(
    new Set(eventRows.map((event) => event.session_id).filter(Boolean)),
  ) as string[];

  const { data: sessions, error: sessionsError } = sessionIds.length
    ? await supabaseAdmin
        .from("sessions")
        .select("id, quiz_id, student_name, student_id, status, score")
        .in("id", sessionIds)
    : { data: [], error: null };

  if (sessionsError) throw new Error(sessionsError.message);

  const quizIds = Array.from(
    new Set((sessions ?? []).map((session) => session.quiz_id).filter(Boolean)),
  ) as string[];

  const { data: quizzes, error: quizzesError } = quizIds.length
    ? await supabaseAdmin
        .from("quizzes")
        .select("id, title, code")
        .in("id", quizIds)
    : { data: [], error: null };

  if (quizzesError) throw new Error(quizzesError.message);

  const sessionsById = new Map(
    (sessions ?? []).map((session) => [session.id, session]),
  );

  const quizzesById = new Map((quizzes ?? []).map((quiz) => [quiz.id, quiz]));

  const enrichedEvents = eventRows.map((event) => {
    const session = event.session_id
      ? sessionsById.get(event.session_id)
      : null;
    const quiz = session?.quiz_id ? quizzesById.get(session.quiz_id) : null;

    return {
      ...event,
      student_name: session?.student_name ?? null,
      student_id: session?.student_id ?? null,
      session_status: session?.status ?? null,
      session_score: session?.score ?? null,
      quiz_title: quiz?.title ?? null,
      quiz_code: quiz?.code ?? null,
    };
  });

  return {
    events: enrichedEvents,
    hasMore: eventRows.length === safePageSize,
  };
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