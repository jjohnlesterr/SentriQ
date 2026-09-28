import { Clock, Copy } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type Props = {
  open: boolean;
  code?: string;
  timeLimitMinutes?: number | null;
  onOpenChange: (open: boolean) => void;
  onCopyCode: () => void;
  onGoToMonitor: () => void;
};

function formatTimerLabel(minutes?: number | null) {
  if (!minutes) return "No time limit";

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (hours > 0 && remainingMinutes > 0)
    return `${hours}h ${remainingMinutes}m`;
  if (hours > 0) return `${hours}h`;
  return `${remainingMinutes}m`;
}

export default function PublishCodeDialog({
  open,
  code,
  timeLimitMinutes,
  onOpenChange,
  onCopyCode,
  onGoToMonitor,
}: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-line bg-surface text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white">
            Quiz Published!
          </DialogTitle>

          <DialogDescription className="text-slate-400">
            Share this code with students so they can join the quiz.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="rounded-xl border border-cyan-400/20 bg-cyan-500/10 p-6 text-center">
            <p className="mb-2 text-sm text-slate-300">Join Code</p>

            <p className="break-all font-mono text-4xl font-bold tracking-[0.25em] text-cyan-200">
              {code}
            </p>
          </div>

          <div className="flex items-center justify-between gap-3 rounded-xl border border-line bg-white/[0.03] px-4 py-3">
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-cyan-300" />

              <div>
                <p className="text-xs text-slate-400">Timer</p>
                <p className="text-sm font-semibold text-white">
                  {formatTimerLabel(timeLimitMinutes)}
                </p>
              </div>
            </div>
          </div>

          <Button
            type="button"
            onClick={onCopyCode}
            variant="ghost"
            className="w-full"
          >
            <Copy className="h-4 w-4" />
            Copy Code
          </Button>

          <Button
            type="button"
            onClick={onGoToMonitor}
            className="w-full"
          >
            Go to Monitor
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
