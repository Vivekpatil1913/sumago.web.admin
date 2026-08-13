/**
 * The tools Sumago works with across the full delivery lifecycle, rendered as
 * brand tiles on the "AI across the SDLC" bands. Six categories × the six most
 * recognizable tools each (30 total). Marks come from `simple-icons` (official
 * brand paths + colors). Three brands aren't in that set: ChatGPT carries the
 * official OpenAI mark inline; Canva and Slack fall back to wordmark tiles.
 */
import {
  // tech
  siGithub,
  siGitlab,
  siDocker,
  siKubernetes,
  siPostman,
  siVercel,
  // design
  siFigma,
  siSketch,
  siFramer,
  siWebflow,
  siMiro,
  // ai
  siClaude,
  siGooglegemini,
  siPerplexity,
  siGithubcopilot,
  siCursor,
  // product management
  siJira,
  siLinear,
  siNotion,
  siAsana,
  siTrello,
  siClickup,
  // marketing
  siHubspot,
  siMailchimp,
  siGoogleanalytics,
  siGoogleads,
  siSemrush,
  siMeta,
  // business
  siZoom,
  siStripe,
  siZapier,
  siGoogle,
  siDropbox,
  // engineering stack — per-service tagging only (see `extraTools`)
  siPython,
  siReact,
  siFlutter,
  siNodedotjs,
  siMongodb,
  type SimpleIcon,
} from "simple-icons";

export type ToolIcon = {
  title: string;
  /** Brand color, hex without the leading `#`. */
  hex: string;
  /** Single-path SVG glyph on a 24×24 viewBox. */
  path?: string;
  /** Wordmark fallback for brands with no published icon in the set. */
  text?: string;
};

/** Map a simple-icons entry to our tile shape. */
const brand = (icon: SimpleIcon): ToolIcon => ({
  title: icon.title,
  hex: icon.hex,
  path: icon.path,
});

/** Official OpenAI mark (24×24) — not shipped in simple-icons. */
const OPENAI_PATH =
  "M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997z";

const CHATGPT: ToolIcon = { title: "ChatGPT", hex: "10A37F", path: OPENAI_PATH };
const CANVA: ToolIcon = { title: "Canva", hex: "00C4CC", text: "Canva" };
const SLACK: ToolIcon = { title: "Slack", hex: "611F69", text: "Slack" };

/** Six categories, six famous tools each. */
const categories: ToolIcon[][] = [
  // Tech / engineering
  [brand(siGithub), brand(siGitlab), brand(siDocker), brand(siKubernetes), brand(siPostman), brand(siVercel)],
  // Design
  [brand(siFigma), brand(siSketch), brand(siFramer), brand(siWebflow), brand(siMiro), CANVA],
  // AI
  [CHATGPT, brand(siClaude), brand(siGooglegemini), brand(siPerplexity), brand(siGithubcopilot), brand(siCursor)],
  // Product management
  [brand(siJira), brand(siLinear), brand(siNotion), brand(siAsana), brand(siTrello), brand(siClickup)],
  // Marketing
  [brand(siHubspot), brand(siMailchimp), brand(siGoogleanalytics), brand(siGoogleads), brand(siSemrush), brand(siMeta)],
  // Business
  [SLACK, brand(siZoom), brand(siStripe), brand(siZapier), brand(siGoogle), brand(siDropbox)],
];

/** Round-robin across categories so every band shows a balanced mix. */
export const toolIcons: ToolIcon[] = Array.from({ length: 6 }, (_, col) =>
  categories.map((cat) => cat[col]),
).flat();

/**
 * React Native ships no mark of its own — it uses React's atom, so the path is
 * shared and only the title differs. Both are kept so a web service can show
 * "React" while a mobile one shows "React Native".
 */
const REACT_NATIVE: ToolIcon = {
  title: "React Native",
  hex: siReact.hex,
  path: siReact.path,
};

/**
 * `simple-icons` publishes no Amazon/AWS or Microsoft/Azure marks (removed over
 * trademark policy — verified against v16: zero matches for amazon|aws|azure).
 * Rather than hand-rolling brand paths that can't be verified, these fall back
 * to wordmark tiles, exactly like Canva and Slack above. Colours are the
 * official brand hexes.
 */
const AWS: ToolIcon = { title: "AWS", hex: "FF9900", text: "AWS" };
const AZURE: ToolIcon = { title: "Azure", hex: "0078D4", text: "Azure" };

/**
 * Engineering-stack brands used for per-service tagging on the Solutions page.
 * Kept OUT of `categories` on purpose: the home bands are a deliberate 6×6
 * round-robin, and appending here would silently drop tools from that grid.
 */
const extraTools: ToolIcon[] = [
  brand(siPython),
  brand(siReact),
  REACT_NATIVE,
  brand(siFlutter),
  brand(siNodedotjs),
  brand(siMongodb),
  AWS,
  AZURE,
];

/**
 * Title → icon, so other surfaces can pull the same marks by name (the Solutions
 * stages tag each service with the tools it actually works in). Keys are the
 * `simple-icons` titles, e.g. "GitHub", "Node.js", "Google Analytics".
 */
const TOOL_BY_TITLE: Record<string, ToolIcon> = Object.fromEntries(
  [...toolIcons, ...extraTools].map((t) => [t.title, t]),
);

/**
 * Resolve tool titles to icons, dropping any that aren't in the set. Kept
 * lenient on purpose: a typo yields a missing tile, never a crash.
 */
export function getToolIcons(titles: readonly string[]): ToolIcon[] {
  return titles.map((t) => TOOL_BY_TITLE[t]).filter(Boolean);
}

/* -------------------------------------------------------------------------- */
/*  Making every mark visible on both tile surfaces                            */
/* -------------------------------------------------------------------------- */

/**
 * The effective fill of a tool tile on each surface — the dark one is
 * `bg-white/[0.06]` over the ink section (`--color-ink: #1a1a1a`).
 *
 * A published brand hex assumes the brand's own background. Painted as-is on
 * the ink band, GitHub (#181717) landed black-on-black and its tile read as an
 * empty box; Vercel and Notion (#000000) are the same case.
 */
const TILE_SURFACE = { dark: "1F1F20", light: "FFFFFF" } as const;

/**
 * Contrast a glyph needs against its tile, per surface.
 *
 * Asymmetric on purpose. A published brand hex is chosen to sit on white, so on
 * the light tile the only mark that can disappear is a near-white one — a low
 * bar there, or the rule starts darkening brands that were never a problem
 * (Sketch's yellow reads perfectly well on white and is nobody's accessibility
 * complaint). The ink tile is the case these colours were never chosen for, and
 * that is where the bar has to be real.
 *
 * Marks are large, decorative, and carry a text label besides, so 3:1 — the
 * WCAG figure for non-text content — is the target rather than 4.5:1.
 */
const MIN_CONTRAST = { dark: 3, light: 1.2 } as const;

/** How close to grey a brand has to be to count as monochrome (0–255 spread). */
const ACHROMATIC_SPREAD = 16;

function channels(hex: string): [number, number, number] {
  const n = parseInt(hex, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function toHex([r, g, b]: [number, number, number]): string {
  return [r, g, b].map((c) => Math.round(c).toString(16).padStart(2, "0")).join("");
}

/** WCAG relative luminance. */
function luminance(hex: string): number {
  const [r, g, b] = channels(hex).map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(a: number, b: number): number {
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

/** Blend `hex` toward `target` by `t` (0–1). */
function mix(hex: string, target: string, t: number): string {
  const from = channels(hex);
  const to = channels(target);
  return toHex([0, 1, 2].map((i) => from[i] + (to[i] - from[i]) * t) as [number, number, number]);
}

/**
 * A brand mark's colour, adjusted so it stays legible on the tile it sits on.
 *
 * Monochrome brands (GitHub, Vercel, Notion — anything published as flat black
 * or white) flip outright, which is what their own brand guidelines call for on
 * an inverted background. Everything with a hue keeps it and is only lightened
 * or darkened until it clears `MIN_CONTRAST`, so Jira stays recognisably Jira
 * blue rather than turning into another white glyph.
 *
 * Pure functions of a constant: this runs once per tile at render time on the
 * server and ships no JS.
 */
export function markColor(hex: string, tone: "light" | "dark" = "light"): string {
  const surface = luminance(TILE_SURFACE[tone]);
  const target = MIN_CONTRAST[tone];
  if (contrast(luminance(hex), surface) >= target) return `#${hex}`;

  const [r, g, b] = channels(hex);
  const toward = tone === "dark" ? "FFFFFF" : "000000";
  const monochrome = Math.max(r, g, b) - Math.min(r, g, b) <= ACHROMATIC_SPREAD;
  if (monochrome) return `#${toward}`;

  /* Walk toward the tile's opposite in tenths and stop at the first step that
     clears the bar — the least change that makes the mark readable. */
  for (let step = 1; step <= 10; step++) {
    const next = mix(hex, toward, step / 10);
    if (contrast(luminance(next), surface) >= target) return `#${next}`;
  }
  return `#${toward}`;
}
