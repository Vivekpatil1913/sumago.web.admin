import { CAPABILITY_ICONS, FALLBACK_CAPABILITY_ICON } from "@/lib/capability-icons";
import type { ServiceWithSlug } from "@/lib/services";

/**
 * THE ~5-SECOND "APP IN MOTION" REEL
 * ==================================
 *
 * A code-built stand-in for a product video, drawn entirely from tokens already
 * in the system — no MP4, no image request, no stock (CLAUDE.md). A handset
 * plays one 5-second loop: a feed, a metric that draws itself, and a
 * confirmation, with a notification arriving and the tab bar stepping across —
 * the shape of an app being used, without pretending to be a specific product.
 *
 * The whole thing is CSS: every element rides the same 5s timeline defined in
 * globals.css (`reel-*`). It ships zero JS and stays on the compositor
 * (opacity/transform only), so it costs nothing against the performance gate.
 *
 * MOTION EARNS ITS PLACE (docs/06): a phone is what this service produces, and a
 * still of one asks the reader to imagine it working; the loop shows it. Under
 * `prefers-reduced-motion` the global base layer snaps every loop to its end
 * frame — which is view A, a complete home screen — so it degrades to a clean
 * still rather than a frozen mid-transition. Decorative, so `aria-hidden`.
 */
/* A quiet placeholder row — icon tile beside two lines. Used across the feed.
   Declared at module scope: nested inside the component it would be a new
   component type on every render, which React treats as a remount. */
function Row({ dim = false }: { dim?: boolean }) {
  return (
    <div className="flex items-center gap-2.5 rounded-xl border border-white/[0.07] bg-white/[0.03] p-2.5">
      <span className="h-6 w-6 shrink-0 rounded-lg bg-white/10" />
      <span className="flex-1 space-y-1.5">
        <span className={`block h-1.5 rounded-full bg-white/20 ${dim ? "w-2/3" : "w-full"}`} />
        <span className="block h-1.5 w-1/2 rounded-full bg-white/10" />
      </span>
    </div>
  );
}

export function DeviceReel({ service }: { service: ServiceWithSlug }) {
  const Icon = CAPABILITY_ICONS[service.icon] ?? FALLBACK_CAPABILITY_ICON;

  return (
    <div aria-hidden className="relative mx-auto h-[36rem] w-full max-w-[30rem]">
      {/* the brand halo the handset sits in */}
      <span className="absolute inset-[6%] rounded-full bg-[radial-gradient(circle,rgba(215,52,56,0.2),transparent_65%)]" />

      {/* Centring wrapper carries the static transform; the handset inside owns
          the float, so the tile-float animation (also a transform) never
          overrides the centring. */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        {/* the handset — the DeviceComposition frame, scaled up. */}
        <div className="h-[34rem] w-[17rem] animate-[tile-float_7s_ease-in-out_infinite] rounded-[2.75rem] border border-white/15 bg-[linear-gradient(160deg,#161113,#0b0809)] p-2.5 shadow-[0_50px_90px_-40px_rgba(0,0,0,0.9)]">
          <div className="relative h-full w-full overflow-hidden rounded-[2.25rem] bg-[#0f0b0d]">
          {/* notch */}
          <span className="absolute left-1/2 top-2.5 z-20 h-1.5 w-14 -translate-x-1/2 rounded-full bg-white/15" />

          {/* header — app mark, title lines, a live pulse */}
          <div className="relative z-10 flex items-center gap-2.5 px-4 pt-9">
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-[linear-gradient(135deg,#d73438,#7a1519)]">
              <Icon size={15} strokeWidth={2} className="text-white" />
            </span>
            <span className="flex-1 space-y-1.5">
              <span className="block h-1.5 w-16 rounded-full bg-white/25" />
              <span className="block h-1.5 w-10 rounded-full bg-white/10" />
            </span>
            <span className="h-2 w-2 shrink-0 rounded-full bg-brand shadow-[0_0_10px_rgba(215,52,56,0.9)] motion-safe:animate-[build-pulse_1.6s_ease-in-out_infinite]" />
          </div>

          {/* stage — three views cross-faded on the 5s timeline */}
          <div className="relative mx-4 mt-4 h-[20rem]">
            {/* View A — the feed */}
            <div className="absolute inset-0 space-y-2.5 motion-safe:animate-[reel-a_5s_ease-in-out_infinite]">
              <div className="rounded-2xl border border-white/10 bg-[linear-gradient(150deg,rgba(215,52,56,0.28),rgba(215,52,56,0.05))] p-3">
                <span className="block h-1.5 w-12 rounded-full bg-white/35" />
                <span className="mt-2 block h-3.5 w-24 rounded-md bg-white/70" />
              </div>
              <Row />
              <Row dim />
              <Row />
            </div>

            {/* View B — a metric that draws itself */}
            <div className="absolute inset-0 motion-safe:animate-[reel-b_5s_ease-in-out_infinite]">
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3.5">
                <span className="block h-1.5 w-10 rounded-full bg-white/30" />
                <span className="mt-2.5 block h-4 w-20 rounded-md bg-white/80" />
                <svg viewBox="0 0 100 40" className="mt-3 h-16 w-full" fill="none">
                  <polyline
                    points="0,34 15,28 30,30 45,18 60,22 78,10 100,4"
                    stroke="#ff5a5d"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    pathLength={1}
                    strokeDasharray={1}
                    style={{ strokeDashoffset: 1 }}
                    className="motion-safe:animate-[reel-draw_5s_ease-in-out_infinite]"
                  />
                  <polyline
                    points="0,34 15,28 30,30 45,18 60,22 78,10 100,4 100,40 0,40"
                    fill="rgba(215,52,56,0.14)"
                  />
                </svg>
              </div>
              <div className="mt-2.5 grid grid-cols-2 gap-2.5">
                <div className="rounded-xl border border-white/[0.07] bg-white/[0.03] p-2.5">
                  <span className="block h-1.5 w-8 rounded-full bg-white/25" />
                  <span className="mt-2 block h-2.5 w-12 rounded bg-white/60" />
                </div>
                <div className="rounded-xl border border-white/[0.07] bg-white/[0.03] p-2.5">
                  <span className="block h-1.5 w-8 rounded-full bg-white/25" />
                  <span className="mt-2 block h-2.5 w-10 rounded bg-white/60" />
                </div>
              </div>
            </div>

            {/* View C — the confirmation */}
            <div className="absolute inset-0 flex flex-col items-center justify-center motion-safe:animate-[reel-c_5s_ease-in-out_infinite]">
              <span className="grid h-14 w-14 place-items-center rounded-full bg-[linear-gradient(135deg,#d73438,#7a1519)] shadow-[0_16px_36px_-14px_rgba(215,52,56,0.8)]">
                <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="#fff" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12.5l4.5 4.5L19 7" />
                </svg>
              </span>
              <span className="mt-5 block h-2 w-24 rounded-full bg-white/60" />
              <span className="mt-2.5 block h-1.5 w-16 rounded-full bg-white/20" />
            </div>
          </div>

          {/* notification — slides in over the feed, then leaves */}
          <div className="absolute inset-x-3 top-[4.75rem] z-30 rounded-xl border border-white/12 bg-white/[0.09] p-2.5 shadow-[0_18px_40px_-20px_rgba(0,0,0,0.9)] backdrop-blur-md motion-safe:animate-[reel-notif_5s_ease-in-out_infinite]">
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand shadow-[0_0_8px_rgba(215,52,56,0.9)]" />
              <span className="flex-1 space-y-1">
                <span className="block h-1 w-full rounded-full bg-white/40" />
                <span className="block h-1 w-1/2 rounded-full bg-white/15" />
              </span>
            </div>
          </div>

          {/* tab bar — four rests, one brand indicator stepping across three */}
          <div className="absolute inset-x-0 bottom-0 z-10 border-t border-white/10 bg-white/[0.05] py-3.5">
            <div className="relative mx-4 h-1.5">
              <div className="absolute inset-0 grid grid-cols-4">
                {[0, 1, 2, 3].map((t) => (
                  <span key={t} className="mx-auto h-1.5 w-6 rounded-full bg-white/15" />
                ))}
              </div>
              <div className="absolute left-0 top-0 h-full w-1/4 motion-safe:animate-[reel-tab_5s_ease-in-out_infinite]">
                <span className="mx-auto block h-1.5 w-6 rounded-full bg-brand shadow-[0_0_8px_rgba(215,52,56,0.8)]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}
