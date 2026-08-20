import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * The two pieces every validated field on a public form needs: a label that
 * says it is required, and a message that says what is wrong.
 *
 * Both live here so the contact form and the apply form mark and explain a
 * field the same way — a red asterisk means the same thing on either, and a
 * message always appears in the same place relative to the input.
 */

/**
 * A field label that states whether the field is required.
 *
 * Required is the default and carries the red asterisk. An optional field says
 * so in words instead — on a form where everything else is marked, an unmarked
 * label is ambiguous rather than reassuring.
 */
export function FieldLabel({
  htmlFor,
  children,
  optional = false,
  className,
}: {
  htmlFor: string;
  children: React.ReactNode;
  optional?: boolean;
  className?: string;
}) {
  return (
    <label htmlFor={htmlFor} className={cn("text-sm font-medium text-ink/80", className)}>
      {children}
      {optional ? (
        <span className="ml-1.5 text-xs font-normal text-ink/50">(optional)</span>
      ) : (
        <>
          {/* Hidden from screen readers: an unread asterisk is noise, and the
              sr-only text below says the same thing in words. */}
          <span className="ml-0.5 text-brand" aria-hidden>
            *
          </span>
          <span className="sr-only"> (required)</span>
        </>
      )}
    </label>
  );
}

/** Sits directly under its field, so the fix is next to the problem. */
export function FieldMessage({
  id,
  message,
  className,
}: {
  id: string;
  message?: string;
  className?: string;
}) {
  if (!message) return null;
  return (
    <p
      id={id}
      role="alert"
      className={cn(
        "flex items-start gap-1.5 text-xs font-medium leading-relaxed text-brand",
        className,
      )}
    >
      <AlertCircle size={13} className="mt-0.5 shrink-0" aria-hidden />
      {message}
    </p>
  );
}
