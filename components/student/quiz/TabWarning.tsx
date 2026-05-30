import { AlertTriangle, Maximize } from "lucide-react";

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
          ? "mb-4 rounded-2xl border border-orange-400/20 bg-orange-500/[0.07] px-4 py-3 text-orange-100 md:mb-5"
          : "mb-4 rounded-2xl border border-red-400/15 bg-red-500/[0.06] px-4 py-3 text-red-100 md:mb-5"
      }
    >
      <div className="flex items-start gap-3">
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 opacity-85" />

        <div className="min-w-0">
          <p className="text-sm font-semibold">
            {!isFullscreenActive
              ? "Fullscreen required"
              : "Security activity detected"}
          </p>

          <p className="mt-1 text-xs leading-relaxed text-slate-400 md:text-sm">
            {!isFullscreenActive
              ? "Please return to fullscreen mode to continue answering the quiz."
              : "Your teacher can review your activity history."}
          </p>

          {!isFullscreenActive && (
            <Button
              type="button"
              variant="primary"
              onClick={onReturnFullscreen}
              className="mt-3 h-10 w-full sm:w-auto"
            >
              <Maximize className="h-4 w-4" />
              Return to Fullscreen
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}