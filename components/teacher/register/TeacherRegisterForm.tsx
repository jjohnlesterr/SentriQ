"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import FormMessage from "@/components/shared/FormMessage";
import PasswordInput from "@/components/shared/PasswordInput";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getHomePathForRole } from "@/lib/auth/redirect";
import { supabaseBrowser } from "@/lib/supabase/browser";

export default function TeacherRegisterForm({
  onSuccess,
  onSwitchToLogin,
}: {
  onSuccess?: () => void;
  /** In the modal, swaps to the login form; on the page, a link is used instead. */
  onSwitchToLogin?: () => void;
}) {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (isLoading) return;

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) return setError("Enter your email address.");
    if (password.length < 6) return setError("Password must be at least 6 characters.");
    if (password !== confirmPassword)
      return setError("Passwords do not match.");

    setIsLoading(true);
    setError("");
    setNotice("");

    try {
      const { data, error } = await supabaseBrowser.auth.signUp({
        email: normalizedEmail,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) return setError(error.message);
      if (!data.user) return setError("Sign up failed. Please try again.");

      // Supabase hides existing accounts by returning a user with no identities.
      if (data.user.identities?.length === 0) {
        return setError(
          "An account with this email already exists. Please sign in instead.",
        );
      }

      // Email confirmation disabled: the user is signed in immediately.
      if (data.session) {
        router.replace(getHomePathForRole("teacher"));
        router.refresh();
        onSuccess?.();
        return;
      }

      setPassword("");
      setConfirmPassword("");
      setNotice(
        `Account created. Check ${normalizedEmail} for a confirmation link, then sign in.`,
      );
    } catch {
      setError(
        "Unable to create an account right now. Please check your connection and try again.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div>
      <h1 className="text-xl font-semibold tracking-tight text-white">
        Create a teacher account
      </h1>
      <p className="mt-1.5 text-sm text-slate-400">
        Build quizzes and monitor your students&apos; sessions.
      </p>

      <form className="mt-6 space-y-4" autoComplete="off" onSubmit={handleSubmit}>
        <div className="space-y-1.5">
          <Label htmlFor="register-email">Email</Label>
          <Input
            id="register-email"
            type="email"
            placeholder="you@school.edu"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="username"
            disabled={isLoading}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="register-password">Password</Label>
          <PasswordInput
            id="register-password"
            placeholder="At least 6 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
            name="new-password"
            data-form-type="other"
            disabled={isLoading}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="register-confirm-password">Confirm password</Label>
          <PasswordInput
            id="register-confirm-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            autoComplete="new-password"
            name="confirm-password"
            data-form-type="other"
            disabled={isLoading}
          />
        </div>

        {error && <FormMessage>{error}</FormMessage>}
        {notice && <FormMessage tone="success">{notice}</FormMessage>}

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Creating account…" : "Create account"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-400">
        Already have an account?{" "}
        {onSwitchToLogin ? (
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="font-medium text-cyan-300 hover:text-cyan-200"
          >
            Log in
          </button>
        ) : (
          <Link href="/teacher/login" className="font-medium text-cyan-300 hover:text-cyan-200">
            Log in
          </Link>
        )}
      </p>
    </div>
  );
}
