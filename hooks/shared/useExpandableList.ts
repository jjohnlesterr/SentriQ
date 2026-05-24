"use client";

import { useMemo, useState } from "react";

export function useExpandableList<T>(
  items: T[],
  initialVisible = 5
) {
  const [expanded, setExpanded] = useState(false);

  const visibleItems = useMemo(() => {
    if (expanded) return items;

    return items.slice(0, initialVisible);
  }, [expanded, items, initialVisible]);

  return {
    expanded,
    visibleItems,
    hasHiddenItems: items.length > initialVisible,
    hiddenCount: Math.max(items.length - initialVisible, 0),

    showMore: () => setExpanded(true),
    showLess: () => setExpanded(false),
  };
}