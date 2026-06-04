import type { NextRequest } from "next/server";

import { middleware } from "@/lib/supabase/middleware";

export function proxy(request: NextRequest) {
  return middleware(request);
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
