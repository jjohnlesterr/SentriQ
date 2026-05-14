"use client";

import { Button } from "@/components/ui/button";

type Props = {
  canSeeMore: boolean;
  canSeeLess: boolean;
  onSeeMore: () => void;
  onSeeLess: () => void;
};

export default function QuestionPagination({
  canSeeMore,
  canSeeLess,
  onSeeMore,
  onSeeLess,
}: Props) {
  if (!canSeeMore && !canSeeLess) return null;

  return (
    <div className="flex gap-2 pt-2">
      {canSeeMore && (
        <Button
          type="button"
          variant="ghost"
          onClick={onSeeMore}
          className="flex-1 rounded-xl border border-white/10 bg-white/5 text-xs text-slate-300 hover:bg-white/10 hover:text-white"
        >
          See More
        </Button>
      )}

      {canSeeLess && (
        <Button
          type="button"
          variant="ghost"
          onClick={onSeeLess}
          className="flex-1 rounded-xl border border-white/10 bg-white/5 text-xs text-slate-300 hover:bg-white/10 hover:text-white"
        >
          See Less
        </Button>
      )}
    </div>
  );
}