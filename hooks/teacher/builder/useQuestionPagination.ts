"use client";

import { useCallback, useEffect, useState } from "react";

export function useQuestionPagination<T>(items: T[], pageSize = 5) {
  const [visibleCount, setVisibleCount] = useState(pageSize);

  const visibleItems = items.slice(0, visibleCount);

  const canSeeMore = visibleCount < items.length;
  const canSeeLess = items.length > pageSize && !canSeeMore;

  const seeMore = useCallback(() => {
    setVisibleCount((current) => Math.min(current + pageSize, items.length));
  }, [items.length, pageSize]);

  const seeLess = useCallback(() => {
    setVisibleCount(pageSize);
  }, [pageSize]);

  const showItem = useCallback(
    (index: number) => {
      if (index < visibleCount) return;

      setVisibleCount(
        Math.min(Math.ceil((index + 1) / pageSize) * pageSize, items.length)
      );
    },
    [items.length, pageSize, visibleCount]
  );

  useEffect(() => {
    if (visibleCount > items.length) {
      setVisibleCount(Math.max(pageSize, items.length));
    }
  }, [items.length, pageSize, visibleCount]);

  return {
    visibleItems,
    canSeeMore,
    canSeeLess,
    seeMore,
    seeLess,
    showItem,
  };
}