"use client";

import { useEffect, useMemo, useRef, useState } from "react";

export function useInfiniteScroll<T>(
  items: T[],
  initialVisible = 5,
  step = 5,
) {
  const [visibleCount, setVisibleCount] = useState(initialVisible);
  const loaderRef = useRef<HTMLDivElement | null>(null);

  const safeVisibleCount = Math.min(visibleCount, items.length);

  const visibleItems = useMemo(() => {
    return items.slice(0, safeVisibleCount);
  }, [items, safeVisibleCount]);

  const hasMoreItems = safeVisibleCount < items.length;

  useEffect(() => {
    setVisibleCount(initialVisible);
  }, [items, initialVisible]);

  useEffect(() => {
    const loader = loaderRef.current;

    if (!loader || !hasMoreItems) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const firstEntry = entries[0];

        if (firstEntry?.isIntersecting) {
          setVisibleCount((current) =>
            Math.min(current + step, items.length),
          );
        }
      },
      {
        root: null,
        rootMargin: "200px",
        threshold: 0,
      },
    );

    observer.observe(loader);

    return () => {
      observer.disconnect();
    };
  }, [hasMoreItems, items.length, step]);

  return {
    visibleItems,
    visibleCount: safeVisibleCount,
    totalCount: items.length,
    hiddenCount: Math.max(items.length - safeVisibleCount, 0),
    hasMoreItems,
    loaderRef,
  };
}