import {
  AlertTriangle,
  Clipboard,
  ClipboardPaste,
  Maximize,
} from "lucide-react";

import { Button } from "@/components/ui/button";

type TabWarningProps = {
  tabWarnings: number;
  fullscreenExits?: number;
  copyAttempts?: number;
  pasteAttempts?: number;
  isFullscreenActive?: boolean;
  onReturnFullscreen?: () => void;
};

export default function TabWarning({
  tabWarnings,
  fullscreenExits = 0,
  copyAttempts = 0,
  pasteAttempts = 0,
  isFullscreenActive = true,
  onReturnFullscreen,
}: TabWarningProps) {
  const totalViolations =
    tabWarnings + fullscreenExits + copyAttempts + pasteAttempts;

  if (totalViolations <= 0 && isFullscreenActive) return null;

  return (
    <div
      className={
        !isFullscreenActive
          ? "mb-5 rounded-2xl border border-orange-400/30 bg-orange-500/10 p-4 text-orange-100 md:mb-6"
          : "mb-5 rounded-2xl border border-red-400/20 bg-red-500/10 p-4 text-red-200 md:mb-6"
      }
    >
      <div className="flex items-start gap-3">
        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />

        <div className="w-full">
          <p className="font-semibold">
            {!isFullscreenActive
              ? "Fullscreen required"
              : "Security activity detected"}
          </p>

          <p className="mt-1 text-sm text-slate-300">
            {!isFullscreenActive
              ? "Please return to fullscreen mode to continue answering the quiz."
              : "Your teacher can review your activity history."}
          </p>

          {!isFullscreenActive && (
            <Button
              type="button"
              variant="primary"
              onClick={onReturnFullscreen}
              className="mt-4 h-11 w-full sm:w-auto"
            >
              <Maximize className="h-4 w-4" />
              Return to Fullscreen
            </Button>
          )}

          {totalViolations > 0 && (
            <div className="mt-3 grid gap-2 text-xs sm:grid-cols-2">
              <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                Tab Switches:{" "}
                <span className="font-bold text-red-300">{tabWarnings}</span>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                Fullscreen Exits:{" "}
                <span className="font-bold text-orange-300">
                  {fullscreenExits}
                </span>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                <Clipboard className="mr-1 inline h-3 w-3" />
                Copy Attempts:{" "}
                <span className="font-bold text-red-300">{copyAttempts}</span>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                <ClipboardPaste className="mr-1 inline h-3 w-3" />
                Paste Attempts:{" "}
                <span className="font-bold text-red-300">{pasteAttempts}</span>
              </div>
            </div>
          )}

          <div className="mt-3 flex items-center gap-2 text-xs text-slate-400">
            <Maximize className="h-3 w-3" />
            Fullscreen mode is required during the quiz.
          </div>
        </div>
      </div>
    </div>
  );
}