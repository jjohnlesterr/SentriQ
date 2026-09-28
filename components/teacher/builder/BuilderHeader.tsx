import { ArrowLeft, Clock, Loader2, Menu, Rocket, Save, Sparkles } from "lucide-react";

import AppLogo from "@/components/shared/AppLogo";
import { Button } from "@/components/ui/button";

type Props = {
  questionCount: number;
  isSaving: boolean;
  isPublishing: boolean;
  isPublished?: boolean;
  disablePublish: boolean;
  timeLimitMinutes: number | null;
  onBack: () => void;
  onSave: () => void;
  onPublish: () => void;
  onOpenTimer: () => void;
  onOpenGenerate?: () => void;
  onOpenSidebar?: () => void;
};

function formatTimerLabel(minutes: number | null) {
  if (!minutes) return "Timer";

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (hours > 0 && remainingMinutes > 0) {
    return `${hours}h ${remainingMinutes}m`;
  }

  if (hours > 0) return `${hours}h`;

  return `${remainingMinutes}m`;
}

export default function BuilderHeader({
  questionCount,
  isSaving,
  isPublishing,
  isPublished,
  disablePublish,
  timeLimitMinutes,
  onBack,
  onSave,
  onPublish,
  onOpenTimer,
  onOpenGenerate,
  onOpenSidebar,
}: Props) {
  return (
    <>
      <div className="mb-6 flex items-center justify-between lg:hidden">
        {onOpenSidebar ? (
          <button
            type="button"
            onClick={onOpenSidebar}
            aria-label="Open sidebar"
            className="-ml-2 flex h-10 w-10 items-center justify-center rounded-md text-slate-300 transition-colors hover:bg-white/[0.05] hover:text-white"
          >
            <Menu className="h-5 w-5" />
          </button>
        ) : (
          <div className="h-10 w-10" />
        )}

        <AppLogo className="text-lg" />

        <div className="h-10 w-10" />
      </div>

      <header className="border-b border-line pb-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex min-w-0 items-center gap-3">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={onBack}
              aria-label="Back to dashboard"
              className="hidden h-9 w-9 shrink-0 lg:inline-flex"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>

            <div className="min-w-0">
              <h1 className="truncate text-xl font-semibold leading-tight tracking-tight text-white md:text-2xl">
                Quiz Builder
              </h1>

              <p className="mt-1 text-sm text-slate-400">
                {questionCount} question{questionCount !== 1 ? "s" : ""} in
                this draft
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 md:flex md:items-center">
            {onOpenGenerate && (
              <Button
                type="button"
                onClick={onOpenGenerate}
                variant="ghost"
                title="Generate questions with AI"
                className="min-w-0 px-2 text-xs text-cyan-200 sm:px-3.5 sm:text-sm"
              >
                <Sparkles className="h-4 w-4 shrink-0" />
                <span className="truncate">Generate</span>
              </Button>
            )}

            <Button
              type="button"
              onClick={onOpenTimer}
              variant="ghost"
              title={timeLimitMinutes ? "Edit Timer" : "Set Timer"}
              className={`min-w-0 px-2 text-xs sm:px-3.5 sm:text-sm ${
                timeLimitMinutes ? "text-cyan-200" : ""
              }`}
            >
              <Clock className="h-4 w-4 shrink-0" />
              <span className="truncate">{formatTimerLabel(timeLimitMinutes)}</span>
            </Button>

            <Button
              type="button"
              onClick={onSave}
              disabled={isSaving}
              variant="ghost"
              title="Save Draft"
              className="min-w-0 px-2 text-xs sm:px-3.5 sm:text-sm"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 shrink-0 animate-spin" />
                  <span className="truncate">Saving</span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 shrink-0" />
                  <span className="truncate">Save draft</span>
                </>
              )}
            </Button>

            <Button
              type="button"
              onClick={onPublish}
              disabled={isPublishing || disablePublish}
              title={isPublished ? "Published" : "Publish"}
              className="min-w-0 px-2 text-xs sm:px-3.5 sm:text-sm"
            >
              {isPublishing ? (
                <>
                  <Loader2 className="h-4 w-4 shrink-0 animate-spin" />
                  <span className="truncate">Publishing</span>
                </>
              ) : isPublished ? (
                <span className="truncate">Published</span>
              ) : (
                <>
                  <Rocket className="h-4 w-4 shrink-0" />
                  <span className="truncate">Publish</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </header>
    </>
  );
}