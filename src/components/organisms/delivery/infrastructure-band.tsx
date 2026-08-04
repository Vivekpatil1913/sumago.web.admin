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
 * The infrastructure band — the second half of beat 02, and deliberately not a
 * beat of its own.
 *
 * Twelve amenities cannot carry a full pinned sequence; they are the supporting
 * detail under "where it's built", so they get a single quiet screen on the same
 * dark run instead of their own number. Releasing the pin here is also what
 * stops the page becoming three consecutive scroll-hijacks.
 *
 * Grouped into the three questions a buyer is actually asking — can you build,
 * will you stay up, is it secure — rather than the source design's flat 4×3
 * grid, which gave a seminar hall and a biometric reader identical weight.
 */
export function InfrastructureBand() {
  return (
    <section className="relative isolate overflow-hidden bg-stage-warm py-16 md:py-22">
      <div className="container-page relative z-10">
        <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-brand-ink">
              And what holds them up
            </p>
            <h2 className="mt-4 text-balance font-bold tracking-tight text-ink text-[2rem]/[1.15] sm:text-4xl/[1.1]">
              Nobody picks a partner for their power backup.{" "}
              <span className="text-ink/40">They only ever remember it.</span>
            </h2>
          </div>
          <p className="max-w-md text-base leading-relaxed text-ink/60">
            All three centres are provisioned identically, so where your project sits
            never changes what it can do — or who can reach the machines holding your
            data.
          </p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {facilityGroups.map((group, g) => (
            <div
              key={group.key}
              data-aos="fade-up"
              data-aos-delay={g * 80}
              className="flex flex-col rounded-2xl border border-line bg-paper p-6 sm:p-7"
            >
              <h3 className="font-display text-xl font-bold leading-snug text-ink">
                {group.label}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink/55">{group.note}</p>

              <ul className="mt-6 grid flex-1 gap-2.5 border-t border-line pt-6 sm:grid-cols-2 lg:grid-cols-1">
                {group.items.map((item) => {
                  const Icon = ICONS[item.icon] ?? Cpu;
                  return (
                    <li
                      key={item.name}
                      className="flex items-center gap-3 rounded-xl bg-mist px-4 py-3"
                    >
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-brand text-white">
                        <Icon size={16} strokeWidth={2} aria-hidden />
                      </span>
                      <span className="text-sm font-semibold leading-snug text-ink">
                        {item.name}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
