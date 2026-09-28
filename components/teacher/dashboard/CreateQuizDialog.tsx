"use client";

import { Loader2, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { VALIDATION_LIMITS } from "@/lib/validations/constants";

type Props = {
  open: boolean;
  title: string;
  description: string;
  isCreating: boolean;
  onOpenChange: (open: boolean) => void;
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onCreate: () => void;
  hideTrigger?: boolean;
};

function sanitizeInput(value: string) {
  return value.replace(/^\s+/, "");
}

export default function CreateQuizDialog({
  open,
  title,
  description,
  isCreating,
  onOpenChange,
  onTitleChange,
  onDescriptionChange,
  onCreate,
  hideTrigger = false,
}: Props) {
  const trimmedTitle = title.trim();

  const isTitleValid =
    trimmedTitle.length >= VALIDATION_LIMITS.QUIZ_TITLE_MIN &&
    trimmedTitle.length <= VALIDATION_LIMITS.QUIZ_TITLE_MAX;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {!hideTrigger && (
        <DialogTrigger asChild>
          <Button
            type="button"
            data-create-quiz-trigger
            className="w-full md:w-auto"
          >
            <Plus className="h-4 w-4" />
            New quiz
          </Button>
        </DialogTrigger>
      )}

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            New quiz
          </DialogTitle>

          <DialogDescription>
            Start a draft. You can add questions in the builder next.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="title">Quiz Title</Label>

              <span className="text-xs text-slate-500">
                {title.length}/{VALIDATION_LIMITS.QUIZ_TITLE_MAX}
              </span>
            </div>

            <Input
              id="title"
              placeholder="e.g. Chemistry Quiz"
              value={title}
              maxLength={VALIDATION_LIMITS.QUIZ_TITLE_MAX}
              onChange={(e) => onTitleChange(sanitizeInput(e.target.value))}
            />

            {!isTitleValid && trimmedTitle.length > 0 && (
              <p className="text-xs text-red-400">
                Title must be at least {VALIDATION_LIMITS.QUIZ_TITLE_MIN}{" "}
                characters.
              </p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="description">Description</Label>

              <span className="text-xs text-slate-500">
                {description.length}/{VALIDATION_LIMITS.QUIZ_DESCRIPTION_MAX}
              </span>
            </div>

            <Textarea
              id="description"
              placeholder="Optional instructions"
              maxLength={VALIDATION_LIMITS.QUIZ_DESCRIPTION_MAX}
              value={description}
              onChange={(e) =>
                onDescriptionChange(sanitizeInput(e.target.value))
              }
            />
          </div>

          <Button
            type="button"
            onClick={onCreate}
            disabled={isCreating || !isTitleValid}
            className="w-full cursor-pointer"
          >
            {isCreating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Plus className="h-4 w-4" />
                Create Quiz
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
