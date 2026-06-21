"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Turnstile } from "@marsidev/react-turnstile";
import { Eye, EyeOff, LockKeyhole, ShieldCheck } from "lucide-react";

import SectionHeading from "@/components/shared/SectionHeading";
import { GlassCard } from "@/components/shared/GlassCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabaseBrowser } from "@/lib/supabase/browser";

export default function TeacherLoginForm({
  onSuccess,
}: {
  onSuccess?: () => void;
}) {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [captchaToken, setCaptchaToken] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      setError("Please enter your email address.");
      return;
    }

    if (!captchaToken) {
      setError("Please complete the security check.");
      return;
    }

    setIsLoading(true);
    setError("");

    const { data, error } = await supabaseBrowser.auth.signInWithPassword({
      email: normalizedEmail,
      password,
      options: {
        captchaToken,
      },
    });

    setIsLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    if (!data.user) {
      setError("Login failed. Please try again.");
      return;
    }

    onSuccess?.();

    router.push("/teacher/dashboard");
    router.refresh();
  }

  return (
    <GlassCard className="p-5 sm:p-6 md:p-8">
      <SectionHeading
        icon={ShieldCheck}
        badge="Teacher Access Portal"
        title="Welcome back"
        description="Sign in to manage quizzes, monitor assessments, and access your dashboard."
        variant="page"
        className="mb-6 md:mb-8"
        badgeClassName="mb-4 border-cyan-400/20 bg-cyan-400/10 px-3 py-1.5 text-xs text-cyan-200 md:mb-4"
        titleClassName="text-3xl md:text-4xl"
        descriptionClassName="mt-2 text-sm leading-6 text-slate-300 md:mt-3"
      />

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* EMAIL */}
        <div className="space-y-2">
          <label className="text-sm text-slate-200">Email Address</label>
          <Input
            type="email"
            placeholder="teacher@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-11"
            autoComplete="username"
            required
          />
        </div>

        {/* PASSWORD */}
        <div className="space-y-2">
          <label className="text-sm text-slate-200">Password</label>

          <div className="relative">
            <LockKeyhole className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />

            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-11 pl-11 pr-12"
              autoComplete="current-password"
              spellCheck={false}
              data-lpignore="true"
              required
            />

            <button
              type="button"
              onClick={() => setShowPassword((p) => !p)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        <div className="w-full">
          <Turnstile
            siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
            onSuccess={(token) => setCaptchaToken(token)}
            onExpire={() => setCaptchaToken("")}
            options={{ size: "flexible" }}
          />
        </div>

        {error && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {error}
          </div>
        )}

        <Button type="submit" className="h-11 w-full" disabled={isLoading}>
          {isLoading ? "Signing in..." : "Sign In"}
        </Button>

        <button
          type="button"
          className="w-full text-center text-sm text-slate-400 hover:text-white"
          onClick={() =>
            window.dispatchEvent(
              new CustomEvent("open-auth-modal", {
                detail: "signup",
              }),
            )
          }
        >
          Don&apos;t have an account? Create one
        </button>
      </form>
    </GlassCard>
  );
}
