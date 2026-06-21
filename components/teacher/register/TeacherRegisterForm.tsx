"use client";

import { useState } from "react";
import { Turnstile } from "@marsidev/react-turnstile";
import {
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

export default function TeacherRegisterForm({
  onSuccess,
}: {
  onSuccess?: () => void;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [captchaToken, setCaptchaToken] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) return setError("Enter email");
    if (!captchaToken) return setError("Complete security check");
    if (password.length < 6) return setError("Min 6 characters");
    if (password !== confirmPassword)
      return setError("Passwords do not match");

    setIsLoading(true);
    setError("");

    const { data, error } = await supabaseBrowser.auth.signUp({
      email: normalizedEmail,
      password,
      options: { captchaToken },
    });

    setIsLoading(false);

    if (error) return setError(error.message);
    if (!data.user) return setError("Signup failed");

    onSuccess?.();
  }

  const inputClass =
    "h-11 w-full rounded-xl border border-white/10 bg-white/5 text-white placeholder:text-slate-400 focus:border-cyan-400/40 focus:ring-0 focus:outline-none";

  return (
    <GlassCard className="p-5 sm:p-6 md:p-8">
      <SectionHeading
        icon={UserPlus}
        badge="Teacher Registration"
        title="Create Account"
        description="Register to create quizzes and manage students."
        variant="page"
        className="mb-6 md:mb-8"
        badgeClassName="mb-4 border-cyan-400/20 bg-cyan-400/10 px-3 py-1.5 text-xs text-cyan-200"
        titleClassName="text-3xl md:text-4xl"
        descriptionClassName="mt-2 text-sm text-slate-300"
      />

      <form className="space-y-5" autoComplete="off">

        <Input
          type="email"
          placeholder="teacher@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={inputClass}
          autoComplete="username"
        />

        <div className="relative z-10">
          <LockKeyhole className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />

          <Input
            type={showPassword ? "text" : "password"}
            placeholder="Create password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`${inputClass} pl-11 pr-12`}
            autoComplete="new-password"
            name="new-password"
            data-form-type="other"
            spellCheck={false}
          />

          <button
            type="button"
            onClick={() => setShowPassword((p) => !p)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white z-20"
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>

        <div className="relative z-10">
          <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />

          <Input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={`${inputClass} pl-11 pr-12`}
            autoComplete="new-password"
            name="confirm-password"
            data-form-type="other"
            spellCheck={false}
          />

          <button
            type="button"
            onClick={() => setShowConfirmPassword((p) => !p)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white z-20"
          >
            {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
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
          <p className="text-sm text-red-300">{error}</p>
        )}

        <Button
          type="submit"
          className="h-11 w-full"
          disabled={isLoading}
          onClick={handleSubmit}
        >
          {isLoading ? "Creating..." : "Create Account"}
        </Button>

        <button
          type="button"
          className="w-full text-center text-sm text-slate-400 hover:text-white"
          onClick={() =>
            window.dispatchEvent(
              new CustomEvent("open-auth-modal", {
                detail: "login",
              }),
            )
          }
        >
          Already have an account? Login
        </button>
      </form>
    </GlassCard>
  );
}