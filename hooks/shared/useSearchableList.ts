"use client";

import { useMemo, useState } from "react";

type Config<T> = {
  items: T[];
  searchBy: (item: T) => string;
};

export function useSearchableList<T>({
  items,
  searchBy,
}: Config<T>) {
  const [search, setSearch] = useState("");

  const filteredItems = useMemo(() => {
    const normalized = search.trim().toLowerCase();

    if (!normalized) return items;

    return items.filter((item) =>
      searchBy(item).toLowerCase().includes(normalized)
    );
  }, [items, search, searchBy]);

  return {
    search,
    setSearch,
    filteredItems,
  };
}