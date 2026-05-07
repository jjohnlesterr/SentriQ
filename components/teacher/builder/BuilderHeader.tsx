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
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-6 md:px-10 lg:px-16">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="cursor-pointer rounded-xl border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>

          <div>
            <h1 className="text-2xl font-bold text-white md:text-3xl">
              Quiz Builder
            </h1>
            <p className="text-sm text-slate-300">
              {questionCount} question{questionCount !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            type="button"
            onClick={onSave}
            disabled={isSaving}
            variant="secondary"
            className="cursor-pointer border-white/10 bg-white/5 text-slate-200 hover:bg-white/10 hover:text-white"
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
            className="cursor-pointer bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg hover:from-blue-600 hover:to-cyan-600"
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
                Publish Quiz
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}