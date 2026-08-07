import Image from "next/image";
import { Briefcase, Cpu, MapPin, type LucideIcon } from "lucide-react";

import { PinnedSequence } from "@/components/organisms/delivery/pinned-sequence";
import { deliveryCentres } from "@/lib/content";
import { cn } from "@/lib/utils";

const ICONS: Record<string, LucideIcon> = { Cpu, Briefcase, MapPin };

/** [VERIFY] — floor areas are unconfirmed; see the note in lib/content.ts. */
const VERIFY_HINT = "[VERIFY] Floor area not yet confirmed against COMPANY-PROFILE.md";


/**
 * Beat 02 — the three delivery centres, one per stage.
 *
 * Presented as a tour rather than a directory: you arrive at each building,
 * it fills the frame, and the rail shows where it sits in the network. Three
 * cards side by side would have said the same thing and been read as none of
 * them.
 *
 * The *capability* view of the premises lives here (role, scale, what the site
 * can do); the *visit* view (address, phone line, map) stays on /contact, which
 * already renders it from the Office Addresses module. The source design duplicated the
 * addresses across two sections, and two copies of an address is two things to
 * keep in sync.
 */
export function BeatBuilt() {
  return (
    <PinnedSequence
      number="02"
      kicker="Where it's built"
      title={
        <>
          Three floors,{" "}
          <span className="text-metal-red">one operation.</span>
        </>
      }
      standfirst="Engineering depth in Nashik, western-Maharashtra reach from Pune — and no single building your project depends on."
      vhPerStage={95}
      /* Cool graphite against beat 01's warm charcoal — back-to-back pinned
         sequences in the same temperature read as one endless section. */
      tone="cool"
      entries={deliveryCentres.map((centre) => ({
        key: centre.key,
        label: centre.locality,
        sublabel: centre.city,
      }))}
      stages={deliveryCentres.map((centre) => {
        const Icon = ICONS[centre.icon] ?? MapPin;
        return (
          <div
            key={centre.key}
            className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-14"
          >
            <div>
              <div className="flex items-center gap-3">
                <span
                  className={cn(
                    "grid h-11 w-11 shrink-0 place-items-center rounded-xl text-white",
                    centre.lead ? "bg-brand" : "bg-ink",
                  )}
                >
                  <Icon size={20} strokeWidth={2} aria-hidden />
                </span>
                <span
                  className={cn(
                    "rounded-full px-3 py-1 text-[0.625rem] font-bold uppercase tracking-[0.14em]",
                    centre.lead ? "bg-brand/10 text-brand-ink" : "bg-mist text-ink/55",
                  )}
                >
                  {centre.role}
                </span>
              </div>

              <h3 className="mt-6 text-balance font-display font-bold tracking-tight text-ink text-3xl/[1.12] lg:text-[2.75rem]/[1.06]">
                {centre.locality}
                <span className="block text-ink/40">{centre.city}</span>
              </h3>

              <p
                title={VERIFY_HINT}
                className="mt-5 font-display text-2xl font-bold text-metal-red lg:text-3xl"
              >
                {centre.area}
              </p>

              <ul className="mt-7 space-y-3 border-t border-line pt-6">
                {centre.capabilities.map((capability) => (
                  <li
                    key={capability}
                    className="flex items-start gap-3 text-base leading-relaxed text-ink/70"
                  >
                    <span
                      aria-hidden
                      className={cn(
                        "mt-2 h-1.5 w-1.5 shrink-0 rounded-full",
                        centre.lead ? "bg-brand" : "bg-ink/35",
                      )}
                    />
                    {capability}
                  </li>
                ))}
              </ul>
            </div>

            <div className="overflow-hidden rounded-2xl border border-line bg-paper">
              <Image
                src={centre.illustration}
                alt={centre.alt}
                width={640}
                height={420}
                unoptimized
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="h-auto w-full"
              />
            </div>
          </div>
        );
      })}
    />
  );
}
