import { cn } from "@/lib/utils";

/** Small uppercase label that sits above a heading. */
export function Eyebrow({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      className={cn(
        "mb-4 text-sm font-bold uppercase tracking-[0.22em] text-brand-ink",
        className,
      )}
      {...props}
    />
  );
}
