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
        </div>
      </div>
    </div>
  );
}