import { middleware } from "@/lib/supabase/middleware";

export { middleware };

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