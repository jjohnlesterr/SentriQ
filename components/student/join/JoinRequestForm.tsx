import { Loader2, ShieldCheck, Sparkles } from "lucide-react";

import SectionHeading from "@/components/shared/SectionHeading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Props = {
  studentName: string;
  quizCode: string;
  error: string;
  isLoading: boolean;
  onStudentNameChange: (value: string) => void;
  onQuizCodeChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
};

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
    <>
      <SectionHeading
        icon={Sparkles}
        badge="Student Access"
        title="Request Access"
        description="Enter your name and quiz code to request access to the assessment."
        variant="page"
        className="mb-6 md:mb-8"
        badgeClassName="mb-4 border border-violet-400/20 bg-violet-500/10 px-3 py-1.5 text-xs text-violet-200"
        iconClassName="h-3.5 w-3.5"
        titleClassName="text-3xl md:text-4xl"
        descriptionClassName="mt-2 text-sm leading-6 text-slate-300 md:mt-3 md:text-base"
      />

      <form onSubmit={onSubmit} className="space-y-4 md:space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name">Your Name</Label>

          <Input
            id="name"
            type="text"
            placeholder="Enter your full name"
            value={studentName}
            onChange={(e) => onStudentNameChange(e.target.value)}
            className="h-11"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="code">Quiz Code</Label>

          <Input
            id="code"
            type="text"
            placeholder="ABC123"
            value={quizCode}
            onChange={(e) => onQuizCodeChange(e.target.value.toUpperCase())}
            className="h-11 text-center font-mono uppercase tracking-[0.25em]"
            required
          />
        </div>

        {error && (
          <div className="rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {error}
          </div>
        )}

        <Button
          type="submit"
          variant="secondary"
          className="h-11 w-full"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Sending Request...
            </>
          ) : (
            <>
              <ShieldCheck className="h-4 w-4" />
              Request to Join
            </>
          )}
        </Button>
      </form>

      <div className="mt-5 border-t border-white/10 pt-5 md:mt-6 md:pt-6">
        <p className="text-center text-xs text-slate-400">
          Your teacher must approve your request before you can start.
        </p>
      </div>
    </>
  );
}