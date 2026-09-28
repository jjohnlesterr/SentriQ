import { NextResponse, type NextRequest } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";

import { getSafeNextPath } from "@/lib/auth/redirect";
import { createSupabaseServerClient } from "@/lib/supabase/server";

// Landing point for Supabase email links (sign-up confirmation).
// Supports the default PKCE `code` link and the `token_hash` template style.
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const code = searchParams.get("code");
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const next = getSafeNextPath(searchParams.get("next")) ?? "/teacher/dashboard";

  const supabase = await createSupabaseServerClient();

  let succeeded = false;

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    succeeded = !error;
  } else if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type,
    });
    succeeded = !error;
  }

  const redirectUrl = request.nextUrl.clone();
  redirectUrl.search = "";

  if (succeeded) {
    // The proxy sends admins on to /admin when they hit a teacher auth page,
    // and the dashboard itself is reachable by both roles.
    redirectUrl.pathname = next;
  } else {
    redirectUrl.pathname = "/teacher/login";
    redirectUrl.searchParams.set("error", "confirmation");
  }

  return NextResponse.redirect(redirectUrl);
}
