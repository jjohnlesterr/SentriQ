"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Turnstile } from "@marsidev/react-turnstile";
import { Eye, EyeOff, LockKeyhole, ShieldCheck } from "lucide-react";

import LoginTransitionLoader from "@/components/shared/LoginTransitionLoader";
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
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (isLoading || isRedirecting) return;

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      setError("Please enter your email address.");
      return;
    }

    if (!password) {
      setError("Please enter your password.");
      return;
    }

    if (!captchaToken) {
      setError("Please complete the security check.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const { data, error: signInError } =
        await supabaseBrowser.auth.signInWithPassword({
          email: normalizedEmail,
          password,
          options: {
            captchaToken,
          },
        });

      if (signInError) {
        setError(signInError.message);
        return;
      }

      if (!data.user) {
        setError("Login failed. Please try again.");
        return;
      }

      setIsRedirecting(true);

      router.push("/teacher/dashboard");

      window.setTimeout(() => {
        onSuccess?.();
        setIsRedirecting(false);
      }, 500);
    } catch {
      setError(
        "Unable to sign in right now. Please check your connection and try again.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  const isSubmitting = isLoading || isRedirecting;

  return (
    <>
      {isRedirecting && <LoginTransitionLoader />}

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
            <label htmlFor="teacher-email" className="text-sm text-slate-200">
              Email Address
            </label>

            <Input
              id="teacher-email"
              type="email"
              placeholder="teacher@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-11"
              autoComplete="username"
              disabled={isSubmitting}
              required
            />
          </div>

          {/* PASSWORD */}
          <div className="space-y-2">
            <label
              htmlFor="teacher-password"
              className="text-sm text-slate-200"
            >
              Password
            </label>

            <div className="relative">
              <LockKeyhole className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />

              <Input
                id="teacher-password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-11 pl-11 pr-12"
                autoComplete="current-password"
                spellCheck={false}
                data-lpignore="true"
                disabled={isSubmitting}
                required
              />

              <button
                type="button"
                aria-label={showPassword ? "Hide password" : "Show password"}
                onClick={() => setShowPassword((current) => !current)}
                disabled={isSubmitting}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {/* SECURITY CHECK */}
          <div className="w-full">
            <Turnstile
              siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
              onSuccess={(token) => setCaptchaToken(token)}
              onExpire={() => setCaptchaToken("")}
              onError={() => {
                setCaptchaToken("");
                setError(
                  "Security check failed to load. Please refresh and try again.",
                );
              }}
              options={{ size: "flexible" }}
            />
          </div>

          {/* ERROR MESSAGE */}
          {error && (
            <div
              role="alert"
              className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200"
            >
              {error}
            </div>
          )}

          {/* SUBMIT */}
          <Button type="submit" className="h-11 w-full" disabled={isSubmitting}>
            {isLoading
              ? "Signing in..."
              : isRedirecting
                ? "Opening dashboard..."
                : "Sign In"}
          </Button>

          {/* SIGN UP */}
          <button
            type="button"
            disabled={isSubmitting}
            className="w-full text-center text-sm text-slate-400 transition hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
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
    </>
  );
}
