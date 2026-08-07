"use client";

import { HONEYPOT_FIELD } from "@/lib/cms/forms";

/**
 * A field no human ever sees, for catching form bots.
 *
 * Bots parse the DOM and fill every input they find. A value in this one is
 * therefore a strong signal the submission is automated — the server accepts it
 * with a normal success response and saves nothing, because an error would only
 * teach the bot to try a different shape.
 *
 * ## Why it is hidden this way
 *
 * Not `type="hidden"`: the better bots skip those. Not `display: none` either,
 * for the same reason. It is a real, focusable-by-nothing text input pushed
 * off-screen, so it looks ordinary to a scraper.
 *
 * The three attributes that keep it away from humans matter individually:
 *  - `tabIndex={-1}`  keeps it out of the keyboard tab order
 *  - `aria-hidden`    keeps it out of the accessibility tree, so a screen
 *                     reader never announces a field its user cannot answer
 *  - `autoComplete="off"` stops a password manager helpfully filling it in and
 *                     getting a real visitor silently discarded
 */
export function Honeypot() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute -left-[9999px] top-0 h-px w-px overflow-hidden"
    >
      <label htmlFor={HONEYPOT_FIELD}>Leave this field empty</label>
      <input
        id={HONEYPOT_FIELD}
        name={HONEYPOT_FIELD}
        type="text"
        tabIndex={-1}
        autoComplete="off"
        defaultValue=""
      />
    </div>
  );
}
