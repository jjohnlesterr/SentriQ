"use client";

import { useMemo, useState } from "react";

export function useExpandableList<T>(items: T[], initialVisible = 5, step = 5) {
  const [visibleCount, setVisibleCount] = useState(initialVisible);

  const safeVisibleCount = Math.min(visibleCount, items.length);

  const visibleItems = useMemo(() => {
    return items.slice(0, safeVisibleCount);
  }, [items, safeVisibleCount]);

  const hasMoreItems = safeVisibleCount < items.length;
  const canShowLess = safeVisibleCount > initialVisible;
  const expanded = canShowLess;

  function showMore() {
    setVisibleCount((current) => Math.min(current + step, items.length));
  }

  function showLess() {
    setVisibleCount(initialVisible);
  }

  return {
    expanded,
    visibleItems,
    visibleCount: safeVisibleCount,
    totalCount: items.length,
    hiddenCount: Math.max(items.length - safeVisibleCount, 0),
    hasMoreItems,
    hasHiddenItems: hasMoreItems,
    canShowLess,
    showMore,
    showLess,
  };
}