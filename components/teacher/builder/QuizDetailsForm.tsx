import { FileText } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { VALIDATION_LIMITS } from "@/lib/validations/constants";

type Props = {
  title: string;
  description: string;
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
};

function sanitizeInput(value: string) {
  return value.replace(/^\s+/, "");
}

export default function QuizDetailsForm({
  title,
  description,
  onTitleChange,
  onDescriptionChange,
}: Props) {
  return (
    <section className="rounded-xl border border-line bg-white/[0.04] p-4">
      <div className="mb-5 hidden items-center gap-3 sm:flex">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-500/10 text-cyan-300">
          <FileText className="h-5 w-5" />
        </div>

        <div className="min-w-0">
          <h2 className="text-lg font-bold text-white">
            Quiz Details
          </h2>

          <p className="text-sm text-slate-500">
            Set the title and student instructions.
          </p>
        </div>
      </div>

      <div className="mb-4 sm:hidden">
        <h2 className="text-base font-bold text-white">
          Quiz Details
        </h2>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="quiz-title">
              Quiz Title
            </Label>

            <span className="text-xs text-slate-500">
              {title.length}/
              {VALIDATION_LIMITS.QUIZ_TITLE_MAX}
            </span>
          </div>

          <Input
            id="quiz-title"
            value={title}
            maxLength={VALIDATION_LIMITS.QUIZ_TITLE_MAX}
            onChange={(e) =>
              onTitleChange(
                sanitizeInput(e.target.value),
              )
            }
            placeholder="e.g. Chemistry Quiz"
            className="h-12 rounded-xl border-line bg-surface px-4"
          />

          {title.trim().length > 0 &&
            title.trim().length <
              VALIDATION_LIMITS.QUIZ_TITLE_MIN && (
              <p className="text-xs text-red-400">
                Title must be at least{" "}
                {VALIDATION_LIMITS.QUIZ_TITLE_MIN}{" "}
                characters.
              </p>
            )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="quiz-description">
              Description
            </Label>

            <span className="text-xs text-slate-500">
              {description.length}/
              {
                VALIDATION_LIMITS.QUIZ_DESCRIPTION_MAX
              }
            </span>
          </div>

          <Textarea
            id="quiz-description"
            value={description}
            maxLength={
              VALIDATION_LIMITS.QUIZ_DESCRIPTION_MAX
            }
            onChange={(e) =>
              onDescriptionChange(
                sanitizeInput(e.target.value),
              )
            }
            placeholder="Add instructions for students"
            rows={4}
            className="min-h-[132px] resize-none rounded-xl border-line bg-surface px-4 py-3"
          />
        </div>
      </div>
    </section>
  );
}