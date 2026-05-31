import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(request: NextRequest) {
  const response = NextResponse.next({
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
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value);
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

  if ((isTeacherProtectedRoute || isAdminRoute) && !user) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/teacher/login";

    return NextResponse.redirect(redirectUrl);
  }

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    const role = profile?.role ?? "teacher";

    if (isAdminRoute && role !== "admin") {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = "/teacher/dashboard";

      return NextResponse.redirect(redirectUrl);
    }

    if (isTeacherAuthRoute) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname =
        role === "admin" ? "/admin/dashboard" : "/teacher/dashboard";

      return NextResponse.redirect(redirectUrl);
    }
  }

  return response;
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/teacher/dashboard/:path*",
    "/teacher/drafts/:path*",
    "/teacher/quiz/:path*",
    "/teacher/login",
    "/teacher/register",
  ],
};
