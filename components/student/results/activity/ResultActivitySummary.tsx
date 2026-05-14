import {
  AlertTriangle,
  Clipboard,
  ClipboardPaste,
  Maximize,
} from "lucide-react";

import type { SessionEvent } from "@/lib/shared/types";

type ResultActivitySummaryProps = {
  tabSwitches: number;
  events: SessionEvent[];
};

function countEvents(events: SessionEvent[], type: string) {
  return events.filter((event) => event.type === type).length;
}

export default function ResultActivitySummary({
  tabSwitches,
  events,
}: ResultActivitySummaryProps) {
  const fullscreenExits = countEvents(events, "fullscreen-exit");
  const copyAttempts = countEvents(events, "copy-attempt");
  const pasteAttempts = countEvents(events, "paste-attempt");

  return (
    <div className="rounded-2xl border border-red-400/20 bg-red-500/10 p-4 backdrop-blur-md">
      <div className="flex items-start gap-3">
        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-red-300" />

        <div className="w-full">
          <p className="font-semibold text-red-200">Activity Summary</p>

          <div className="mt-3 grid gap-2 text-xs sm:grid-cols-2">
            <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2">
              Tab Switches:{" "}
              <span className="font-bold text-red-300">{tabSwitches}</span>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2">
              <Maximize className="mr-1 inline h-3 w-3" />
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
        </div>
      </div>
    </div>
  );
}