"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import FormMessage from "@/components/shared/FormMessage";
import LoginTransitionLoader from "@/components/shared/LoginTransitionLoader";
import PasswordInput from "@/components/shared/PasswordInput";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getPostLoginPath } from "@/lib/auth/redirect";
import { getCurrentUserRole } from "@/lib/auth/teacher-session";
import { supabaseBrowser } from "@/lib/supabase/browser";

export default function TeacherLoginForm({
  onSuccess,
  nextPath,
  onSwitchToSignup,
}: {
  onSuccess?: () => void;
  nextPath?: string | null;
  /** In the modal, swaps to the sign-up form; on the page, a link is used instead. */
  onSwitchToSignup?: () => void;
}) {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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

    setIsLoading(true);
    setError("");

    try {
      const { data, error: signInError } =
        await supabaseBrowser.auth.signInWithPassword({
          email: normalizedEmail,
          password,
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

      const role = await getCurrentUserRole(data.user.id);

      router.replace(getPostLoginPath(role, nextPath));
      router.refresh();

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

      <div>
        <h1 className="text-xl font-semibold tracking-tight text-white">
          Log in to SentriQ
        </h1>
        <p className="mt-1.5 text-sm text-slate-400">
          Manage your quizzes and monitor live sessions.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="teacher-email">Email</Label>
            <Input
              id="teacher-email"
              type="email"
              placeholder="you@school.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="username"
              disabled={isSubmitting}
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="teacher-password">Password</Label>
            <PasswordInput
              id="teacher-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              data-lpignore="true"
              disabled={isSubmitting}
              required
            />
          </div>

          {error && <FormMessage>{error}</FormMessage>}

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isLoading
              ? "Logging in…"
              : isRedirecting
                ? "Opening dashboard…"
                : "Log in"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-400">
          New to SentriQ?{" "}
          {onSwitchToSignup ? (
            <button
              type="button"
              disabled={isSubmitting}
              onClick={onSwitchToSignup}
              className="font-medium text-cyan-300 hover:text-cyan-200 disabled:opacity-50"
            >
              Create an account
            </button>
          ) : (
            <Link href="/teacher/register" className="font-medium text-cyan-300 hover:text-cyan-200">
              Create an account
            </Link>
          )}
        </p>
      </div>
    </>
  );
}
