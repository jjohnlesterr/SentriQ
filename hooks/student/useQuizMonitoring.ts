"use client";

import { useRef, useState } from "react";

import { recordSessionEvent } from "@/lib/actions";
import type { QuizSession } from "@/lib/shared/types";

type MonitoredEventType =
  | "tab-left"
  | "tab-returned"
  | "fullscreen-exit"
  | "copy-attempt"
  | "paste-attempt";

type Params = {
  session: QuizSession | null;
  sessionId: string;
  onSessionUpdate?: (session: QuizSession) => void;
};

type InitializeParams = {
  onFullscreenChange: (active: boolean) => void;
};

const MAX_CLIPBOARD_PREVIEW = 200;

function formatClipboardPreview(value: string) {
  const cleanValue = value.replace(/\s+/g, " ").trim();

  if (!cleanValue) return "";

  if (cleanValue.length <= MAX_CLIPBOARD_PREVIEW) {
    return cleanValue;
  }

  return `${cleanValue.slice(0, MAX_CLIPBOARD_PREVIEW)}...`;
}

export function useQuizMonitoring({
  session,
  sessionId,
  onSessionUpdate,
}: Params) {
  const leftTabAtRef = useRef<number | null>(null);

  const [tabWarnings, setTabWarnings] = useState(0);
  const [fullscreenExits, setFullscreenExits] = useState(0);
  const [copyAttempts, setCopyAttempts] = useState(0);
  const [pasteAttempts, setPasteAttempts] = useState(0);

  function syncViolationCounts(sessionData: QuizSession) {
    setTabWarnings(sessionData.tabSwitches || 0);

    setFullscreenExits(
      sessionData.events.filter((event) => event.type === "fullscreen-exit")
        .length
    );

    setCopyAttempts(
      sessionData.events.filter((event) => event.type === "copy-attempt")
        .length
    );

    setPasteAttempts(
      sessionData.events.filter((event) => event.type === "paste-attempt")
        .length
    );
  }

  async function addSessionEvent(
    type: MonitoredEventType,
    description: string,
    durationSeconds?: number
  ) {
    if (session?.approvalStatus !== "approved") return null;

    const updatedSession = await recordSessionEvent(sessionId, {
      type,
      description,
      durationSeconds,
    });

    syncViolationCounts(updatedSession);
    onSessionUpdate?.(updatedSession);

    return updatedSession;
  }

  function initializeMonitoring({ onFullscreenChange }: InitializeParams) {
    function handleVisibilityChange() {
      if (document.hidden) {
        leftTabAtRef.current = Date.now();

        addSessionEvent("tab-left", "Student left the quiz tab.");
        return;
      }

      if (leftTabAtRef.current) {
        const durationSeconds = Math.round(
          (Date.now() - leftTabAtRef.current) / 1000
        );

        addSessionEvent(
          "tab-returned",
          `Student returned after ${durationSeconds} second${
            durationSeconds !== 1 ? "s" : ""
          }.`,
          durationSeconds
        );

        leftTabAtRef.current = null;
      }
    }

    function handleFullscreenChange() {
      const active = !!document.fullscreenElement;

      onFullscreenChange(active);

      if (!active) {
        addSessionEvent("fullscreen-exit", "Student exited fullscreen mode.");
      }
    }

    function handleCopy(event: ClipboardEvent) {
      event.preventDefault();

      const selectedText = window.getSelection()?.toString() || "";
      const preview = formatClipboardPreview(selectedText);

      addSessionEvent(
        "copy-attempt",
        preview
          ? `Student attempted to copy: "${preview}"`
          : "Student attempted to copy quiz content."
      );
    }

    function handlePaste(event: ClipboardEvent) {
      const pastedText = event.clipboardData?.getData("text") || "";
      const preview = formatClipboardPreview(pastedText);

      addSessionEvent(
        "paste-attempt",
        preview
          ? `Student pasted ${pastedText.length} character${
              pastedText.length !== 1 ? "s" : ""
            }: "${preview}"`
          : "Student pasted content."
      );
    }

    document.addEventListener("visibilitychange", handleVisibilityChange);
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("copy", handleCopy);
    document.addEventListener("paste", handlePaste);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("copy", handleCopy);
      document.removeEventListener("paste", handlePaste);
    };
  }

  return {
    tabWarnings,
    fullscreenExits,
    copyAttempts,
    pasteAttempts,
    syncViolationCounts,
    addSessionEvent,
    initializeMonitoring,
  };
}