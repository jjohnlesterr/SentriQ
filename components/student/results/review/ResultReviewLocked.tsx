import { Lock } from "lucide-react";

export default function ResultReviewLocked() {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="flex items-start gap-3">
        <Lock className="mt-0.5 h-5 w-5 shrink-0 text-slate-300" />

        <div>
          <p className="font-semibold text-white">Review Locked</p>
          <p className="mt-1 text-sm text-slate-300">
            Your instructor has not released your answer review yet.
          </p>
        </div>
      </div>
    </div>
  );
}