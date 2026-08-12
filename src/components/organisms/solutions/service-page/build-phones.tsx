import type { LucideIcon } from "lucide-react";

/**
 * 04 · WHAT WE BUILD — nine screens, one horizontal rail.
 *
 * Each thing that can be commissioned gets its own handset with a screen drawn
 * for what that app actually does — a feed, a storefront, a wallet, a live map,
 * a job checklist, a device panel — so the reader browses the range as real
 * product surfaces rather than a list of headings. The rail scrolls sideways and
 * bleeds off both edges, so it reads as a set you swipe through.
 *
 * Every screen is pure CSS/SVG from system tokens — no image, no stock, no JS
 * (CLAUDE.md), so nine mockups cost nothing against the performance gate. The
 * handsets are decorative (`aria-hidden`); each phone's caption carries the name.
 */

type PhoneItem = {
  icon: LucideIcon;
  title: string;
  purpose: string;
  features: string[];
};

/* Pick a screen layout from what the app is for. Falls back to a feed, so any
   service's build list still renders varied, sensible screens. */
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

type ScreenKind =
  | "feed"
  | "shop"
  | "wallet"
  | "map"
  | "health"
  | "device"
  | "checklist"
  | "dashboard"
  | "stats";

/* Shared primitives, kept terse so nine screens stay readable. */
const rowCls =
  "flex items-center gap-2.5 rounded-lg border border-white/[0.07] bg-white/[0.03] p-2";
const cardCls = "rounded-xl border border-white/10 bg-white/[0.04] p-3";

function ScreenBody({ kind }: { kind: ScreenKind }) {
  switch (kind) {
    case "shop":
      return (
        <div className="space-y-2.5">
          <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-2">
            <span className="h-2 w-2 rounded-full border border-white/30" />
            <span className="h-1.5 w-20 rounded-full bg-white/15" />
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
            <span className="block h-1.5 w-16 rounded-full bg-white/25" />
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
              <span className="block h-full w-2/3 rounded-full bg-brand" />
            </div>
          </div>
          {[0, 1].map((r) => (
            <div key={r} className={rowCls}>
              <span className="h-6 w-6 rounded-md bg-white/10" />
              <span className="h-1.5 w-24 rounded-full bg-white/15" />
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
            <span className="block h-1.5 w-12 rounded-full bg-white/25" />
            <span className="mt-2 block h-1.5 w-24 rounded-full bg-white/12" />
          </div>
          {[0, 1].map((r) => (
            <div key={r} className="flex items-center justify-between rounded-lg border border-white/[0.07] bg-white/[0.03] p-2">
              <span className="h-1.5 w-16 rounded-full bg-white/20" />
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
              <span className="block h-1.5 w-16 rounded-full bg-white/30" />
              <span className="block h-1.5 w-10 rounded-full bg-white/12" />
            </span>
            <span className="flex h-5 w-9 items-center rounded-full bg-brand p-0.5">
              <span className="ml-auto h-4 w-4 rounded-full bg-white" />
            </span>
          </div>
          <div className={cardCls}>
            <span className="block h-1.5 w-10 rounded-full bg-white/25" />
            <svg viewBox="0 0 100 34" className="mt-2 h-12 w-full" fill="none">
              <polyline points="0,28 20,20 40,24 60,10 80,16 100,4" stroke="#ff5a5d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          {[0, 1].map((r) => (
            <div key={r} className="rounded-lg border border-white/[0.07] bg-white/[0.03] p-2.5">
              <div className="flex justify-between">
                <span className="h-1.5 w-12 rounded-full bg-white/20" />
                <span className="h-1.5 w-6 rounded-full bg-white/15" />
              </div>
              <div className="mt-2 h-1 w-full rounded-full bg-white/10">
                <span className={`block h-full rounded-full bg-brand/70 ${r === 0 ? "w-1/2" : "w-3/4"}`} />
              </div>
            </div>
          ))}
        </div>
      );
    case "checklist":
      return (
        <div className="space-y-2.5">
          <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.04] p-2.5">
            <span className="h-1.5 w-16 rounded-full bg-white/30" />
            <span className="rounded-full bg-brand/20 px-2 py-1">
              <span className="block h-1 w-8 rounded-full bg-brand" />
            </span>
          </div>
          {[true, true, false, false].map((c, r) => (
            <div key={r} className={rowCls}>
              <span className={`grid h-5 w-5 shrink-0 place-items-center rounded-md ${c ? "bg-brand" : "border border-white/20"}`}>
                {c ? (
                  <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="#fff" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12.5l4 4L19 7" />
                  </svg>
                ) : null}
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
          <div className={cardCls}>
            <div className="flex h-16 items-end gap-1.5">
              {[40, 70, 50, 90, 60, 80].map((h, i) => (
                <span key={i} className={`flex-1 rounded-t ${i === 3 ? "bg-brand" : "bg-white/15"}`} style={{ height: `${h}%` }} />
              ))}
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
                <span className="h-1.5 w-12 rounded-full bg-white/20" />
                <span className="h-1.5 w-6 rounded-full bg-white/15" />
              </div>
              <div className="mt-2 h-1.5 w-full rounded-full bg-white/10">
                <span className="block h-full rounded-full bg-brand" style={{ width: `${w}%` }} />
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
                <span className="block h-1.5 w-full rounded-full bg-white/20" />
                <span className="block h-1.5 w-2/3 rounded-full bg-white/10" />
              </span>
            </div>
          ))}
        </div>
      );
  }
}

function Phone({ item, index }: { item: PhoneItem; index: number }) {
  const Icon = item.icon;
  return (
    <li className="shrink-0 snap-center">
      <figure className="w-[15rem]">
        <div
          aria-hidden
          className="relative h-[30rem] w-full rounded-[2.25rem] border border-white/15 bg-[linear-gradient(160deg,#161113,#0b0809)] p-2.5 shadow-[0_40px_80px_-40px_rgba(0,0,0,0.85)]"
        >
          <div className="relative flex h-full w-full flex-col overflow-hidden rounded-[1.85rem] bg-[#0f0b0d]">
            <span className="absolute left-1/2 top-2 z-20 h-1.5 w-14 -translate-x-1/2 rounded-full bg-white/15" />

            {/* header — mark, name, status */}
            <div className="flex items-center gap-2.5 px-3.5 pb-3 pt-8">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-[linear-gradient(135deg,#d73438,#7a1519)]">
                <Icon size={15} strokeWidth={2} className="text-white" />
              </span>
              <span className="min-w-0 flex-1 truncate text-[0.78rem] font-bold text-white">
                {item.title}
              </span>
              <span className="flex gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-white/30" />
                <span className="h-1.5 w-1.5 rounded-full bg-white/15" />
              </span>
            </div>

            {/* the screen */}
            <div className="flex-1 overflow-hidden px-3">
              <ScreenBody kind={screenFor(item.title)} />
            </div>

            {/* tab bar */}
            <div className="mt-auto flex items-center justify-around border-t border-white/10 bg-white/[0.05] px-4 py-3">
              <span className="h-1.5 w-6 rounded-full bg-brand" />
              {[0, 1, 2].map((t) => (
                <span key={t} className="h-1.5 w-6 rounded-full bg-white/15" />
              ))}
            </div>
          </div>
        </div>

        <figcaption className="mt-5 text-center">
          <span className="text-xs font-bold tabular-nums text-brand-ink">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="ml-2 text-sm font-semibold text-ink">{item.title}</span>
        </figcaption>
      </figure>
    </li>
  );
}

export function BuildPhones({ items }: { items: PhoneItem[] }) {
  if (!items.length) return null;
  return (
    <div className="no-scrollbar -mx-5 mt-14 overflow-x-auto md:-mx-8 md:mt-18">
      <ul className="flex snap-x snap-mandatory gap-8 px-5 pb-4 md:px-8">
        {items.map((item, i) => (
          <Phone key={item.title} item={item} index={i} />
        ))}
      </ul>
    </div>
  );
}
