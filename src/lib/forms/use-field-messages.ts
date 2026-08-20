"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * The two kinds of message a field can carry, and the rules for which one
 * speaks.
 *
 * An **error** is a standing verdict: it appears when the form is submitted (or
 * when a filled-in field loses focus) and stays until the value is fixed.
 *
 * A **notice** is feedback on a single action — the keystroke that was refused.
 * It retires on its own, because a message about something that already
 * happened should not sit on top of the standing verdict forever.
 *
 * `shown` merges them with the notice first: it is the most recent thing that
 * happened, and the most specific answer to "why did that not work?".
 */

/** How long a refused-keystroke message stays up before it steps aside. */
const NOTICE_MS = 4000;

export type FieldMessages<K extends string> = Partial<Record<K, string>>;

type Timer = ReturnType<typeof setTimeout>;

/** `Object.values` over a generic-keyed record widens to unknown; narrow once. */
function clearAllTimers(pending: Record<string, Timer | undefined>) {
  for (const timer of Object.values(pending)) clearTimeout(timer);
}

export function useFieldMessages<K extends string>() {
  const [errors, setErrors] = useState<FieldMessages<K>>({});
  const [notices, setNotices] = useState<FieldMessages<K>>({});
  const timers = useRef<Record<string, Timer | undefined>>({});

  // Timers outlive the render that set them; drop them with the component.
  useEffect(() => {
    const pending = timers.current;
    return () => clearAllTimers(pending);
  }, []);

  /** Set or clear one field's error. Passing null removes the key entirely. */
  const setFieldError = useCallback((key: K, message: string | null) => {
    setErrors((prev) => {
      if ((prev[key] ?? null) === message) return prev;
      const next = { ...prev };
      if (message) next[key] = message;
      else delete next[key];
      return next;
    });
  }, []);

  /** Put a refused-keystroke message up, then let it retire on its own. */
  const flashNotice = useCallback((key: K, message: string | null) => {
    if (!message) return;
    clearTimeout(timers.current[key]);
    setNotices((prev) => ({ ...prev, [key]: message }));
    timers.current[key] = setTimeout(() => {
      // Stepping aside reveals the standing error underneath, if there is one.
      setNotices((prev) => {
        if (!(key in prev)) return prev;
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }, NOTICE_MS);
  }, []);

  const clearNotices = useCallback(() => {
    clearAllTimers(timers.current);
    timers.current = {};
    setNotices({});
  }, []);

  const clearAll = useCallback(() => {
    clearNotices();
    setErrors({});
  }, [clearNotices]);

  /** One message per field — the notice speaks first. */
  const shown: FieldMessages<K> = { ...errors, ...notices };

  return { errors, shown, setErrors, setFieldError, flashNotice, clearNotices, clearAll };
}
