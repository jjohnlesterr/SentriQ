export type AppRole = "admin" | "teacher";

export function getHomePathForRole(role: string | null | undefined) {
  return role === "admin" ? "/admin/dashboard" : "/teacher/dashboard";
}

// Only allow same-origin relative paths, so `next` cannot be used as an open redirect.
export function getSafeNextPath(next: string | null | undefined) {
  if (!next || !next.startsWith("/") || next.startsWith("//")) return null;
  if (next.startsWith("/teacher/login") || next.startsWith("/teacher/register"))
    return null;

  return next;
}

export function getPostLoginPath(
  role: string | null | undefined,
  next: string | null | undefined,
) {
  const safeNext = getSafeNextPath(next);

  // Non-admins would just be bounced back out of /admin by the proxy.
  if (safeNext && (role === "admin" || !safeNext.startsWith("/admin"))) {
    return safeNext;
  }

  return getHomePathForRole(role);
}
