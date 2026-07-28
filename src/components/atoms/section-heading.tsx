import { cn } from "@/lib/utils";
import { Eyebrow } from "./eyebrow";

type SectionHeadingProps = {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: "left" | "center";
  /** `dark` recolors the title/description/eyebrow for dark section backgrounds. */
  tone?: "light" | "dark";
  /** Widen the block (max-w-5xl) so long titles can hold a single line. */
  wide?: boolean;
  className?: string;
};

/** Eyebrow + title + optional description block used to open a section. */
export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  tone = "light",
  wide = false,
  className,
}: SectionHeadingProps) {
  const dark = tone === "dark";
  return (
    <div
      data-aos="fade-up"
      className={cn(
        wide ? "max-w-5xl" : "max-w-3xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow ? (
        <Eyebrow className={cn(dark && "text-brand-bright")}>{eyebrow}</Eyebrow>
      ) : null}
      <h2
        className={cn(
          "text-balance font-bold leading-[1.08] tracking-tight",
          "text-[2rem] sm:text-4xl lg:text-5xl",
          dark ? "text-white" : "text-ink",
        )}
      >
        {title}
      </h2>
      {description ? (
        <p
          className={cn(
            "mt-5 max-w-2xl text-lg leading-relaxed",
            dark ? "text-white/70" : "text-ink/65",
            align === "center" && "mx-auto",
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
