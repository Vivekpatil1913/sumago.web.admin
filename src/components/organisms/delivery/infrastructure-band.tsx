import {
  BatteryCharging,
  Cpu,
  DoorOpen,
  Fingerprint,
  HeartPulse,
  LayoutGrid,
  Mic,
  Monitor,
  Radio,
  Users,
  Video,
  Wifi,
  type LucideIcon,
} from "lucide-react";

import { facilityGroups } from "@/lib/content";
import { CapabilityMotif } from "./infrastructure/motifs";
import { PillarPanel } from "./infrastructure/panels";

const ICONS: Record<string, LucideIcon> = {
  Cpu,
  Monitor,
  Users,
  Mic,
  Wifi,
  Radio,
  BatteryCharging,
  LayoutGrid,
  Fingerprint,
  Video,
  DoorOpen,
  HeartPulse,
};

/**
 * One capability — icon, name, contextual motif, optional readout.
 *
 * The card is the interaction surface for its motif: `.sys-cap` is what the
 * `[data-anim]` rules in globals.css hang off, so hovering the card is what
 * starts the animation inside it.
 *
 * Deliberately *not* focusable. Making the card a tab stop would put twelve
 * dead stops in front of every keyboard user for the sake of revealing
 * decoration — the capability is the text, which is always visible, and the
 * motif adds no information a keyboard user would otherwise miss. The
 * `focus-within` variants stay because they cost nothing and keep the card
 * correct if it ever gains a real control.
 */
function Capability({
  name,
  motif,
  status,
  Icon,
  delay,
}: {
  name: string;
  motif: string;
  status?: string;
  Icon: LucideIcon;
  delay: number;
}) {
  return (
    <li
      data-aos="fade-up"
      data-aos-delay={delay}
      className="sys-cap group/cap relative isolate overflow-hidden rounded-2xl border border-line bg-paper p-5 shadow-[0_1px_2px_rgba(26,26,26,0.04)] transition-[transform,box-shadow,border-color] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] hover:border-brand/25 hover:shadow-[0_24px_48px_-28px_rgba(215,52,56,0.45)] motion-safe:hover:-translate-y-1"
    >
      {/* Accent line — draws across the card's top edge as it becomes active. */}
      <span
        aria-hidden
        className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-gradient-to-r from-brand via-brand to-transparent transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover/cap:scale-x-100 group-focus-within/cap:scale-x-100"
      />
      {/* Glow — kept behind the content and very low, so it warms rather than tints. */}
      <span
        aria-hidden
        className="pointer-events-none absolute -top-16 left-1/2 -z-10 h-32 w-40 -translate-x-1/2 rounded-full bg-brand/10 opacity-0 blur-2xl transition-opacity duration-500 group-hover/cap:opacity-100 group-focus-within/cap:opacity-100"
      />

      <div className="flex items-start justify-between gap-3">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-line bg-mist text-ink/65 transition-colors duration-300 group-hover/cap:border-brand/30 group-hover/cap:bg-brand group-hover/cap:text-white group-focus-within/cap:border-brand/30 group-focus-within/cap:bg-brand group-focus-within/cap:text-white">
          <Icon size={16} strokeWidth={2} aria-hidden />
        </span>
        {status ? (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-mist/70 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-ink/65">
            {/* Only a readout that says "Live" gets a pulse. A blinking dot on
                "Verified" or "Standby" would be motion with nothing behind it,
                and six pulsing pips would turn a status row into noise. */}
            <span
              aria-hidden
              {...(status === "Live" ? { "data-anim": "", "data-run": "always" } : {})}
              style={
                status === "Live"
                  ? ({
                      "--anim": "sys-blink",
                      "--dur": "2.2s",
                      "--ease": "ease-in-out",
                      "--iter": "infinite",
                    } as React.CSSProperties)
                  : undefined
              }
              className="h-1.5 w-1.5 rounded-full bg-success"
            />
            {status}
          </span>
        ) : null}
      </div>

      <p className="mt-4 text-[15px] font-semibold leading-snug text-ink">{name}</p>

      <div className="mt-3 flex justify-start opacity-45 transition-opacity duration-300 group-hover/cap:opacity-100 group-focus-within/cap:opacity-100">
        <CapabilityMotif motif={motif} />
      </div>
    </li>
  );
}

/**
 * The infrastructure band — the proof-of-capability half of beat 02.
 *
 * Read as three pillars rather than twelve amenities, because the question a
 * CTO is actually asking is "can you build, will you stay up, is it secure" —
 * a flat grid gives a seminar hall and a biometric reader the same weight and
 * answers none of them.
 *
 * The layout is editorial rather than three matched columns: each pillar is a
 * full-width row with its own live panel, and the rows alternate sides so the
 * eye zig-zags down the band instead of scanning three parallel lists. That
 * also gives mobile a natural reading order — identity, then the system, then
 * its capabilities — one pillar at a time, with no horizontal overflow and no
 * layout that needs to be "shrunk" to fit.
 *
 * Everything here is a server component. The interaction is CSS — hover and
 * `:focus-within` on the capability cards drive the motifs — so the band adds
 * no JavaScript to the route, and the only client code involved is the AOS
 * entrance the rest of the site already runs.
 */
export function InfrastructureBand() {
  return (
    <section className="relative isolate overflow-hidden bg-stage-warm py-16 md:py-22">
      <div className="container-page relative z-10">
        {/* ── Header ─────────────────────────────────────────────────────── */}
        <div className="max-w-3xl" data-aos="fade-up">
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-brand-ink">
            The engine behind every project
          </p>
          <h2 className="mt-4 text-balance font-bold tracking-tight text-ink text-[2rem]/[1.15] sm:text-4xl/[1.1]">
            Built for today&apos;s work.{" "}
            <span className="text-metal-red">Engineered for what&apos;s next.</span>
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-ink/60 sm:text-lg">
            From high-performance development environments to always-on connectivity and
            layered security, the infrastructure behind every engagement is built to keep
            teams productive, projects moving and client data protected.
          </p>
        </div>

        {/* ── System status ──────────────────────────────────────────────────
            The three pillars as a single readout, so the band opens with its
            own summary before anyone scrolls a pixel further. On wide screens
            a pulse crosses the spine between them — one signal reaching all
            three, which is the "provisioned identically" claim, drawn. */}
        <div
          data-aos="fade-up"
          data-aos-delay="80"
          className="mt-10 flex flex-col gap-4 rounded-2xl border border-line bg-paper/70 px-5 py-4 backdrop-blur-sm sm:flex-row sm:items-center sm:justify-between sm:gap-6"
        >
          <p className="flex items-center gap-2.5 text-sm font-semibold text-ink">
            <span className="relative flex h-2.5 w-2.5 shrink-0">
              <span
                aria-hidden
                data-anim=""
                data-run="always"
                style={
                  {
                    "--anim": "sys-wave",
                    "--dur": "2.4s",
                    "--ease": "ease-out",
                    "--iter": "infinite",
                  } as React.CSSProperties
                }
                className="absolute inset-0 rounded-full bg-success"
              />
              <span className="relative m-auto h-2 w-2 rounded-full bg-success" />
            </span>
            All systems operational
          </p>

          <div
            aria-hidden
            className="relative hidden h-px flex-1 overflow-hidden bg-line lg:block"
          >
            <span
              data-anim=""
              data-run="always"
              style={
                {
                  "--anim": "sys-spine",
                  "--dur": "9s",
                  "--ease": "linear",
                  "--iter": "infinite",
                } as React.CSSProperties
              }
              className="absolute inset-y-0 left-0 w-1/5 bg-gradient-to-r from-transparent via-brand to-transparent"
            />
          </div>

          <ul className="flex flex-wrap items-center gap-x-5 gap-y-2">
            {facilityGroups.map((g) => (
              <li
                key={g.key}
                className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-ink/65"
              >
                <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-brand/60" />
                {g.code}
              </li>
            ))}
          </ul>
        </div>

        {/* ── Pillars ────────────────────────────────────────────────────── */}
        <div className="mt-14 space-y-14 md:mt-16 md:space-y-20">
          {facilityGroups.map((group, g) => {
            /* Odd pillars put their panel on the right, so the band alternates
               rather than repeating one template three times. */
            const flipped = g % 2 === 1;
            return (
              <div
                key={group.key}
                className="grid items-start gap-8 lg:grid-cols-12 lg:gap-10"
              >
                {/* Identity + live panel */}
                <div
                  data-aos="fade-up"
                  className={`lg:col-span-5 ${flipped ? "lg:order-2" : ""}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold tracking-[0.12em] text-brand">
                      {group.index}
                    </span>
                    <span aria-hidden className="h-px w-8 bg-brand/35" />
                    <span className="text-xs font-bold uppercase tracking-[0.24em] text-ink/65">
                      {group.code}
                    </span>
                  </div>

                  <h3 className="mt-3 font-display text-2xl font-bold leading-tight text-ink sm:text-[1.75rem]">
                    {group.label}
                  </h3>
                  <p className="mt-2.5 text-base leading-relaxed text-ink/60">{group.detail}</p>

                  <div className="mt-6">
                    <PillarPanel pillar={group.key} />
                  </div>

                  <p className="mt-3 text-xs font-medium uppercase tracking-[0.14em] text-ink/65">
                    {group.note}
                  </p>
                </div>

                {/* Capabilities */}
                <ul
                  className={`grid gap-4 sm:grid-cols-2 lg:col-span-7 ${flipped ? "lg:order-1" : ""}`}
                >
                  {group.items.map((item, i) => (
                    <Capability
                      key={item.name}
                      name={item.name}
                      motif={item.motif}
                      status={item.status}
                      Icon={ICONS[item.icon] ?? Cpu}
                      delay={i * 70}
                    />
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
