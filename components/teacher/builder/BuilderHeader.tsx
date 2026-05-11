import { ArrowLeft, Loader2, Menu, Rocket, Save } from "lucide-react";

import { Badge } from "@/components/ui/badge";
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
  onOpenSidebar?: () => void;
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
  onOpenSidebar,
}: Props) {
  return (
    <header className="rounded-3xl border border-white/10 bg-white/[0.04] p-4 shadow-[0_18px_70px_rgba(0,0,0,0.25)] backdrop-blur-xl md:p-5">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          {onOpenSidebar && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onOpenSidebar}
              aria-label="Open sidebar"
              className="h-11 w-11 shrink-0 cursor-pointer rounded-2xl border border-white/10 bg-white/5 p-0 text-slate-300 hover:bg-white/10 hover:text-white lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </Button>
          )}

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
            <Badge
              className="border-cyan-400/20 bg-cyan-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-200"
            >
              Assessment Setup
            </Badge>

            <h1 className="mt-1 truncate text-2xl font-extrabold leading-tight text-white md:text-3xl">
              Quiz Builder
            </h1>

            <p className="mt-1 text-sm text-slate-400">
              {questionCount} question{questionCount !== 1 ? "s" : ""} in this
              draft
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 md:flex md:items-center">
          <Button
            type="button"
            onClick={onSave}
            disabled={isSaving}
            variant="ghost"
            className="h-11 cursor-pointer rounded-2xl border border-white/10 bg-white/5 px-4 text-xs text-slate-200 hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:bg-black/30 disabled:text-slate-500 sm:text-sm"
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
            className="h-11 cursor-pointer rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-500 px-4 text-xs font-semibold text-white shadow-lg shadow-blue-500/20 hover:from-cyan-600 hover:to-blue-600 disabled:cursor-not-allowed disabled:bg-black/30 disabled:from-black/30 disabled:to-black/30 disabled:text-slate-500 sm:text-sm"
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
    </header>
  );
}
