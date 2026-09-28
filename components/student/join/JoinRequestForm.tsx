"use client";

import { Loader2 } from "lucide-react";

import FormMessage from "@/components/shared/FormMessage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { VALIDATION_LIMITS } from "@/lib/validations/constants";

type Props = {
  studentName: string;
  quizCode: string;
  error: string;
  isLoading: boolean;
  onStudentNameChange: (value: string) => void;
  onQuizCodeChange: (value: string) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
};

function sanitizeInput(value: string) {
  return value.replace(/^s+/, "");
}

export default function JoinRequestForm({
  studentName,
  quizCode,
  error,
  isLoading,
  onStudentNameChange,
  onQuizCodeChange,
  onSubmit,
}: Props) {
  return (
    <div>
      <h1 className="text-xl font-semibold tracking-tight text-white">Join a quiz</h1>
      <p className="mt-1.5 text-sm text-slate-400">
        Enter your name and the code from your teacher. They&apos;ll approve you
        before the quiz starts.
      </p>

      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <div className="space-y-1.5">
          <div className="flex items-baseline justify-between">
            <Label htmlFor="student-name">Your name</Label>
            <span className="text-xs tabular-nums text-slate-500">
              {studentName.length}/{VALIDATION_LIMITS.STUDENT_NAME_MAX}
            </span>
          </div>

          <Input
            id="student-name"
            value={studentName}
            maxLength={VALIDATION_LIMITS.STUDENT_NAME_MAX}
            placeholder="First and last name"
            autoComplete="name"
            onChange={(e) => onStudentNameChange(sanitizeInput(e.target.value))}
            required
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="quiz-code">Quiz code</Label>
          <Input
            id="quiz-code"
            value={quizCode}
            placeholder="e.g. BIO3QZ"
            className="font-mono uppercase tracking-[0.2em] placeholder:font-sans placeholder:normal-case placeholder:tracking-normal"
            maxLength={12}
            autoComplete="off"
            autoCapitalize="characters"
            spellCheck={false}
            onChange={(e) => onQuizCodeChange(sanitizeInput(e.target.value.toUpperCase()))}
            required
          />
        </div>

        {error && <FormMessage>{error}</FormMessage>}

        <Button
          type="submit"
          className="w-full"
          disabled={isLoading || !studentName.trim() || !quizCode.trim()}
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Sending request…
            </>
          ) : (
            "Request to join"
          )}
        </Button>
      </form>
    </div>
  );
}
