import { Copy } from "lucide-react";

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
  onOpenChange: (open: boolean) => void;
  onCopyCode: () => void;
  onGoToMonitor: () => void;
};

export default function PublishCodeDialog({
  open,
  code,
  onOpenChange,
  onCopyCode,
  onGoToMonitor,
}: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-white/10 bg-slate-950/95 text-white backdrop-blur-2xl">
        <DialogHeader>
          <DialogTitle className="text-white">Quiz Published!</DialogTitle>
          <DialogDescription className="text-slate-300">
            Share this code with students so they can join the quiz.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="rounded-2xl border border-violet-400/20 bg-violet-500/10 p-6 text-center">
            <p className="mb-2 text-sm text-slate-300">Join Code</p>

            <p className="font-mono text-4xl font-bold tracking-[0.3em] text-violet-200">
              {code}
            </p>
          </div>

          <Button
            type="button"
            onClick={onCopyCode}
            variant="outline"
            className="w-full cursor-pointer border-white/10 bg-white/5 text-slate-200 hover:bg-white/10 hover:text-white"
          >
            <Copy className="h-4 w-4" />
            Copy Code
          </Button>

          <Button
            type="button"
            onClick={onGoToMonitor}
            className="w-full cursor-pointer bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600"
          >
            Go to Monitor
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}