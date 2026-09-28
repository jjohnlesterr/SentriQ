import { useCallback, useSyncExternalStore } from "react";

// Subscribes to a CSS media query. Returns false during server rendering.
export function useMediaQuery(query: string) {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const mediaQuery = window.matchMedia(query);

      mediaQuery.addEventListener("change", onChange);

      return () => mediaQuery.removeEventListener("change", onChange);
    },
    [query],
  );

  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false,
  );
}
