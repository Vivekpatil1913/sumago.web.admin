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
          "text-balance font-bold tracking-tight",
          /* Line-height rides on the font-size utility (`/…`) rather than a
             separate `leading-*`: tailwind-merge treats font-size as
             conflicting with leading, so a `leading-*` listed before the sizes
             is stripped here — the h2 then inherited body's 20px and mobile
             headings overlapped. Per-step values also let the ratio loosen as
             the column narrows, which is what a 3-line mobile heading needs. */
          "text-[2rem]/[1.2] sm:text-4xl/[1.14] lg:text-5xl/[1.08]",
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
