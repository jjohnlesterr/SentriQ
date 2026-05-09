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
    <div className="relative border-b border-white/10 bg-white/5 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 md:flex-row md:items-center md:justify-between md:px-10 md:py-6 lg:px-16">
        <div className="flex min-w-0 items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="h-10 w-10 shrink-0 cursor-pointer rounded-xl border border-white/10 bg-white/5 p-0 text-slate-300 hover:bg-white/10 hover:text-white"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>

          <div className="min-w-0">
            <h1 className="text-2xl font-bold leading-tight text-white md:text-3xl">
              Quiz Builder
            </h1>

            <p className="text-sm text-slate-300">
              {questionCount} question{questionCount !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 md:flex">
          <Button
            type="button"
            onClick={onSave}
            disabled={isSaving}
            variant="secondary"
            className="h-10 cursor-pointer border-white/10 bg-white/5 text-xs text-slate-200 hover:bg-white/10 hover:text-white sm:text-sm md:h-11"
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
            className="h-10 cursor-pointer bg-gradient-to-r from-blue-500 to-cyan-500 text-xs text-white shadow-lg hover:from-blue-600 hover:to-cyan-600 sm:text-sm md:h-11"
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
      </div>
    </div>
  );
}