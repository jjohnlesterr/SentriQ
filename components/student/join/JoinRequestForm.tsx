"use client";

import { Loader2, ShieldCheck } from "lucide-react";

import SectionHeading from "@/components/shared/SectionHeading";
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
      <SectionHeading
        icon={ShieldCheck}
        badge="Student Access Portal"
        title="Join Quiz"
        description="Enter your name and quiz code to securely join your assessment."
        variant="page"
        className="mb-6 md:mb-8"
        badgeClassName="mb-4 border-cyan-400/20 bg-cyan-400/10 px-3 py-1.5 text-xs text-cyan-200 md:mb-4"
        titleClassName="text-3xl md:text-4xl"
        descriptionClassName="mt-2 text-sm leading-6 text-slate-300 md:mt-3"
      />

      <div className="space-y-2">
        <label className="text-sm text-slate-200">Student Name</label>

        <Input
          value={studentName}
          maxLength={VALIDATION_LIMITS.STUDENT_NAME_MAX}
          placeholder="Enter your name"
          className="h-11"
          onChange={(e) =>
            onStudentNameChange(sanitizeInput(e.target.value))
          }
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
          placeholder="ENTER QUIZ CODE"
          className="h-11 uppercase"
          maxLength={12}
          onChange={(e) =>
            onQuizCodeChange(
              sanitizeInput(e.target.value.toUpperCase())
            )
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
        className="h-11 w-full"
        disabled={isLoading || !studentName.trim() || !quizCode.trim()}
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            Joining...
          </span>
        ) : (
          "Request Access"
        )}
      </Button>
    </form>
  );
}