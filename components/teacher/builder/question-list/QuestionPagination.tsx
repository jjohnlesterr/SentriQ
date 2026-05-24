"use client";

import { Button } from "@/components/ui/button";

type Props = {
  totalQuestions: number;
  visibleCount: number;
  isExpanded: boolean;
  onSeeMore: () => void;
  onSeeLess: () => void;
};

export default function QuestionPagination({
  totalQuestions,
  visibleCount,
  isExpanded,
  onSeeMore,
  onSeeLess,
}: Props) {
  if (totalQuestions <= visibleCount) return null;

  return (
    <div className="relative z-20 pt-2">
      <Button
        type="button"
        variant="ghost"
        onClick={isExpanded ? onSeeLess : onSeeMore}
        className="h-11 w-full rounded-2xl border border-white/10 bg-white/10 text-sm font-semibold text-white hover:bg-white/15"
      >
        {isExpanded ? "See Less" : `See More (${totalQuestions - visibleCount})`}
      </Button>
    </div>
  );
}