import { Check } from "lucide-react";

/**
 * 04 · THE MOCKS — the thing each service builds, drawn in code.
 *
 * Section 04 shows one commissionable item at a time beside a mock of it. The
 * mock is the only part of the page that changes shape per service: a phone for
 * a phone service, a browser window for a web platform, a dashboard for
 * analytics, a pipeline for DevOps (docs: the service-page design guide).
 * Everything around it — the slider, the copy, the capability chips, the
 * markers — is identical for all fifteen.
 *
 * ## Two frames, one language
 *
 * `PhoneFrame` is the handset. `WindowFrame` is everything else. They are
 * deliberately the same object at different aspect ratios: the same border and
 * gradient, the same brand halo, the same float, the same header (glyph tile,
 * title, live dot) and the same footer strip. A visitor moving between two
 * service pages sees the same design, not two designs.
 *
 * ## The bodies
 *
 * Each body is original CSS/SVG built from the tokens already in the system —
 * no image, no stock (CLAUDE.md). They are placeholders in the honest sense:
 * they show the *shape* of the thing (a ledger has blocks and transactions, a
 * test board has suites and a coverage meter) without claiming to be a specific
 * customer's screen.
 *
 * Everything animates on the compositor only (opacity / transform), and the
 * re-key on `active` is the same 450ms `build-stage-in` the panel beside it
 * uses, so the mock and its copy change together.
 *
 * ## Per-slide variation
 *
 * A body reads `active` and shifts what it emphasises — which row is live,
 * which stage is running, how the bars sit. The frame and the layout hold; the
 * state moves. That is what keeps six slides from looking like one static
 * picture without needing six bespoke drawings per service.
 */

export type MockKind =
  | "phone"
  | "browser"
  | "analytics"
  | "blueprint"
  | "board"
  | "bi"
  | "ledger"
  | "assistant"
  | "team"
  | "telemetry"
  | "console"
  | "multi"
  | "pipeline"
  | "canvas"
  | "testboard";

/* -------------------------------------------------------------------------- */
/*  Shared vocabulary                                                          */
/* -------------------------------------------------------------------------- */

const panel = "rounded-xl border border-white/10 bg-white/[0.04] p-3";
const soft = "rounded-lg border border-white/[0.07] bg-white/[0.03] p-2.5";

/** A line of "text". Width is a Tailwind class so it stays on the design scale. */
function Bar({ w, tone = "mid" }: { w: string; tone?: "strong" | "mid" | "faint" | "brand" }) {
  const bg =
    tone === "strong"
      ? "bg-white/40"
      : tone === "faint"
        ? "bg-white/10"
        : tone === "brand"
          ? "bg-brand"
          : "bg-white/20";
  return <span className={`block h-1.5 rounded-full ${w} ${bg}`} />;
}

/** A number-ish block — the "value" in a KPI tile. */
function Value({ w = "w-12" }: { w?: string }) {
  return <span className={`block h-4 rounded ${w} bg-white/75`} />;
}

/** A progress/meter track with a brand fill. */
function Meter({ pct, tone = "brand" }: { pct: number; tone?: "brand" | "good" }) {
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
      <span
        className={`block h-full rounded-full ${tone === "good" ? "bg-emerald-400/80" : "bg-brand"}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

/** A trend line. `seed` shifts the shape so consecutive slides differ. */
function Spark({ seed, className = "h-12" }: { seed: number; className?: string }) {
  const pts = [28, 20, 24, 10, 16, 4].map((y, i) => {
    const shifted = Math.max(3, Math.min(30, y + ((seed * 7 + i * 5) % 11) - 5));
    return `${i * 20},${shifted}`;
  });
  return (
    <svg viewBox="0 0 100 34" className={`w-full ${className}`} fill="none" aria-hidden>
      <polyline
        points={pts.join(" ")}
        stroke="#ff5a5d"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** A column chart. The `live` column carries the brand. */
function Bars({ live, heights }: { live: number; heights: number[] }) {
  return (
    <div className="flex h-full items-end gap-1.5">
      {heights.map((h, i) => (
        <span
          key={i}
          className={`flex-1 rounded-t ${i === live ? "bg-brand" : "bg-white/15"}`}
          style={{ height: `${h}%` }}
        />
      ))}
    </div>
  );
}

/** A status pill — the small coloured state marker used across the mocks. */
function Pill({ tone = "brand", w = "w-8" }: { tone?: "brand" | "good" | "warn" | "mute"; w?: string }) {
  const bg =
    tone === "good"
      ? "bg-emerald-400/80"
      : tone === "warn"
        ? "bg-amber-400/80"
        : tone === "mute"
          ? "bg-white/20"
          : "bg-brand";
  return <span className={`block h-1.5 rounded-full ${w} ${bg}`} />;
}

/* -------------------------------------------------------------------------- */
/*  The frames                                                                 */
/* -------------------------------------------------------------------------- */

/** The header both frames share — glyph tile, title, live dot. */
function FrameHeader({ title, glyph }: { title: string; glyph: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2.5 px-4 pb-3 pt-3.5">
      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-[linear-gradient(135deg,#d73438,#7a1519)]">
        {glyph}
      </span>
      <span className="min-w-0 flex-1 truncate text-[0.8rem] font-bold text-white">
        {title}
      </span>
      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand shadow-[0_0_8px_rgba(215,52,56,0.9)] motion-safe:animate-[build-pulse_1.6s_ease-in-out_infinite]" />
    </div>
  );
}

/** The footer strip both frames share. */
function FrameFooter() {
  return (
    <div className="mt-auto flex items-center justify-around border-t border-white/10 bg-white/[0.05] px-4 py-3.5">
      <span className="h-1.5 w-6 rounded-full bg-brand" />
      {[0, 1, 2].map((t) => (
        <span key={t} className="h-1.5 w-6 rounded-full bg-white/15" />
      ))}
    </div>
  );
}

/**
 * The handset. Decorative — the panel and markers beside it are the interface —
 * so it is aria-hidden. Re-keys with the active item to cross-fade.
 */
function PhoneFrame({
  title,
  glyph,
  active,
  children,
}: {
  title: string;
  glyph: React.ReactNode;
  active: number;
  children: React.ReactNode;
}) {
  return (
    <div aria-hidden className="relative h-[34rem] w-[16.5rem] shrink-0">
      <span className="absolute -inset-8 rounded-full bg-[radial-gradient(circle,rgba(215,52,56,0.2),transparent_66%)]" />
      <div className="relative h-full w-full rounded-[2.5rem] border border-white/15 bg-[linear-gradient(160deg,#161113,#0b0809)] p-2.5 shadow-[0_50px_90px_-40px_rgba(0,0,0,0.9)] motion-safe:animate-[tile-float_7s_ease-in-out_infinite]">
        <div className="relative flex h-full w-full flex-col overflow-hidden rounded-[2.05rem] bg-[#0f0b0d]">
          <span className="absolute left-1/2 top-2.5 z-20 h-1.5 w-14 -translate-x-1/2 rounded-full bg-white/15" />
          <div
            key={active}
            className="flex h-full flex-col motion-safe:animate-[build-stage-in_450ms_var(--ease-entrance)_both]"
          >
            <div className="pt-[1.15rem]">
              <FrameHeader title={title} glyph={glyph} />
            </div>
            <div className="flex-1 overflow-hidden px-3.5">{children}</div>
            <FrameFooter />
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * The window — a desktop surface for every service a handset doesn't suit.
 *
 * Width is capped rather than fixed so it survives the mobile column, where the
 * slider drops the mock inline between the brief and the capability chips.
 */
function WindowFrame({
  title,
  glyph,
  active,
  children,
}: {
  title: string;
  glyph: React.ReactNode;
  active: number;
  children: React.ReactNode;
}) {
  return (
    <div aria-hidden className="relative w-full max-w-[29rem] lg:w-[26rem] xl:w-[29rem]">
      <span className="absolute -inset-8 rounded-full bg-[radial-gradient(circle,rgba(215,52,56,0.2),transparent_66%)]" />
      <div className="relative w-full rounded-[1.5rem] border border-white/15 bg-[linear-gradient(160deg,#161113,#0b0809)] p-2.5 shadow-[0_50px_90px_-40px_rgba(0,0,0,0.9)] motion-safe:animate-[tile-float_7s_ease-in-out_infinite]">
        <div className="relative flex h-[30rem] w-full flex-col overflow-hidden rounded-[1.1rem] bg-[#0f0b0d]">
          {/* window chrome — the desktop equivalent of the handset's notch */}
          <div className="flex items-center gap-1.5 border-b border-white/[0.07] px-4 py-2.5">
            <span className="h-2 w-2 rounded-full bg-white/20" />
            <span className="h-2 w-2 rounded-full bg-white/15" />
            <span className="h-2 w-2 rounded-full bg-white/10" />
            <span className="ml-2 h-3 flex-1 rounded-full bg-white/[0.06]" />
          </div>
          <div
            key={active}
            className="flex h-full flex-col overflow-hidden motion-safe:animate-[build-stage-in_450ms_var(--ease-entrance)_both]"
          >
            <FrameHeader title={title} glyph={glyph} />
            <div className="flex-1 overflow-hidden px-4">{children}</div>
            <FrameFooter />
          </div>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Phone bodies — Mobile App Engineering                                      */
/* -------------------------------------------------------------------------- */

type ScreenKind =
  | "feed" | "shop" | "wallet" | "map" | "health"
  | "device" | "checklist" | "dashboard" | "stats";

/** Which phone screen an app gets, chosen by what the app is for. */
function screenFor(title: string): ScreenKind {
  const t = title.toLowerCase();
  if (t.includes("commerce") || t.includes("shop") || t.includes("retail")) return "shop";
  if (t.includes("bank") || t.includes("finance") || t.includes("pay")) return "wallet";
  if (t.includes("logistic") || t.includes("fleet") || t.includes("deliver")) return "map";
  if (t.includes("health") || t.includes("care") || t.includes("clinic")) return "health";
  if (t.includes("iot") || t.includes("connected") || t.includes("device")) return "device";
  if (t.includes("field") || t.includes("service") || t.includes("inspect")) return "checklist";
  if (t.includes("enterprise") || t.includes("business") || t.includes("admin")) return "dashboard";
  if (t.includes("companion") || t.includes("fitness") || t.includes("track")) return "stats";
  return "feed";
}

const rowCls =
  "flex items-center gap-2.5 rounded-lg border border-white/[0.07] bg-white/[0.03] p-2";

function PhoneBody({ kind }: { kind: ScreenKind }) {
  switch (kind) {
    case "shop":
      return (
        <div className="space-y-2.5">
          <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-2">
            <span className="h-2 w-2 rounded-full border border-white/30" />
            <Bar w="w-20" tone="faint" />
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            {[0, 1, 2, 3].map((t) => (
              <div key={t} className="rounded-lg border border-white/[0.07] bg-white/[0.03] p-1.5">
                <span className="block aspect-square rounded-md bg-white/[0.06]" />
                <span className="mt-1.5 block h-1.5 w-10 rounded-full bg-white/20" />
                <span className="mt-1 block h-1.5 w-6 rounded-full bg-brand/70" />
              </div>
            ))}
          </div>
        </div>
      );
    case "wallet":
      return (
        <div className="space-y-2.5">
          <div className="rounded-xl bg-[linear-gradient(135deg,#d73438,#7a1519)] p-3 shadow-[0_16px_30px_-16px_rgba(215,52,56,0.8)]">
            <span className="block h-1.5 w-10 rounded-full bg-white/50" />
            <span className="mt-2 block h-4 w-28 rounded bg-white/90" />
            <div className="mt-3 flex gap-2">
              <span className="h-1.5 w-8 rounded-full bg-white/40" />
              <span className="h-1.5 w-6 rounded-full bg-white/40" />
            </div>
          </div>
          {[0, 1, 2].map((r) => (
            <div key={r} className="flex items-center justify-between rounded-lg border border-white/[0.07] bg-white/[0.03] p-2">
              <span className="flex items-center gap-2">
                <span className="h-6 w-6 rounded-full bg-white/10" />
                <span className="h-1.5 w-14 rounded-full bg-white/20" />
              </span>
              <span className={`h-1.5 w-8 rounded-full ${r === 0 ? "bg-brand/80" : "bg-white/25"}`} />
            </div>
          ))}
        </div>
      );
    case "map":
      return (
        <div className="space-y-2.5">
          <div className="relative h-32 overflow-hidden rounded-xl border border-white/10 bg-white/[0.03]">
            <svg viewBox="0 0 120 90" className="h-full w-full">
              <path d="M6 84 Q40 62 56 46 T114 10" fill="none" stroke="#ff5a5d" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="4 5" />
              <circle cx="6" cy="84" r="4" fill="#ff5a5d" />
              <circle cx="114" cy="10" r="4" fill="#fff" />
            </svg>
          </div>
          <div className="rounded-lg border border-white/[0.07] bg-white/[0.03] p-2.5">
            <Bar w="w-16" />
            <div className="mt-2">
              <Meter pct={66} />
            </div>
          </div>
          {[0, 1].map((r) => (
            <div key={r} className={rowCls}>
              <span className="h-6 w-6 rounded-md bg-white/10" />
              <Bar w="w-24" tone="faint" />
            </div>
          ))}
        </div>
      );
    case "health":
      return (
        <div className="space-y-3">
          <div className="flex justify-center pt-2">
            <div className="relative grid h-24 w-24 place-items-center">
              <svg viewBox="0 0 36 36" className="h-24 w-24 -rotate-90">
                <circle cx="18" cy="18" r="15" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="3" />
                <circle cx="18" cy="18" r="15" fill="none" stroke="#ff5a5d" strokeWidth="3" strokeDasharray="94" strokeDashoffset="30" strokeLinecap="round" />
              </svg>
              <span className="absolute h-3 w-8 rounded bg-white/80" />
            </div>
          </div>
          <div className="rounded-lg border border-white/[0.07] bg-white/[0.03] p-2.5">
            <Bar w="w-12" />
            <span className="mt-2 block h-1.5 w-24 rounded-full bg-white/[0.12]" />
          </div>
          {[0, 1].map((r) => (
            <div key={r} className="flex items-center justify-between rounded-lg border border-white/[0.07] bg-white/[0.03] p-2">
              <Bar w="w-16" />
              <span className="h-1.5 w-8 rounded-full bg-brand/70" />
            </div>
          ))}
        </div>
      );
    case "device":
      return (
        <div className="space-y-2.5">
          <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.04] p-3">
            <span className="space-y-1.5">
              <Bar w="w-16" tone="strong" />
              <Bar w="w-10" tone="faint" />
            </span>
            <span className="flex h-5 w-9 items-center rounded-full bg-brand p-0.5">
              <span className="ml-auto h-4 w-4 rounded-full bg-white" />
            </span>
          </div>
          <div className={panel}>
            <Bar w="w-10" />
            <Spark seed={2} />
          </div>
          {[0, 1].map((r) => (
            <div key={r} className="rounded-lg border border-white/[0.07] bg-white/[0.03] p-2.5">
              <div className="flex justify-between">
                <Bar w="w-12" />
                <Bar w="w-6" tone="faint" />
              </div>
              <div className="mt-2">
                <Meter pct={r === 0 ? 50 : 75} />
              </div>
            </div>
          ))}
        </div>
      );
    case "checklist":
      return (
        <div className="space-y-2.5">
          <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.04] p-2.5">
            <Bar w="w-16" tone="strong" />
            <span className="rounded-full bg-brand/20 px-2 py-1">
              <span className="block h-1 w-8 rounded-full bg-brand" />
            </span>
          </div>
          {[true, true, false, false].map((c, r) => (
            <div key={r} className={rowCls}>
              <span className={`grid h-5 w-5 shrink-0 place-items-center rounded-md ${c ? "bg-brand" : "border border-white/20"}`}>
                {c ? <Check size={12} strokeWidth={3} className="text-white" /> : null}
              </span>
              <span className={`h-1.5 flex-1 rounded-full ${c ? "bg-white/15" : "bg-white/25"}`} />
            </div>
          ))}
        </div>
      );
    case "dashboard":
      return (
        <div className="space-y-2.5">
          <div className="grid grid-cols-2 gap-2.5">
            {[0, 1, 2, 3].map((t) => (
              <div key={t} className="rounded-lg border border-white/[0.07] bg-white/[0.03] p-2.5">
                <span className="block h-3 w-10 rounded bg-white/70" />
                <span className="mt-1.5 block h-1.5 w-14 rounded-full bg-white/15" />
              </div>
            ))}
          </div>
          <div className={panel}>
            <div className="h-16">
              <Bars live={3} heights={[40, 70, 50, 90, 60, 80]} />
            </div>
          </div>
        </div>
      );
    case "stats":
      return (
        <div className="space-y-3">
          <div className="rounded-xl border border-white/10 bg-white/[0.04] p-3 text-center">
            <span className="mx-auto block h-6 w-20 rounded bg-white/80" />
            <span className="mx-auto mt-2 block h-1.5 w-12 rounded-full bg-white/20" />
          </div>
          {[70, 45].map((w, i) => (
            <div key={i} className="rounded-lg border border-white/[0.07] bg-white/[0.03] p-2.5">
              <div className="flex justify-between">
                <Bar w="w-12" />
                <Bar w="w-6" tone="faint" />
              </div>
              <div className="mt-2">
                <Meter pct={w} />
              </div>
            </div>
          ))}
        </div>
      );
    default: // feed
      return (
        <div className="space-y-2.5">
          <div className="rounded-xl bg-[linear-gradient(150deg,rgba(215,52,56,0.32),rgba(215,52,56,0.05))] p-3">
            <span className="block h-1.5 w-10 rounded-full bg-white/40" />
            <span className="mt-2 block h-3 w-24 rounded bg-white/80" />
            <span className="mt-3 inline-block h-5 w-16 rounded-full bg-white/85" />
          </div>
          {[0, 1, 2].map((r) => (
            <div key={r} className="flex items-center gap-2.5 rounded-lg border border-white/[0.07] bg-white/[0.03] p-2">
              <span className="h-8 w-8 shrink-0 rounded-md bg-white/10" />
              <span className="flex-1 space-y-1.5">
                <Bar w="w-full" />
                <Bar w="w-2/3" tone="faint" />
              </span>
            </div>
          ))}
        </div>
      );
  }
}

/* -------------------------------------------------------------------------- */
/*  Window bodies — one per service                                            */
/* -------------------------------------------------------------------------- */

/** Web Platform Engineering — a browser rendering a web app. */
function BrowserBody({ active }: { active: number }) {
  return (
    <div className="space-y-3">
      {/* address bar + tabs */}
      <div className="flex items-center gap-2">
        <span className="h-6 flex-1 rounded-full border border-white/10 bg-white/[0.04]" />
        <span className="h-6 w-6 rounded-md bg-white/[0.06]" />
      </div>
      {/* the rendered page */}
      <div className="overflow-hidden rounded-xl border border-white/10 bg-white/[0.03]">
        <div className="flex items-center justify-between border-b border-white/[0.07] px-3 py-2.5">
          <span className="h-3 w-12 rounded bg-white/50" />
          <span className="flex gap-2">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className={`h-1.5 w-8 rounded-full ${i === active % 3 ? "bg-brand" : "bg-white/15"}`}
              />
            ))}
          </span>
        </div>
        <div className="space-y-2 bg-[linear-gradient(150deg,rgba(215,52,56,0.22),transparent)] p-3.5">
          <span className="block h-4 w-36 rounded bg-white/80" />
          <Bar w="w-28" tone="faint" />
          <span className="mt-1 inline-block h-6 w-20 rounded-full bg-white/85" />
        </div>
        <div className="grid grid-cols-3 gap-2 p-3">
          {[0, 1, 2].map((c) => (
            <div key={c} className="rounded-lg border border-white/[0.07] bg-white/[0.03] p-2">
              <span className="block aspect-[4/3] rounded bg-white/[0.06]" />
              <span className="mt-1.5 block h-1.5 w-full rounded-full bg-white/20" />
            </div>
          ))}
        </div>
      </div>
      {/* the performance budget, as a lighthouse-style read-out */}
      <div className={soft}>
        <div className="flex items-center justify-between">
          <Bar w="w-16" />
          <Pill tone="good" w="w-10" />
        </div>
        <div className="mt-2.5 grid grid-cols-3 gap-2">
          {[92, 100, 98].map((v, i) => (
            <div key={i} className="space-y-1.5">
              <Meter pct={v} tone={i === active % 3 ? "brand" : "good"} />
              <Bar w="w-8" tone="faint" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/** Digital Growth & Marketing — funnel, channels, spend vs return. */
function AnalyticsBody({ active }: { active: number }) {
  const funnel = [100, 72, 48, 26];
  return (
    <div className="space-y-3">
      <div className={panel}>
        <div className="flex items-center justify-between">
          <Bar w="w-20" />
          <Bar w="w-8" tone="faint" />
        </div>
        {/* acquisition funnel */}
        <div className="mt-3 space-y-1.5">
          {funnel.map((w, i) => (
            <div key={i} className="flex items-center gap-2">
              <span
                className={`block h-4 rounded ${i === active % 4 ? "bg-brand" : "bg-white/15"}`}
                style={{ width: `${w}%` }}
              />
              <span className="h-1.5 w-6 shrink-0 rounded-full bg-white/15" />
            </div>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2.5">
        <div className={soft}>
          <Bar w="w-10" tone="faint" />
          <Value w="w-14" />
          <span className="mt-1.5 block">
            <Pill tone="good" w="w-8" />
          </span>
        </div>
        <div className={soft}>
          <Bar w="w-10" tone="faint" />
          <Value w="w-12" />
          <span className="mt-1.5 block">
            <Pill tone="brand" w="w-6" />
          </span>
        </div>
      </div>
      <div className={soft}>
        <div className="flex items-center justify-between">
          <Bar w="w-14" />
          <Bar w="w-6" tone="faint" />
        </div>
        <Spark seed={active} className="h-14" />
      </div>
    </div>
  );
}

/** Technology Advisory — system map above Now / Next / Later lanes. */
function BlueprintBody({ active }: { active: number }) {
  return (
    <div className="space-y-3">
      <div className={`${panel} relative overflow-hidden`}>
        <svg viewBox="0 0 200 96" className="h-32 w-full" aria-hidden>
          {/* connections */}
          {[
            "M40 30 L100 30", "M100 30 L160 30", "M40 30 L40 70",
            "M40 70 L100 70", "M100 70 L160 70", "M100 30 L100 70",
          ].map((d, i) => (
            <path key={i} d={d} stroke="rgba(255,255,255,0.16)" strokeWidth="1.5" fill="none" />
          ))}
          {/* nodes */}
          {[[40, 30], [100, 30], [160, 30], [40, 70], [100, 70], [160, 70]].map(([cx, cy], i) => (
            <g key={i}>
              <rect
                x={cx - 16} y={cy - 10} width="32" height="20" rx="5"
                fill={i === active % 6 ? "#d73438" : "rgba(255,255,255,0.07)"}
                stroke={i === active % 6 ? "#ff6b6e" : "rgba(255,255,255,0.14)"}
                strokeWidth="1"
              />
              <rect x={cx - 8} y={cy - 2} width="16" height="3" rx="1.5" fill="rgba(255,255,255,0.55)" />
            </g>
          ))}
        </svg>
      </div>
      {/* roadmap lanes */}
      <div className="space-y-2">
        {[0, 1, 2].map((lane) => (
          <div key={lane} className={soft}>
            <div className="flex items-center justify-between">
              <Bar w={lane === 0 ? "w-8" : lane === 1 ? "w-10" : "w-12"} />
              <span className="flex gap-1.5">
                {[0, 1, 2, 3].map((m) => (
                  <span
                    key={m}
                    className={`h-2 w-2 rounded-full ${
                      lane === active % 3 && m === 0 ? "bg-brand" : "bg-white/15"
                    }`}
                  />
                ))}
              </span>
            </div>
            <div className="mt-2">
              <Meter pct={lane === 0 ? 80 : lane === 1 ? 45 : 20} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Program & Delivery Management — status ribbon, kanban, timeline. */
function BoardBody({ active }: { active: number }) {
  const cols = [3, 2, 2, 4];
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.04] p-2.5">
        <Bar w="w-20" tone="strong" />
        <span className="flex items-center gap-1.5 rounded-full bg-emerald-400/15 px-2 py-1">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          <span className="block h-1 w-10 rounded-full bg-emerald-400/70" />
        </span>
      </div>
      <div className="grid grid-cols-4 gap-1.5">
        {cols.map((count, c) => (
          <div key={c} className="space-y-1.5 rounded-lg border border-white/[0.07] bg-white/[0.03] p-1.5">
            <span className={`block h-1 w-full rounded-full ${c === active % 4 ? "bg-brand" : "bg-white/20"}`} />
            {Array.from({ length: count }, (_, i) => (
              <span key={i} className="block h-6 rounded bg-white/[0.07]" />
            ))}
          </div>
        ))}
      </div>
      {/* milestone timeline */}
      <div className={soft}>
        <div className="relative mt-1 h-8">
          <span className="absolute left-0 right-0 top-3.5 h-px bg-white/15" />
          {[8, 34, 60, 86].map((x, i) => (
            <span
              key={i}
              className={`absolute top-2 h-3.5 w-3.5 -translate-x-1/2 rounded-full border-2 ${
                i <= active % 4 ? "border-brand bg-brand" : "border-white/25 bg-[#0f0b0d]"
              }`}
              style={{ left: `${x}%` }}
            />
          ))}
        </div>
        <Spark seed={active + 3} className="h-10" />
      </div>
    </div>
  );
}

/** Data Analytics & Insights — KPI tiles, chart, table. */
function BiBody({ active }: { active: number }) {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-2">
        {[0, 1, 2].map((t) => (
          <div key={t} className={`${soft} !p-2`}>
            <Bar w="w-8" tone="faint" />
            <span className="mt-1.5 block">
              <Value w={t === active % 3 ? "w-12" : "w-10"} />
            </span>
          </div>
        ))}
      </div>
      <div className={panel}>
        <div className="flex items-center justify-between">
          <Bar w="w-16" />
          <span className="flex gap-1.5">
            <span className="h-1.5 w-6 rounded-full bg-brand" />
            <span className="h-1.5 w-6 rounded-full bg-white/15" />
          </span>
        </div>
        <div className="mt-3 h-20">
          <Bars live={active % 7} heights={[45, 62, 38, 74, 55, 88, 50]} />
        </div>
      </div>
      {/* the table under the charts */}
      <div className={soft}>
        {[0, 1, 2].map((r) => (
          <div
            key={r}
            className={`flex items-center justify-between py-1.5 ${r < 2 ? "border-b border-white/[0.06]" : ""}`}
          >
            <Bar w="w-20" tone={r === active % 3 ? "strong" : "mid"} />
            <Bar w="w-10" tone="faint" />
            <Pill tone={r === 0 ? "good" : "mute"} w="w-6" />
          </div>
        ))}
      </div>
    </div>
  );
}

/** Blockchain Solutions — linked blocks, transactions, wallet. */
function LedgerBody({ active }: { active: number }) {
  return (
    <div className="space-y-3">
      {/* the chain */}
      <div className="flex items-center gap-1.5">
        {[0, 1, 2, 3].map((b) => (
          <div key={b} className="flex flex-1 items-center gap-1.5">
            <div
              className={`flex-1 rounded-lg border p-2 ${
                b === active % 4
                  ? "border-brand/60 bg-brand/15"
                  : "border-white/10 bg-white/[0.04]"
              }`}
            >
              <span className="block h-1 w-full rounded-full bg-white/25" />
              <span className="mt-1.5 block h-1 w-2/3 rounded-full bg-white/15" />
            </div>
            {b < 3 ? <span className="h-px w-2 shrink-0 bg-white/25" /> : null}
          </div>
        ))}
      </div>
      {/* wallet card */}
      <div className="rounded-xl bg-[linear-gradient(135deg,#d73438,#7a1519)] p-3 shadow-[0_16px_30px_-16px_rgba(215,52,56,0.8)]">
        <span className="block h-1.5 w-12 rounded-full bg-white/50" />
        <span className="mt-2 block h-4 w-24 rounded bg-white/90" />
        <span className="mt-2.5 block h-1.5 w-32 rounded-full bg-white/35" />
      </div>
      {/* signed transactions */}
      <div className="space-y-1.5">
        {[0, 1, 2, 3].map((r) => (
          <div key={r} className="flex items-center gap-2 rounded-lg border border-white/[0.07] bg-white/[0.03] p-2">
            <span className="grid h-5 w-5 shrink-0 place-items-center rounded-md bg-brand/20">
              <Check size={11} strokeWidth={3} className="text-brand" />
            </span>
            <span className="flex-1 space-y-1">
              <Bar w="w-full" tone="faint" />
              <Bar w="w-1/3" tone="faint" />
            </span>
            <Pill tone={r === 0 ? "good" : "mute"} w="w-6" />
          </div>
        ))}
      </div>
    </div>
  );
}

/** AI & Intelligent Automation — grounded answer + automation flow. */
function AssistantBody({ active }: { active: number }) {
  return (
    <div className="space-y-3">
      {/* the question */}
      <div className="flex justify-end">
        <span className="w-2/3 rounded-2xl rounded-br-sm bg-white/[0.09] p-2.5">
          <Bar w="w-full" tone="faint" />
          <span className="mt-1.5 block">
            <Bar w="w-2/3" tone="faint" />
          </span>
        </span>
      </div>
      {/* the grounded answer, with its citation */}
      <div className="rounded-2xl rounded-bl-sm border border-brand/25 bg-brand/[0.08] p-2.5">
        <Bar w="w-full" />
        <span className="mt-1.5 block">
          <Bar w="w-5/6" tone="faint" />
        </span>
        <span className="mt-2 flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-sm bg-brand/70" />
          <span className="block h-1 w-16 rounded-full bg-brand/60" />
        </span>
      </div>
      {/* the automation flow underneath */}
      <div className={panel}>
        <Bar w="w-12" tone="faint" />
        <div className="mt-2.5 flex items-center gap-1.5">
          {[0, 1, 2, 3].map((n) => (
            <div key={n} className="flex flex-1 items-center gap-1.5">
              <span
                className={`grid h-8 flex-1 place-items-center rounded-lg border ${
                  n === active % 4
                    ? "border-brand/60 bg-brand/20"
                    : "border-white/10 bg-white/[0.04]"
                }`}
              >
                <span
                  className={`block h-1 w-5 rounded-full ${n === active % 4 ? "bg-brand" : "bg-white/25"}`}
                />
              </span>
              {n < 3 ? <span className="h-px w-2 shrink-0 bg-white/20" /> : null}
            </div>
          ))}
        </div>
        {/* the human-in-the-loop step */}
        <div className="mt-2.5 flex items-center gap-2 rounded-lg border border-white/[0.07] bg-white/[0.03] p-2">
          <span className="h-5 w-5 rounded-full bg-white/10" />
          <Bar w="w-24" tone="faint" />
          <span className="ml-auto">
            <Pill tone="warn" w="w-6" />
          </span>
        </div>
      </div>
    </div>
  );
}

/** Managed Outsourcing — the team present, and their tracked output. */
function TeamBody({ active }: { active: number }) {
  return (
    <div className="space-y-3">
      {/* who is in today */}
      <div className={panel}>
        <div className="flex items-center justify-between">
          <Bar w="w-16" />
          <span className="flex items-center gap-1.5 rounded-full bg-emerald-400/15 px-2 py-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            <span className="block h-1 w-8 rounded-full bg-emerald-400/70" />
          </span>
        </div>
        <div className="mt-3 grid grid-cols-4 gap-2">
          {[0, 1, 2, 3].map((p) => (
            <div key={p} className="flex flex-col items-center gap-1.5">
              <span
                className={`h-9 w-9 rounded-full border-2 ${
                  p === active % 4 ? "border-brand bg-brand/25" : "border-white/15 bg-white/[0.07]"
                }`}
              />
              <span className="block h-1 w-8 rounded-full bg-white/15" />
            </div>
          ))}
        </div>
      </div>
      {/* the tracked output */}
      <div className={soft}>
        <div className="flex items-center justify-between">
          <Bar w="w-14" />
          <Bar w="w-8" tone="faint" />
        </div>
        <div className="mt-2.5 space-y-2">
          {[78, 54, 91].map((pct, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="h-1.5 w-10 shrink-0 rounded-full bg-white/15" />
              <Meter pct={pct} tone={i === active % 3 ? "brand" : "good"} />
            </div>
          ))}
        </div>
      </div>
      {/* the reporting cadence */}
      <div className="grid grid-cols-2 gap-2.5">
        {[0, 1].map((c) => (
          <div key={c} className={`${soft} !p-2`}>
            <Bar w="w-8" tone="faint" />
            <span className="mt-1.5 block">
              <Value w="w-10" />
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/** IoT & Connected Products — device tiles, telemetry, alerts. */
function TelemetryBody({ active }: { active: number }) {
  return (
    <div className="space-y-3">
      {/* device tiles with their toggles */}
      <div className="grid grid-cols-2 gap-2.5">
        {[0, 1].map((d) => {
          const on = d === active % 2;
          return (
            <div key={d} className={`${soft} !p-2.5`}>
              <div className="flex items-center justify-between">
                <span className="h-6 w-6 rounded-lg bg-white/10" />
                <span className={`flex h-4 w-7 items-center rounded-full p-0.5 ${on ? "bg-brand" : "bg-white/15"}`}>
                  <span className={`h-3 w-3 rounded-full bg-white ${on ? "ml-auto" : ""}`} />
                </span>
              </div>
              <span className="mt-2 block">
                <Bar w="w-14" />
              </span>
              <span className="mt-1.5 block">
                <Bar w="w-8" tone="faint" />
              </span>
            </div>
          );
        })}
      </div>
      {/* the live signal */}
      <div className={panel}>
        <div className="flex items-center justify-between">
          <Bar w="w-16" />
          <Value w="w-10" />
        </div>
        <Spark seed={active + 1} className="h-16" />
      </div>
      {/* an alert, and the fleet under it */}
      <div className="flex items-center gap-2 rounded-lg border border-brand/30 bg-brand/[0.08] p-2.5">
        <span className="h-2 w-2 shrink-0 rounded-full bg-brand motion-safe:animate-[build-pulse_1.6s_ease-in-out_infinite]" />
        <span className="flex-1 space-y-1">
          <Bar w="w-2/3" />
          <Bar w="w-1/3" tone="faint" />
        </span>
      </div>
      <div className="flex gap-1">
        {Array.from({ length: 12 }, (_, i) => (
          <span
            key={i}
            className={`h-1.5 flex-1 rounded-full ${i === (active * 3) % 12 ? "bg-brand" : "bg-white/12"}`}
          />
        ))}
      </div>
    </div>
  );
}

/** Enterprise Software Engineering — module nav, tiles, records table. */
function ConsoleBody({ active }: { active: number }) {
  return (
    <div className="flex h-full gap-2.5 pb-1">
      {/* module nav */}
      <div className="w-20 shrink-0 space-y-1.5 rounded-lg border border-white/[0.07] bg-white/[0.03] p-2">
        {[0, 1, 2, 3, 4, 5].map((m) => (
          <span
            key={m}
            className={`flex items-center gap-1.5 rounded px-1 py-1.5 ${
              m === active % 6 ? "bg-brand/20" : ""
            }`}
          >
            <span className={`h-2 w-2 rounded-sm ${m === active % 6 ? "bg-brand" : "bg-white/20"}`} />
            <span className="block h-1 flex-1 rounded-full bg-white/15" />
          </span>
        ))}
      </div>
      <div className="min-w-0 flex-1 space-y-2.5">
        {/* summary tiles */}
        <div className="grid grid-cols-3 gap-1.5">
          {[0, 1, 2].map((t) => (
            <div key={t} className="rounded-lg border border-white/[0.07] bg-white/[0.03] p-1.5">
              <span className="block h-1 w-6 rounded-full bg-white/15" />
              <span className="mt-1 block h-3 w-8 rounded bg-white/70" />
            </div>
          ))}
        </div>
        {/* records */}
        <div className={`${soft} !p-2`}>
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-1.5">
            <Bar w="w-10" tone="faint" />
            <Bar w="w-6" tone="faint" />
          </div>
          {[0, 1, 2, 3, 4, 5].map((r) => (
            <div key={r} className="flex items-center gap-2 py-1.5">
              <span className="h-3 w-3 rounded-sm border border-white/20" />
              <Bar w="flex-1" tone={r === active % 6 ? "strong" : "faint"} />
              <Pill tone={r % 3 === 0 ? "good" : r % 3 === 1 ? "warn" : "mute"} w="w-5" />
            </div>
          ))}
        </div>
        <div className={`${soft} !p-2`}>
          <div className="h-10">
            <Bars live={active % 6} heights={[50, 75, 45, 85, 60, 70]} />
          </div>
        </div>
      </div>
    </div>
  );
}

/** Product Engineering — web, phone and API sharing one data layer. */
function MultiBody({ active }: { active: number }) {
  return (
    <div className="space-y-3">
      <div className="flex items-end gap-2.5">
        {/* the web surface */}
        <div className="flex-1 overflow-hidden rounded-lg border border-white/10 bg-white/[0.04]">
          <div className="flex gap-1 border-b border-white/[0.07] px-2 py-1.5">
            {[0, 1, 2].map((i) => (
              <span key={i} className="h-1.5 w-1.5 rounded-full bg-white/20" />
            ))}
          </div>
          <div className="space-y-1.5 p-2">
            <span className="block h-2.5 w-16 rounded bg-white/70" />
            <Bar w="w-full" tone="faint" />
            <div className="grid grid-cols-2 gap-1.5 pt-1">
              {[0, 1].map((c) => (
                <span key={c} className="block h-8 rounded bg-white/[0.06]" />
              ))}
            </div>
          </div>
        </div>
        {/* the phone surface */}
        <div className="w-16 shrink-0 overflow-hidden rounded-xl border border-white/15 bg-[#131013] p-1.5">
          <span className="mx-auto block h-1 w-5 rounded-full bg-white/20" />
          <div className="mt-1.5 space-y-1">
            <span className="block h-6 rounded bg-[linear-gradient(150deg,rgba(215,52,56,0.4),transparent)]" />
            {[0, 1, 2].map((r) => (
              <span key={r} className="block h-2.5 rounded bg-white/[0.07]" />
            ))}
          </div>
        </div>
      </div>
      {/* the shared layer they both sit on */}
      <div className="relative">
        <div className="flex justify-center gap-10">
          {[0, 1].map((i) => (
            <span key={i} className="h-4 w-px bg-white/20" />
          ))}
        </div>
        <div className={`${panel} mt-1`}>
          <div className="flex items-center justify-between">
            <Bar w="w-16" />
            <Pill tone="good" w="w-8" />
          </div>
          <div className="mt-2.5 space-y-1.5">
            {[0, 1, 2].map((r) => (
              <div
                key={r}
                className={`flex items-center gap-2 rounded border px-2 py-1.5 ${
                  r === active % 3 ? "border-brand/50 bg-brand/10" : "border-white/[0.07] bg-white/[0.02]"
                }`}
              >
                <span className={`h-1 w-6 rounded-full ${r === active % 3 ? "bg-brand" : "bg-white/25"}`} />
                <Bar w="flex-1" tone="faint" />
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* what the release measured */}
      <div className="grid grid-cols-3 gap-2">
        {[0, 1, 2].map((k) => (
          <div key={k} className={`${soft} !p-2`}>
            <Bar w="w-6" tone="faint" />
            <span className="mt-1 block">
              <Value w="w-9" />
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Cloud & DevOps — pipeline stages, resource graphs, deploy log. */
function PipelineBody({ active }: { active: number }) {
  const stage = active % 4;
  return (
    <div className="space-y-3">
      {/* commit → build → test → deploy */}
      <div className="flex items-center gap-1">
        {[0, 1, 2, 3].map((s) => (
          <div key={s} className="flex flex-1 items-center gap-1">
            <div
              className={`flex-1 rounded-lg border p-2 text-center ${
                s < stage
                  ? "border-emerald-400/40 bg-emerald-400/10"
                  : s === stage
                    ? "border-brand/60 bg-brand/15"
                    : "border-white/10 bg-white/[0.04]"
              }`}
            >
              <span
                className={`mx-auto block h-2 w-2 rounded-full ${
                  s < stage
                    ? "bg-emerald-400"
                    : s === stage
                      ? "bg-brand motion-safe:animate-[build-pulse_1.6s_ease-in-out_infinite]"
                      : "bg-white/20"
                }`}
              />
              <span className="mx-auto mt-1.5 block h-1 w-6 rounded-full bg-white/20" />
            </div>
            {s < 3 ? <span className="h-px w-1.5 shrink-0 bg-white/20" /> : null}
          </div>
        ))}
      </div>
      {/* infra graphs */}
      <div className="grid grid-cols-2 gap-2.5">
        {[0, 1].map((g) => (
          <div key={g} className={`${soft} !p-2`}>
            <div className="flex items-center justify-between">
              <Bar w="w-8" tone="faint" />
              <Bar w="w-5" tone="faint" />
            </div>
            <Spark seed={active + g * 2} className="h-10" />
          </div>
        ))}
      </div>
      {/* the deploy log */}
      <div className="rounded-lg border border-white/[0.07] bg-black/40 p-2.5">
        {[0, 1, 2, 3, 4].map((l) => (
          <div key={l} className="flex items-center gap-2 py-1">
            <span className={`h-1 w-1 shrink-0 rounded-full ${l <= stage ? "bg-brand" : "bg-white/20"}`} />
            <span
              className={`block h-1 rounded-full ${l <= stage ? "bg-white/30" : "bg-white/10"}`}
              style={{ width: `${88 - l * 13}%` }}
            />
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between">
        <Bar w="w-16" tone="faint" />
        <Pill tone="good" w="w-10" />
      </div>
    </div>
  );
}

/** Experience Design — wireframe resolving into a styled UI, plus tokens. */
function CanvasBody({ active }: { active: number }) {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2.5">
        {/* the wireframe */}
        <div className="rounded-lg border border-dashed border-white/20 bg-white/[0.02] p-2">
          <span className="block h-2.5 w-12 rounded-sm bg-white/20" />
          <span className="mt-1.5 block h-10 rounded-sm bg-white/[0.06]" />
          <div className="mt-1.5 space-y-1">
            <Bar w="w-full" tone="faint" />
            <Bar w="w-2/3" tone="faint" />
          </div>
          <span className="mt-2 block h-4 w-12 rounded-sm bg-white/15" />
        </div>
        {/* the same screen, designed */}
        <div className="overflow-hidden rounded-lg border border-white/10 bg-white/[0.05]">
          <div className="bg-[linear-gradient(150deg,rgba(215,52,56,0.35),transparent)] p-2">
            <span className="block h-2.5 w-14 rounded bg-white/85" />
            <span className="mt-1.5 block h-8 rounded bg-white/[0.12]" />
          </div>
          <div className="space-y-1 p-2">
            <Bar w="w-full" />
            <Bar w="w-2/3" tone="faint" />
            <span className="mt-1.5 block h-5 w-14 rounded-full bg-brand" />
          </div>
        </div>
      </div>
      {/* the token panel */}
      <div className={panel}>
        <Bar w="w-12" tone="faint" />
        <div className="mt-2.5 flex items-center gap-1.5">
          {["bg-brand", "bg-white/80", "bg-white/40", "bg-white/20", "bg-white/10"].map((c, i) => (
            <span
              key={c}
              className={`h-6 flex-1 rounded ${c} ${i === active % 5 ? "ring-2 ring-brand/60 ring-offset-2 ring-offset-[#0f0b0d]" : ""}`}
            />
          ))}
        </div>
        <div className="mt-3 space-y-1.5">
          <span className="block h-3 w-24 rounded bg-white/70" />
          <span className="block h-2 w-16 rounded bg-white/40" />
          <Bar w="w-20" tone="faint" />
        </div>
      </div>
      {/* the component library */}
      <div className="grid grid-cols-4 gap-1.5">
        {[0, 1, 2, 3].map((c) => (
          <span
            key={c}
            className={`block h-8 rounded-lg border ${
              c === active % 4 ? "border-brand/50 bg-brand/10" : "border-white/[0.07] bg-white/[0.03]"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

/** Quality Engineering — a live test run, coverage, and the bug board. */
function TestboardBody({ active }: { active: number }) {
  const failing = active % 5;
  return (
    <div className="space-y-3">
      {/* the run */}
      <div className={panel}>
        <div className="flex items-center justify-between">
          <Bar w="w-16" />
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            <span className="block h-1 w-6 rounded-full bg-emerald-400/70" />
            <span className="h-1.5 w-1.5 rounded-full bg-brand" />
            <span className="block h-1 w-4 rounded-full bg-brand/70" />
          </span>
        </div>
        <div className="mt-2.5 space-y-1.5">
          {[0, 1, 2, 3, 4].map((s) => {
            const failed = s === failing;
            return (
              <div key={s} className="flex items-center gap-2">
                <span
                  className={`grid h-4 w-4 shrink-0 place-items-center rounded ${
                    failed ? "bg-brand" : "bg-emerald-400/80"
                  }`}
                >
                  {failed ? (
                    <span className="block h-0.5 w-2 rounded-full bg-white" />
                  ) : (
                    <Check size={10} strokeWidth={3} className="text-[#0f0b0d]" />
                  )}
                </span>
                <Bar w="flex-1" tone={failed ? "strong" : "faint"} />
                <span className="block h-1 w-5 rounded-full bg-white/15" />
              </div>
            );
          })}
        </div>
      </div>
      {/* coverage */}
      <div className={soft}>
        <div className="flex items-center justify-between">
          <Bar w="w-14" tone="faint" />
          <Value w="w-9" />
        </div>
        <div className="mt-2">
          <Meter pct={72 + (active % 4) * 6} tone="good" />
        </div>
      </div>
      {/* the bug board */}
      <div className="grid grid-cols-3 gap-1.5">
        {[3, 2, 4].map((count, c) => (
          <div key={c} className="space-y-1.5 rounded-lg border border-white/[0.07] bg-white/[0.03] p-1.5">
            <span
              className={`block h-1 w-full rounded-full ${
                c === 0 ? "bg-brand" : c === 1 ? "bg-amber-400/70" : "bg-emerald-400/70"
              }`}
            />
            {Array.from({ length: count }, (_, i) => (
              <span key={i} className="block h-5 rounded bg-white/[0.07]" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  The switch                                                                 */
/* -------------------------------------------------------------------------- */

/**
 * The mock for one slide. `kind` comes from the service; `title` and `glyph`
 * from the item being shown; `active` re-keys the frame so the mock cross-fades
 * in step with the copy beside it.
 */
export function BuildMock({
  kind,
  title,
  glyph,
  active,
}: {
  kind: MockKind;
  title: string;
  glyph: React.ReactNode;
  active: number;
}) {
  if (kind === "phone") {
    return (
      <PhoneFrame title={title} glyph={glyph} active={active}>
        <PhoneBody kind={screenFor(title)} />
      </PhoneFrame>
    );
  }

  const body = (() => {
    switch (kind) {
      case "browser": return <BrowserBody active={active} />;
      case "analytics": return <AnalyticsBody active={active} />;
      case "blueprint": return <BlueprintBody active={active} />;
      case "board": return <BoardBody active={active} />;
      case "bi": return <BiBody active={active} />;
      case "ledger": return <LedgerBody active={active} />;
      case "assistant": return <AssistantBody active={active} />;
      case "team": return <TeamBody active={active} />;
      case "telemetry": return <TelemetryBody active={active} />;
      case "console": return <ConsoleBody active={active} />;
      case "multi": return <MultiBody active={active} />;
      case "pipeline": return <PipelineBody active={active} />;
      case "canvas": return <CanvasBody active={active} />;
      case "testboard": return <TestboardBody active={active} />;
      default: return <BrowserBody active={active} />;
    }
  })();

  return (
    <WindowFrame title={title} glyph={glyph} active={active}>
      {body}
    </WindowFrame>
  );
}
