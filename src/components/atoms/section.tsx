import { cn } from "@/lib/utils";

type SectionProps = React.ComponentProps<"section"> & {
  /** Muted background for visual rhythm between sections. */
  muted?: boolean;
  /** Dark (ink) background for cinematic moments. */
  dark?: boolean;
};

/** Full-width section with consistent vertical rhythm + a centered container. */
export function Section({ muted, dark, className, children, ...props }: SectionProps) {
  return (
    <section
      className={cn(
        "py-16 md:py-22",
        muted && "bg-mist",
        dark && "bg-ink text-white",
        className,
      )}
      {...props}
    >
      <div className="container-page">{children}</div>
    </section>
  );
}
