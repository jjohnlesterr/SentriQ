import { ArrowLeft, Loader2, Rocket, Save } from "lucide-react";

import { Button } from "@/components/ui/button";

type Props = {
  questionCount: number;
  isSaving: boolean;
  isPublishing: boolean;
  isPublished?: boolean;
  disablePublish: boolean;
  onBack: () => void;
  onSave: () => void;
  onPublish: () => void;
};

export default function BuilderHeader({
  questionCount,
  isSaving,
  isPublishing,
  isPublished,
  disablePublish,
  onBack,
  onSave,
  onPublish,
}: Props) {
  return (
    <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="flex min-w-0 items-center gap-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="h-10 w-10 shrink-0 cursor-pointer rounded-xl border border-white/10 bg-white/5 p-0 text-slate-300 hover:bg-white/10 hover:text-white md:h-11 md:w-11"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>

        <div className="min-w-0">
          <h1 className="truncate text-2xl font-extrabold leading-tight text-white md:text-3xl">
            Quiz Builder
          </h1>

          <p className="mt-1 text-sm text-slate-400">
            {questionCount} question{questionCount !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 md:flex">
        <Button
          type="button"
          onClick={onSave}
          disabled={isSaving}
          variant="ghost"
          className="h-11 cursor-pointer rounded-xl border border-white/10 bg-white/5 px-4 text-xs text-slate-200 hover:bg-white/10 hover:text-white disabled:bg-black/30 disabled:text-slate-500 sm:text-sm"
        >
          {isSaving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Save Draft
            </>
          )}
        </Button>

        <Button
          type="button"
          onClick={onPublish}
          disabled={isPublishing || disablePublish}
          className="h-11 cursor-pointer rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 px-4 text-xs text-white shadow-lg hover:from-cyan-600 hover:to-blue-600 disabled:cursor-not-allowed disabled:bg-black/30 disabled:from-black/30 disabled:to-black/30 disabled:text-slate-500 sm:text-sm"
        >
          {isPublishing ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Publishing...
            </>
          ) : isPublished ? (
            "Published"
          ) : (
            <>
              <Rocket className="h-4 w-4" />
              Publish
            </>
          )}
        </Button>
      </div>
    </header>
  );
}