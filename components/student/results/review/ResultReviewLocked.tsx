import { Lock } from "lucide-react";

export default function ResultReviewLocked() {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-dashed border-line-strong px-5 py-4">
      <Lock className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" />

      <div>
        <p className="text-sm font-medium text-slate-200">Answer review not released yet</p>
        <p className="mt-1 text-sm text-slate-500">
          Your teacher will release the review when they are ready.
        </p>
      </div>
    </div>
  );
}
