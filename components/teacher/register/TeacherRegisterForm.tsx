"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Turnstile } from "@marsidev/react-turnstile";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  LockKeyhole,
  ShieldCheck,
  UserPlus,
} from "lucide-react";

import SectionHeading from "@/components/shared/SectionHeading";
import { GlassCard } from "@/components/shared/GlassCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabaseBrowser } from "@/lib/supabase/browser";

export default function TeacherRegisterForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [captchaToken, setCaptchaToken] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const normalizedEmail = email.trim().toLowerCase();

    setError("");
    setSuccess("");

    if (!normalizedEmail) {
      setError("Please enter your email address.");
      return;
    }

    if (!captchaToken) {
      setError("Please complete the security check.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);

    const { data, error } = await supabaseBrowser.auth.signUp({
      email: normalizedEmail,
      password,
      options: {
        captchaToken,
        emailRedirectTo: `${window.location.origin}/teacher/login`,
      },
    });

    setIsLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    const isDuplicateSignup =
      data.user && data.user.identities && data.user.identities.length === 0;

    if (isDuplicateSignup) {
      setError(
        "An account with this email already exists. Please sign in instead.",
      );
      return;
    }

    if (!data.user) {
      setError("Account could not be created. Please try again.");
      return;
    }

    setSuccess(
      "Account created. Please check your email to confirm your account.",
    );
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setCaptchaToken("");
  }

  return (
    <section className="flex min-h-screen items-center justify-center px-4 py-5 sm:px-6 md:py-12">
      <div className="w-full max-w-md">
        <Button
          variant="ghost"
          className="mb-4 h-10 border border-white/10 bg-white/5 px-4 text-sm md:mb-6"
          onClick={() => router.push("/")}
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>

        <GlassCard className="p-5 sm:p-6 md:p-8">
          <SectionHeading
            icon={UserPlus}
            badge="Teacher Registration"
            title="Create Account"
            description="Register as a teacher to create quizzes and monitor student activity."
            variant="page"
            className="mb-6 md:mb-8"
            badgeClassName="mb-4 border-cyan-400/20 bg-cyan-400/10 px-3 py-1.5 text-xs text-cyan-200 md:mb-4"
            iconClassName="h-3.5 w-3.5"
            titleClassName="text-3xl md:text-4xl"
            descriptionClassName="mt-2 text-sm leading-6 text-slate-300 md:mt-3"
          />

          <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
            <div className="space-y-2">
              <label className="text-sm text-slate-200">Email Address</label>

              <Input
                type="email"
                placeholder="teacher@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-11"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-slate-200">Password</label>

              <div className="relative">
                <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />

                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11 pl-11 pr-12"
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
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

            <div className="space-y-2">
              <label className="text-sm text-slate-200">Confirm Password</label>

              <div className="relative">
                <ShieldCheck className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />

                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="h-11 pl-11 pr-12"
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <Turnstile
              siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
              onSuccess={(token) => setCaptchaToken(token)}
              onExpire={() => setCaptchaToken("")}
            />

            {error && (
              <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                {error}
              </div>
            )}

            {success && (
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
                {success}
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              className="h-11 w-full"
              disabled={isLoading}
            >
              {isLoading ? "Creating account..." : "Create Account"}
            </Button>

            <button
              type="button"
              onClick={() => router.push("/teacher/login")}
              className="w-full text-center text-sm text-slate-400 hover:text-white"
            >
              Already have an account? Sign in
            </button>
          </form>
        </GlassCard>
      </div>
    </section>
  );
}
