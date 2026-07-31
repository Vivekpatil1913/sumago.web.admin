"use client";

/**
 * The Sumago mark used across the panel.
 *
 * The real logo is a raster asset with a lot of horizontal detail, which does
 * not survive being shrunk into a 32px sidebar rail. So the panel uses a
 * compact monogram built from the brand red, and shows the full wordmark only
 * where there is room for it — the sign-in screen and the expanded sidebar.
 */
import { cn } from "@/components/admin/ui";

export function SumagoMark({ size = 32, className }: { size?: number; className?: string }) {
  return (
    <span
      style={{ width: size, height: size }}
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-[0.5rem]",
        "bg-[linear-gradient(135deg,#e14c50_0%,#d73438_45%,#8f1418_100%)] text-white shadow-sm",
        className,
      )}
      aria-hidden
    >
      <span
        style={{ fontSize: size * 0.5 }}
        className="font-bold leading-none tracking-tight"
      >
        S
      </span>
      {/* A faint diagonal sheen, echoing the site's metallic treatments. */}
      <span className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,transparent_38%,rgba(255,255,255,0.35)_50%,transparent_62%)]" />
    </span>
  );
}

export function SumagoWordmark({
  compact = false,
  className,
}: {
  compact?: boolean;
  className?: string;
}) {
  return (
    <span className={cn("flex min-w-0 items-center gap-2.5", className)}>
      <SumagoMark size={compact ? 30 : 34} />
      {!compact ? (
        <span className="min-w-0 leading-tight">
          <span className="block truncate text-[15px] font-bold tracking-tight text-content">
            Sumago
          </span>
          <span className="block truncate text-[11px] font-medium text-muted">Admin panel</span>
        </span>
      ) : null}
    </span>
  );
}
