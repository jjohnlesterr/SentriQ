"use client";

import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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
  return value.replace(/^\s+/, "");
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
    <form onSubmit={onSubmit} className="space-y-5">
      <div>
        <h1 className="text-3xl font-bold text-white">Join Quiz</h1>

        <p className="mt-2 text-sm text-slate-400">
          Enter your name and quiz code to request access.
        </p>
      </div>

      <div className="space-y-2">
        <label className="text-sm text-slate-200">Student Name</label>

        <Input
          value={studentName}
          maxLength={VALIDATION_LIMITS.STUDENT_NAME_MAX}
          placeholder="Enter your name"
          className="h-12"
          onChange={(e) => onStudentNameChange(sanitizeInput(e.target.value))}
          required
        />

        <div className="flex justify-end">
          <span className="text-xs text-slate-500">
            {studentName.length}/{VALIDATION_LIMITS.STUDENT_NAME_MAX}
          </span>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm text-slate-200">Quiz Code</label>

        <Input
          value={quizCode}
          placeholder="Enter quiz code"
          className="h-12 uppercase"
          maxLength={12}
          onChange={(e) =>
            onQuizCodeChange(sanitizeInput(e.target.value.toUpperCase()))
          }
          required
        />
      </div>

      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {error}
        </div>
      )}

      <Button
        type="submit"
        variant="primary"
        className="h-12 w-full"
        disabled={isLoading || !studentName.trim() || !quizCode.trim()}
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Joining...
          </>
        ) : (
          "Request Access"
        )}
      </Button>
    </form>
  );
}
