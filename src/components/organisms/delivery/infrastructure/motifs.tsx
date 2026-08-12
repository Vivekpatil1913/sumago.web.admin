/**
 * Contextual micro-animations, one per infrastructure capability.
 *
 * Three rules hold the set together:
 *
 * 1. **The animation is the meaning.** Wi-Fi expands, packets cross the link,
 *    the cell charges, the print gets scanned, the camera sweeps its arc. If a
 *    motif could be swapped between two capabilities without anyone noticing,
 *    it is the wrong motif.
 * 2. **Rest is the meaningful state.** Every motif renders complete and
 *    legible with nothing running — lines typed, cell full, trace drawn. Motion
 *    is the enhancement, which is why the set is hover/focus-driven and why
 *    `prefers-reduced-motion` costs the reader nothing.
 * 3. **One coordinate system.** Every motif is a 92×36 SVG, so the card's art
 *    box never shifts between capabilities and travel distances are stated in
 *    user units rather than guessed from a fluid width.
 *
 * Motion is declared, not classed: a node carries `data-anim` and names its
 * primitive in `--anim` (see the `[data-anim]` rules in globals.css), which is
 * what lets twelve distinct animations share thirteen keyframes.
 *
 * All twelve are decorative — the capability's name sits beside them as text —
 * so each is `aria-hidden` and never announced.
 */

/** Custom properties an `[data-anim]` node understands. */
type AnimOpts = {
  ease?: string;
  delay?: string;
  /** `"infinite"` for continuous motifs; defaults to a single run. */
  iter?: string;
  /** Extra CSS — `transformOrigin`, or a primitive's own `--travel`/`--scan`. */
  extra?: Record<string, string>;
};

function av(name: string, dur: string, o: AnimOpts = {}): React.CSSProperties {
  return {
    "--anim": name,
    "--dur": dur,
    "--ease": o.ease ?? "ease-out",
    "--delay": o.delay ?? "0s",
    "--iter": o.iter ?? "1",
    ...o.extra,
  } as React.CSSProperties;
}

/** Shared frame: fixed art box, brand ink, decorative. */
function Art({ children }: { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 92 36"
      aria-hidden
      focusable="false"
      className="h-9 w-[92px] shrink-0 text-brand"
    >
      {children}
    </svg>
  );
}

/* ── 01 · Engineer ──────────────────────────────────────────────────────── */

/** Development labs — a build running: code typing, then the caret waiting. */
function DevLabs() {
  const lines = [
    { y: 15, w: 48, delay: "0s", lit: false },
    { y: 20, w: 62, delay: "0.12s", lit: true },
    { y: 25, w: 34, delay: "0.24s", lit: false },
  ];
  return (
    <Art>
      <rect
        x="0.5"
        y="0.5"
        width="91"
        height="35"
        rx="4"
        fill="none"
        stroke="currentColor"
        strokeOpacity="0.18"
      />
      <path d="M0 10 H92" stroke="currentColor" strokeOpacity="0.12" />
      {[7, 13, 19].map((cx) => (
        <circle key={cx} cx={cx} cy="5" r="1.6" fill="currentColor" fillOpacity="0.28" />
      ))}
      {lines.map((l) => (
        <rect
          key={l.y}
          x="8"
          y={l.y}
          width={l.w}
          height="2.6"
          rx="1.3"
          fill="currentColor"
          fillOpacity={l.lit ? 0.85 : 0.22}
          data-anim=""
          style={av("sys-fill", "0.5s", {
            delay: l.delay,
            extra: { transformOrigin: `8px ${l.y}px` },
          })}
        />
      ))}
      <rect
        x="44"
        y="24.5"
        width="2"
        height="4.4"
        fill="currentColor"
        data-anim=""
        data-run="always"
        style={av("sys-caret", "1.1s", { ease: "step-end", iter: "infinite" })}
      />
    </Art>
  );
}

/** Workstations & laptops — a screen lit, a pointer working across it. */
function Workstations() {
  return (
    <Art>
      <rect
        x="10"
        y="3"
        width="58"
        height="24"
        rx="3"
        fill="none"
        stroke="currentColor"
        strokeOpacity="0.3"
      />
      <rect
        x="13"
        y="6"
        width="52"
        height="18"
        rx="2"
        fill="currentColor"
        fillOpacity="0.07"
        data-anim=""
        style={av("sys-blink", "1.8s", { ease: "ease-in-out", iter: "infinite" })}
      />
      {[
        { y: 9.5, w: 22 },
        { y: 14, w: 32 },
        { y: 18.5, w: 16 },
      ].map((l) => (
        <rect
          key={l.y}
          x="17"
          y={l.y}
          width={l.w}
          height="2"
          rx="1"
          fill="currentColor"
          fillOpacity="0.3"
        />
      ))}
      <path
        d="M39 27 V31 M31 31 H47"
        stroke="currentColor"
        strokeOpacity="0.3"
        strokeWidth="1.5"
      />
      <path
        d="M0 0 L0 8.4 L2.1 6.4 L3.6 9.6 L5.1 8.8 L3.6 5.8 L6.4 5.6 Z"
        fill="currentColor"
        transform="translate(20 10)"
        data-anim=""
        style={av("sys-cursor", "2.8s", { ease: "ease-in-out", iter: "infinite" })}
      />
      <rect x="74" y="10" width="13" height="17" rx="2" fill="currentColor" fillOpacity="0.13" />
    </Art>
  );
}

/** Conference rooms — people joining, and the link between them. */
function Conference() {
  const seats = [
    { cx: 14, cy: 24, d: "0s" },
    { cx: 34, cy: 12, d: "0.12s" },
    { cx: 56, cy: 22, d: "0.24s" },
    { cx: 78, cy: 11, d: "0.36s" },
  ];
  return (
    <Art>
      <path
        d="M14 24 L34 12 L56 22 L78 11"
        fill="none"
        stroke="currentColor"
        strokeOpacity="0.3"
        strokeWidth="1.2"
        strokeDasharray="4 4"
        data-anim=""
        style={av("sys-flow", "2.4s", { ease: "linear", iter: "infinite" })}
      />
      {seats.map((s) => (
        <g
          key={s.cx}
          data-anim=""
          style={av("sys-pop", "0.5s", {
            delay: s.d,
            extra: { transformOrigin: `${s.cx}px ${s.cy}px` },
          })}
        >
          <circle cx={s.cx} cy={s.cy} r="5.4" fill="currentColor" fillOpacity="0.12" />
          <circle cx={s.cx} cy={s.cy - 1.4} r="2" fill="currentColor" fillOpacity="0.75" />
          <path
            d={`M${s.cx - 3.2} ${s.cy + 4} a3.2 3.2 0 0 1 6.4 0`}
            fill="currentColor"
            fillOpacity="0.75"
          />
        </g>
      ))}
    </Art>
  );
}

/** Seminar hall — a deck advancing to a room that is present for it. */
function Seminar() {
  return (
    <Art>
      <clipPath id="sys-seminar-screen">
        <rect x="13.5" y="3.5" width="65" height="17" rx="2" />
      </clipPath>
      <rect
        x="12"
        y="2"
        width="68"
        height="20"
        rx="2.5"
        fill="none"
        stroke="currentColor"
        strokeOpacity="0.3"
      />
      <g clipPath="url(#sys-seminar-screen)">
        <rect x="13.5" y="3.5" width="65" height="17" fill="currentColor" fillOpacity="0.06" />
        <rect
          x="17"
          y="6"
          width="26"
          height="12"
          rx="1.5"
          fill="currentColor"
          fillOpacity="0.5"
          data-anim=""
          style={av("sys-packet", "2.8s", {
            ease: "cubic-bezier(0.65,0,0.35,1)",
            iter: "infinite",
            extra: { "--travel": "34px" },
          })}
        />
      </g>
      <path d="M46 22 V26" stroke="currentColor" strokeOpacity="0.3" strokeWidth="1.4" />
      {[10, 22, 34, 46, 58, 70, 82].map((cx, i) => (
        <circle
          key={cx}
          cx={cx}
          cy="31"
          r="2.4"
          fill="currentColor"
          fillOpacity="0.4"
          data-anim=""
          style={av("sys-pop", "0.5s", {
            delay: `${(i * 0.07).toFixed(2)}s`,
            extra: { transformOrigin: `${cx}px 31px` },
          })}
        />
      ))}
    </Art>
  );
}

/* ── 02 · Connect ───────────────────────────────────────────────────────── */

/**
 * High-speed internet — packets crossing the link, throughput moving under
 * them. One of only two motifs that runs at rest: the card claims to be live,
 * and a frozen "Live" readout is a lie told in pixels.
 */
function Internet() {
  return (
    <Art>
      <path d="M6 11 H86" stroke="currentColor" strokeOpacity="0.16" strokeDasharray="3 4" />
      {["0s", "0.62s", "1.24s"].map((delay) => (
        <circle
          key={delay}
          cx="6"
          cy="11"
          r="2.4"
          fill="currentColor"
          data-anim=""
          data-run="always"
          style={av("sys-packet", "1.9s", {
            ease: "linear",
            delay,
            iter: "infinite",
            extra: { "--travel": "80px" },
          })}
        />
      ))}
      {[
        { x: 6, h: 6 },
        { x: 14, h: 9 },
        { x: 22, h: 13 },
        { x: 30, h: 17 },
      ].map((b, i) => (
        <rect
          key={b.x}
          x={b.x}
          y={30 - b.h}
          width="4.5"
          height={b.h}
          rx="1"
          fill="currentColor"
          fillOpacity={0.22 + i * 0.2}
        />
      ))}
      <rect x="40" y="25" width="46" height="5" rx="2.5" fill="currentColor" fillOpacity="0.12" />
      <rect
        x="40"
        y="25"
        width="46"
        height="5"
        rx="2.5"
        fill="currentColor"
        fillOpacity="0.75"
        data-anim=""
        data-run="always"
        style={av("sys-meter", "3.4s", {
          ease: "ease-in-out",
          iter: "infinite",
          extra: { transformOrigin: "40px 27.5px" },
        })}
      />
    </Art>
  );
}

/** Full Wi-Fi coverage — signal leaving the access point, reaching the floor. */
function Coverage() {
  return (
    <Art>
      <path
        d="M20 30 m-27 0 a27 27 0 0 1 54 0"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeOpacity="0.12"
      />
      {["0s", "0.42s", "0.84s"].map((delay, i) => (
        <path
          key={delay}
          d="M20 30 m-17 0 a17 17 0 0 1 34 0"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeOpacity={0.5 - i * 0.13}
          data-anim=""
          style={av("sys-wave", "1.9s", {
            delay,
            iter: "infinite",
            extra: { transformOrigin: "20px 30px" },
          })}
        />
      ))}
      <circle cx="20" cy="30" r="3" fill="currentColor" />
      {[
        { x: 56, y: 7 },
        { x: 73, y: 15 },
        { x: 60, y: 25 },
      ].map((p, i) => (
        <rect
          key={p.x}
          x={p.x}
          y={p.y}
          width="10"
          height="7"
          rx="1.6"
          fill="currentColor"
          fillOpacity="0.45"
          data-anim=""
          style={av("sys-blink", "1.9s", {
            ease: "ease-in-out",
            delay: `${(i * 0.18).toFixed(2)}s`,
            iter: "infinite",
          })}
        />
      ))}
    </Art>
  );
}

/** Power backup — the cell holding charge, and the transfer that keeps it there. */
function Power() {
  return (
    <Art>
      <rect
        x="6"
        y="10"
        width="54"
        height="17"
        rx="3.5"
        fill="none"
        stroke="currentColor"
        strokeOpacity="0.32"
        strokeWidth="1.4"
      />
      <rect x="61.5" y="15" width="3.5" height="7" rx="1.2" fill="currentColor" fillOpacity="0.32" />
      <rect
        x="9"
        y="13"
        width="48"
        height="11"
        rx="2"
        fill="currentColor"
        fillOpacity="0.7"
        data-anim=""
        style={av("sys-fill", "1.5s", {
          ease: "cubic-bezier(0.4,0,0.2,1)",
          extra: { transformOrigin: "9px 18.5px" },
        })}
      />
      <path
        d="M79 4 L71 18 H76.5 L74 32 L84 16 H78 Z"
        fill="currentColor"
        fillOpacity="0.85"
        data-anim=""
        style={av("sys-blink", "0.9s", { ease: "ease-in-out", iter: "infinite" })}
      />
    </Art>
  );
}

/** ERP systems — records lighting across the grid, then leaving as a feed. */
function Erp() {
  return (
    <Art>
      {Array.from({ length: 12 }, (_, n) => {
        const col = n % 4;
        const row = Math.floor(n / 4);
        const x = 6 + col * 11;
        const y = 6 + row * 9;
        return (
          <rect
            key={n}
            x={x}
            y={y}
            width="8"
            height="6"
            rx="1.4"
            fill="currentColor"
            fillOpacity={n % 3 === 0 ? 0.65 : 0.2}
            data-anim=""
            style={av("sys-pop", "0.5s", {
              delay: `${((col + row) * 0.07).toFixed(2)}s`,
              extra: { transformOrigin: `${x + 4}px ${y + 3}px` },
            })}
          />
        );
      })}
      {[
        { d: "M50 18 H64 Q70 18 70 11 H78", dur: "2s" },
        { d: "M50 18 H64 Q70 18 70 25 H78", dur: "2.6s" },
      ].map((l) => (
        <path
          key={l.d}
          d={l.d}
          fill="none"
          stroke="currentColor"
          strokeOpacity="0.35"
          strokeWidth="1.3"
          strokeDasharray="4 4"
          data-anim=""
          style={av("sys-flow", l.dur, { ease: "linear", iter: "infinite" })}
        />
      ))}
      {[11, 25].map((cy, i) => (
        <circle
          key={cy}
          cx="82"
          cy={cy}
          r="3"
          fill="currentColor"
          fillOpacity="0.65"
          data-anim=""
          style={av("sys-blink", "1.6s", {
            ease: "ease-in-out",
            delay: `${i * 0.3}s`,
            iter: "infinite",
          })}
        />
      ))}
    </Art>
  );
}

/* ── 03 · Protect ───────────────────────────────────────────────────────── */

/** Biometric access — a print, and the head that reads it. */
function Biometric() {
  return (
    <Art>
      {[5, 9, 13, 17].map((r, i) => (
        <path
          key={r}
          d={`M${46 - r} 27 a${r} ${r} 0 0 1 ${r * 2} 0`}
          fill="none"
          stroke="currentColor"
          strokeOpacity={0.6 - i * 0.1}
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      ))}
      <path d="M46 27 V14" stroke="currentColor" strokeOpacity="0.26" strokeWidth="1.6" />
      <rect
        x="24"
        y="8"
        width="44"
        height="1.8"
        rx="0.9"
        fill="currentColor"
        data-anim=""
        style={av("sys-scan", "2.2s", {
          ease: "ease-in-out",
          iter: "infinite",
          extra: { "--scan": "19px" },
        })}
      />
      {[
        "M24 4 V7 M24 4 H28",
        "M68 4 V7 M68 4 H64",
        "M24 33 V30 M24 33 H28",
        "M68 33 V30 M68 33 H64",
      ].map((d) => (
        <path key={d} d={d} stroke="currentColor" strokeOpacity="0.35" strokeWidth="1.3" />
      ))}
    </Art>
  );
}

/**
 * CCTV surveillance — the camera's field of view crossing the floor. The other
 * motif that runs at rest, for the same reason as the link: the card says Live.
 */
function Cctv() {
  return (
    <Art>
      <g
        data-anim=""
        data-run="always"
        style={av("sys-cone", "5.5s", {
          ease: "ease-in-out",
          iter: "infinite",
          extra: { transformOrigin: "46px 9px" },
        })}
      >
        <path d="M46 9 L29 33 H63 Z" fill="currentColor" fillOpacity="0.12" />
        <path
          d="M46 9 L29 33 M46 9 L63 33"
          stroke="currentColor"
          strokeOpacity="0.26"
          strokeWidth="1"
        />
      </g>
      <rect x="37" y="4" width="18" height="9" rx="2.5" fill="currentColor" fillOpacity="0.8" />
      <path d="M55 6.5 L61 3.5 V13.5 L55 10.5 Z" fill="currentColor" fillOpacity="0.8" />
      {["M6 6 V3 H10", "M86 6 V3 H82", "M6 30 V33 H10", "M86 30 V33 H82"].map((d) => (
        <path
          key={d}
          d={d}
          fill="none"
          stroke="currentColor"
          strokeOpacity="0.3"
          strokeWidth="1.4"
        />
      ))}
    </Art>
  );
}

/** Staffed reception — a desk that is not empty. */
function Reception() {
  return (
    <Art>
      {["0s", "0.75s"].map((delay) => (
        <circle
          key={delay}
          cx="46"
          cy="13"
          r="12"
          fill="none"
          stroke="currentColor"
          strokeOpacity="0.28"
          strokeWidth="1.4"
          data-anim=""
          style={av("sys-wave", "2.1s", {
            delay,
            iter: "infinite",
            extra: { transformOrigin: "46px 13px" },
          })}
        />
      ))}
      <circle cx="46" cy="9" r="4.2" fill="currentColor" fillOpacity="0.8" />
      <path d="M39.5 21 a6.5 6.5 0 0 1 13 0" fill="currentColor" fillOpacity="0.8" />
      <rect x="16" y="23" width="60" height="8" rx="2.5" fill="currentColor" fillOpacity="0.16" />
      <path d="M16 27 H76" stroke="currentColor" strokeOpacity="0.26" />
    </Art>
  );
}

/** On-site medical kit — a pulse, because that is what the kit is for. */
function MedKit() {
  const beat = "M4 20 H26 L30 20 L33 10 L37 30 L41 20 L45 20 H64 L67 15 L70 20 H88";
  return (
    <Art>
      <path d={beat} fill="none" stroke="currentColor" strokeOpacity="0.15" strokeWidth="1.8" />
      <path
        d={beat}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="160"
        data-anim=""
        style={av("sys-draw", "1.8s", {
          ease: "ease-in-out",
          iter: "infinite",
          extra: { "--len": "160" },
        })}
      />
      <path
        d="M76 3 h5 v4 h4 v5 h-4 v4 h-5 v-4 h-4 v-5 h4 z"
        fill="currentColor"
        fillOpacity="0.45"
      />
    </Art>
  );
}

const MOTIFS: Record<string, () => React.ReactElement> = {
  devlabs: DevLabs,
  workstations: Workstations,
  conference: Conference,
  seminar: Seminar,
  internet: Internet,
  coverage: Coverage,
  power: Power,
  erp: Erp,
  biometric: Biometric,
  cctv: Cctv,
  reception: Reception,
  medkit: MedKit,
};

/**
 * Renders the motif for a capability. An unknown key renders nothing rather
 * than a fallback shape — a wrong diagram is worse than no diagram, and the
 * card's text carries the capability either way.
 */
export function CapabilityMotif({ motif }: { motif: string }) {
  const Motif = MOTIFS[motif];
  return Motif ? <Motif /> : null;
}
