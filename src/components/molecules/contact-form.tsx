"use client";

import { useState } from "react";
import { Button } from "@/components/atoms/button";

/**
 * Conversion form (Start Your Journey / Contact).
 * NOTE: not yet wired to a backend — submitting shows a local confirmation.
 * Phase 4 connects this to the NestJS `leads` API (see docs/10).
 */
export function ContactForm({ compact = false }: { compact?: boolean }) {
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <div className="rounded-xl border border-line bg-mist p-8 text-center">
        <p className="font-display text-xl font-semibold text-ink">Thank you.</p>
        <p className="mt-2 text-sm text-ink/70">
          [SAMPLE] This form isn&apos;t connected yet — backend wiring comes in Phase 4.
        </p>
      </div>
    );
  }

  const field =
    "w-full rounded-lg border border-line bg-paper px-4 py-3 text-sm text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/30";

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setSent(true);
      }}
      className="grid gap-4"
    >
      <div className={compact ? "grid gap-4" : "grid gap-4 sm:grid-cols-2"}>
        <input className={field} placeholder="Your name" required aria-label="Your name" />
        <input className={field} type="email" placeholder="Work email" required aria-label="Work email" />
      </div>
      <div className={compact ? "grid gap-4" : "grid gap-4 sm:grid-cols-2"}>
        <input className={field} placeholder="Company" aria-label="Company" />
        <input className={field} placeholder="Phone (optional)" aria-label="Phone" />
      </div>
      <textarea
        className={field}
        rows={4}
        placeholder="What business problem can we help you solve?"
        aria-label="Your message"
      />
      <div>
        <Button type="submit" size="lg">
          Get in touch
        </Button>
      </div>
    </form>
  );
}
