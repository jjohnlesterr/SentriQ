import { ArrowLeft, Clock, Loader2, Menu, Rocket, Save } from "lucide-react";

import AppLogo from "@/components/shared/AppLogo";
import { Badge } from "@/components/ui/badge";
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
  onOpenSidebar,
}: Props) {
  return (
    <>
      <div className="mb-4 flex items-center justify-between lg:hidden">
        {onOpenSidebar ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onOpenSidebar}
            aria-label="Open sidebar"
            className="h-11 w-11 rounded-2xl border border-white/10 bg-white/5 p-0 text-slate-300 hover:bg-white/10 hover:text-white"
          >
            <Menu className="h-5 w-5" />
          </Button>
        ) : (
          <div className="h-11 w-11" />
        )}

        <AppLogo className="text-2xl" />

        <div className="h-11 w-11" />
      </div>

      <header className="rounded-3xl border border-white/10 bg-white/[0.04] p-4 shadow-[0_18px_70px_rgba(0,0,0,0.25)] backdrop-blur-xl md:p-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex min-w-0 items-center gap-3">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onBack}
              aria-label="Go back"
              className="hidden h-11 w-11 shrink-0 cursor-pointer rounded-2xl border border-white/10 bg-white/5 p-0 text-slate-300 hover:bg-white/10 hover:text-white lg:inline-flex"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>

            <div className="min-w-0">
              <Badge className="border-cyan-400/20 bg-cyan-500/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-cyan-200 sm:text-[11px]">
                Assessment Setup
              </Badge>

              <h1 className="mt-1 truncate text-2xl font-extrabold leading-tight text-white md:text-3xl">
                Quiz Builder
              </h1>

              <p className="mt-1 text-sm text-slate-400">
                {questionCount} question{questionCount !== 1 ? "s" : ""} in
                this draft
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 md:flex md:items-center md:gap-3">
            <Button
              type="button"
              onClick={onOpenTimer}
              variant="ghost"
              title={timeLimitMinutes ? "Edit Timer" : "Set Timer"}
              className={
                timeLimitMinutes
                  ? "h-11 min-w-0 cursor-pointer rounded-2xl border border-cyan-400/40 bg-cyan-500/10 px-2 text-[11px] font-semibold text-cyan-100 hover:bg-cyan-500/15 hover:text-white sm:px-4 sm:text-sm md:min-w-[120px]"
                  : "h-11 min-w-0 cursor-pointer rounded-2xl border border-white/10 bg-white/5 px-2 text-[11px] text-slate-200 hover:bg-white/10 hover:text-white sm:px-4 sm:text-sm md:min-w-[120px]"
              }
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
              className="h-11 min-w-0 cursor-pointer rounded-2xl border border-white/10 bg-white/5 px-2 text-[11px] text-slate-200 hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:bg-black/30 disabled:text-slate-500 sm:px-4 sm:text-sm md:min-w-[120px]"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 shrink-0 animate-spin" />
                  <span className="truncate">Saving</span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 shrink-0" />
                  <span className="truncate">Draft</span>
                </>
              )}
            </Button>

            <Button
              type="button"
              onClick={onPublish}
              disabled={isPublishing || disablePublish}
              title={isPublished ? "Published" : "Publish"}
              className="h-11 min-w-0 cursor-pointer rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-500 px-2 text-[11px] font-semibold text-white shadow-lg shadow-blue-500/20 hover:from-cyan-600 hover:to-blue-600 disabled:cursor-not-allowed disabled:bg-black/30 disabled:from-black/30 disabled:to-black/30 disabled:text-slate-500 sm:px-4 sm:text-sm md:min-w-[120px]"
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