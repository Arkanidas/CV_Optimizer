"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ContactDetails } from "@/lib/AI/schemas";
import type { FormatSettings } from "./letterFormat";

export type SaveStatus = "idle" | "saving" | "saved" | "error";

export interface AutosavePayload {
  runId: string;
  content: string;
  templateId: string;
  settings: FormatSettings;
  contact: ContactDetails;
}

const SAVE_URL = "/api/cover-letter/save";
const DEBOUNCE_MS = 1500; // wait this long after the last change
const RETRY_MS = 5000; // after a failed save
const BUSY_RECHECK_MS = 500; // a save is already running

// Pass null while there's nothing worth saving yet.
export function useAutosave(payload: AutosavePayload | null) {
  const [status, setStatus] = useState<SaveStatus>("idle");

  // Timers read the newest payload when they fire, not the one from when
  // they were created.
  const payloadRef = useRef<AutosavePayload | null>(payload);
  useEffect(() => {
    payloadRef.current = payload;
  });

  const lastSavedRef = useRef<string | null>(null);
  const inFlightRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // An empty letter is never saved, so it can't wipe a saved one.
  const body = payload && payload.content.trim() ? JSON.stringify(payload) : null;

  const save: () => Promise<void> = useCallback(async () => {
    const current = payloadRef.current;
    if (!current || !current.content.trim()) return;

    const currentBody = JSON.stringify(current);
    if (currentBody === lastSavedRef.current) return; // nothing new

    if (inFlightRef.current) {
      timerRef.current = setTimeout(save, BUSY_RECHECK_MS);
      return;
    }

    inFlightRef.current = true;
    setStatus("saving");
    try {
      const res = await fetch(SAVE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: currentBody,
      });
      if (!res.ok) throw new Error(`Save failed (${res.status})`);

      lastSavedRef.current = currentBody;
      setStatus("saved");
    } catch (err) {
      console.error("Autosave failed:", err);
      setStatus("error");
      timerRef.current = setTimeout(save, RETRY_MS);
    } finally {
      inFlightRef.current = false;
    }
  }, []);

  // Debounce: every change restarts the countdown.
  useEffect(() => {
    if (!body || body === lastSavedRef.current) return;

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(save, DEBOUNCE_MS);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [body, save]);

  // Last chance: leaving the page or the step. keepalive lets the request
  // finish even while the page is closing.
  useEffect(() => {
    function flush() {
      const current = payloadRef.current;
      if (!current || !current.content.trim()) return;

      const currentBody = JSON.stringify(current);
      if (currentBody === lastSavedRef.current) return;

      fetch(SAVE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: currentBody,
        keepalive: true,
      })
        .then((res) => {
          if (res.ok) lastSavedRef.current = currentBody;
        })
        .catch(() => {});
    }

    window.addEventListener("pagehide", flush);
    return () => {
      window.removeEventListener("pagehide", flush);
      flush();
    };
  }, []);

  return { status };
}