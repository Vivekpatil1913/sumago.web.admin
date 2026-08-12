/**
 * The three pillar panels — the band's one piece of always-on motion.
 *
 * The twelve capability motifs stay still until you reach for them, which
 * keeps an idle band at zero cost but also leaves it looking like a diagram.
 * These three carry the "this is a running system" impression on their own,
 * and three continuous animations is a budget that holds at 60fps where twelve
 * would not.
 *
 * Each answers its pillar's question with the thing that question is actually
 * about: a build streaming, a network carrying, a perimeter being read.
 * Decorative in the accessibility sense — the pillar's claim is the heading
 * and prose beside it — so all three are `aria-hidden`.
 */

/** Timing shorthand for the always-on nodes inside a panel. */
function loop(
  name: string,
  dur: string,
  o: { ease?: string; delay?: string; extra?: Record<string, string> } = {},
): React.CSSProperties {
  return {
    "--anim": name,
    "--dur": dur,
    "--ease": o.ease ?? "ease-in-out",
    "--delay": o.delay ?? "0s",
    "--iter": "infinite",
    ...o.extra,
  } as React.CSSProperties;
}

/** Panel chrome: technical grid, hairline frame, corner registration marks. */
function Frame({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <div
      aria-hidden
      className="relative isolate aspect-[16/11] w-full overflow-hidden rounded-2xl border border-line bg-paper shadow-[0_1px_2px_rgba(26,26,26,0.04)] sm:aspect-[16/9] lg:aspect-[4/3]"
    >
      <div className="sys-grid absolute inset-0" />
      {/* Registration marks — the drafting language, at the corners only. */}
      {[
        "left-3 top-3 border-l border-t",
        "right-3 top-3 border-r border-t",
        "left-3 bottom-3 border-b border-l",
        "right-3 bottom-3 border-b border-r",
      ].map((pos) => (
        <span key={pos} className={`absolute h-3 w-3 border-ink/15 ${pos}`} />
      ))}
      <span className="absolute left-4 top-4 text-[10px] font-bold uppercase tracking-[0.2em] text-ink/65">
        {label}
      </span>
      <div className="absolute inset-0 grid place-items-center px-6 pb-6 pt-10">{children}</div>
    </div>
  );
}

/**
 * 01 · Engineer — a build streaming through. The log scrolls under a mask on a
 * duplicated block, so it loops without a seam; the bar beneath it is the run
 * completing, over and over, which is what a development floor does all day.
 */
export function EngineerPanel() {
  const rows = [
    { w: 62, lit: true },
    { w: 40, lit: false },
    { w: 74, lit: false },
    { w: 52, lit: true },
    { w: 33, lit: false },
    { w: 68, lit: false },
    { w: 45, lit: true },
    { w: 58, lit: false },
  ];
  return (
    <Frame label="Build">
      <div className="w-full max-w-[300px]">
        <div className="relative h-[112px] overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,#000_18%,#000_82%,transparent)]">
          <div
            data-anim=""
            data-run="always"
            style={loop("sys-stream", "22s", { ease: "linear" })}
            className="absolute inset-x-0 top-0"
          >
            {[0, 1].map((copy) => (
              <div key={copy}>
                {rows.map((r, i) => (
                  <div key={`${copy}-${i}`} className="flex items-center gap-2 py-[5px]">
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand/45" />
                    <span
                      className={`h-[5px] rounded-full ${r.lit ? "bg-brand/70" : "bg-ink/12"}`}
                      style={{ width: `${r.w}%` }}
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-ink/8">
          <div
            data-anim=""
            data-run="always"
            style={loop("sys-fill", "6s", {
              ease: "cubic-bezier(0.4,0,0.2,1)",
              extra: { transformOrigin: "left center" },
            })}
            className="h-full w-full rounded-full bg-brand"
          />
        </div>
      </div>
    </Frame>
  );
}

/**
 * 02 · Connect — a hub carrying traffic to the floor. Coverage leaves the
 * centre as rings; the spokes carry a dash that never stops moving, because
 * "always-on" is the entire claim of this pillar.
 */
export function ConnectPanel() {
  const spokes = [
    { x: 34, y: 34 },
    { x: 106, y: 30 },
    { x: 24, y: 78 },
    { x: 116, y: 82 },
    { x: 70, y: 16 },
    { x: 70, y: 100 },
  ];
  return (
    <Frame label="Network">
      <svg
        viewBox="0 0 140 116"
        className="h-full max-h-[210px] w-full text-brand"
        aria-hidden
        focusable="false"
      >
        {/* Coverage leaving the hub. */}
        {["0s", "1.3s", "2.6s"].map((delay) => (
          <circle
            key={delay}
            cx="70"
            cy="58"
            r="44"
            fill="none"
            stroke="currentColor"
            strokeOpacity="0.28"
            strokeWidth="1.2"
            data-anim=""
            data-run="always"
            style={loop("sys-wave", "3.9s", {
              ease: "ease-out",
              delay,
              extra: { transformOrigin: "70px 58px" },
            })}
          />
        ))}

        {spokes.map((s, i) => (
          <g key={`${s.x}-${s.y}`}>
            <path
              d={`M70 58 L${s.x} ${s.y}`}
              stroke="currentColor"
              strokeOpacity="0.16"
              strokeWidth="1"
            />
            <path
              d={`M70 58 L${s.x} ${s.y}`}
              stroke="currentColor"
              strokeOpacity="0.55"
              strokeWidth="1.4"
              strokeDasharray="3 9"
              data-anim=""
              data-run="always"
              style={loop("sys-flow", `${2.2 + i * 0.35}s`, { ease: "linear" })}
            />
            <circle
              cx={s.x}
              cy={s.y}
              r="4"
              fill="currentColor"
              fillOpacity="0.55"
              data-anim=""
              data-run="always"
              style={loop("sys-blink", `${2.6 + i * 0.3}s`)}
            />
          </g>
        ))}

        <circle cx="70" cy="58" r="11" fill="currentColor" fillOpacity="0.1" />
        <circle cx="70" cy="58" r="5.5" fill="currentColor" />
      </svg>
    </Frame>
  );
}

/**
 * 03 · Protect — the perimeter being read. A scan head crosses the shield on a
 * slow cycle and the access ticks answer behind it: the pillar's claim is
 * layered control, so the panel shows a control actually running rather than a
 * padlock sitting there looking secure.
 */
export function ProtectPanel() {
  return (
    <Frame label="Perimeter">
      <svg
        viewBox="0 0 140 120"
        className="h-full max-h-[210px] w-full text-brand"
        aria-hidden
        focusable="false"
      >
        <clipPath id="sys-shield-clip">
          <path d="M70 12 L112 27 V62 C112 88 94 102 70 110 C46 102 28 88 28 62 V27 Z" />
        </clipPath>

        <path
          d="M70 12 L112 27 V62 C112 88 94 102 70 110 C46 102 28 88 28 62 V27 Z"
          fill="currentColor"
          fillOpacity="0.05"
          stroke="currentColor"
          strokeOpacity="0.35"
          strokeWidth="1.6"
        />

        <g clipPath="url(#sys-shield-clip)">
          {/* Ridge field inside the shield — a print, read as texture. */}
          {[14, 21, 28, 35, 42].map((r, i) => (
            <path
              key={r}
              d={`M${70 - r} 74 a${r} ${r} 0 0 1 ${r * 2} 0`}
              fill="none"
              stroke="currentColor"
              strokeOpacity={0.3 - i * 0.045}
              strokeWidth="1.4"
            />
          ))}
          <rect
            x="28"
            y="16"
            width="84"
            height="2.4"
            rx="1.2"
            fill="currentColor"
            fillOpacity="0.9"
            data-anim=""
            data-run="always"
            style={loop("sys-scan", "5s", { extra: { "--scan": "82px" } })}
          />
        </g>

        {/* Access ticks answering the scan. */}
        {[0, 1, 2].map((i) => (
          <g key={i} data-anim="" data-run="always" style={loop("sys-blink", "4.5s", { delay: `${i * 1.1}s` })}>
            <rect
              x="10"
              y={30 + i * 16}
              width="12"
              height="3"
              rx="1.5"
              fill="currentColor"
              fillOpacity="0.6"
            />
            <rect
              x="118"
              y={38 + i * 16}
              width="12"
              height="3"
              rx="1.5"
              fill="currentColor"
              fillOpacity="0.6"
            />
          </g>
        ))}
      </svg>
    </Frame>
  );
}

const PANELS: Record<string, () => React.ReactElement> = {
  engineering: EngineerPanel,
  continuity: ConnectPanel,
  security: ProtectPanel,
};

export function PillarPanel({ pillar }: { pillar: string }) {
  const Panel = PANELS[pillar];
  return Panel ? <Panel /> : null;
}
