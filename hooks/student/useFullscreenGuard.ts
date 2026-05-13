"use client";

import { useState } from "react";

export function useFullscreenGuard() {
  const [isFullscreenActive, setFullscreenActive] = useState(false);

  async function requestFullscreen(onFailed?: () => Promise<void> | void) {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      }

      setFullscreenActive(true);
    } catch {
      setFullscreenActive(false);
      await onFailed?.();
    }
  }

  return {
    isFullscreenActive,
    setFullscreenActive,
    requestFullscreen,
  };
}