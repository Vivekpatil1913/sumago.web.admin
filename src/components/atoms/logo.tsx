import Image from "next/image";
import Link from "next/link";

type LogoProps = {
  /** Rendered height in px; width scales with the logo aspect ratio (~8.8:1). */
  height?: number;
  priority?: boolean;
  className?: string;
};

const RATIO = 4768 / 542;

/**
 * Sumago wordmark logo, links to home.
 * [REAL ASSET NEEDED] — replace PNG with a vector (SVG) for crisp scaling.
 */
export function Logo({ height = 38, priority, className }: LogoProps) {
  const width = Math.round(height * RATIO);
  return (
    <Link href="/" aria-label="Sumago Infotech — home" className={className}>
      <Image
        src="/sumago-logo.png"
        alt="Sumago Infotech Pvt. Ltd."
        width={width}
        height={height}
        priority={priority}
        style={{ height, width: "auto" }}
      />
    </Link>
  );
}
