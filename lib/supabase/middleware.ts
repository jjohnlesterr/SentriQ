import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);
          });

          // Recreate the response so refreshed auth cookies reach both
          // downstream server code and the browser.
          response = NextResponse.next({
            request,
          });

          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  const isAdminRoute = pathname.startsWith("/admin");

  const isTeacherProtectedRoute =
    pathname.startsWith("/teacher/dashboard") ||
    pathname.startsWith("/teacher/drafts") ||
    pathname.startsWith("/teacher/quiz");

  const isTeacherAuthRoute =
    pathname.startsWith("/teacher/login") ||
    pathname.startsWith("/teacher/register");

  // Redirects must carry any refreshed auth cookies, otherwise the session is lost.
  function redirectTo(url: URL) {
    const redirectResponse = NextResponse.redirect(url);

    response.cookies.getAll().forEach((cookie) => {
      redirectResponse.cookies.set(cookie);
    });

    return redirectResponse;
  }

  if ((isAdminRoute || isTeacherProtectedRoute) && !user) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/teacher/login";
    redirectUrl.search = "";
    redirectUrl.searchParams.set(
      "next",
      `${pathname}${request.nextUrl.search}`,
    );
    return redirectTo(redirectUrl);
  }

  // Teacher pages only need a signed-in user; the role lookup is only
  // needed for admin routes and for redirecting away from login/register.
  if (!user || (!isAdminRoute && !isTeacherAuthRoute)) {
    return response;
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  const role = profile?.role ?? "teacher";

  if (isAdminRoute && role !== "admin") {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/teacher/dashboard";
    redirectUrl.search = "";
    return redirectTo(redirectUrl);
  }

  if (isTeacherAuthRoute) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname =
      role === "admin" ? "/admin/dashboard" : "/teacher/dashboard";
    redirectUrl.search = "";
    return redirectTo(redirectUrl);
  }

  return response;
}
