/**
 * PREVIEW-ONLY stock assets (Unsplash, free license).
 * ⚠️ Every URL here is temporary. Replace with real, owned assets and DELETE
 * this file before launch. The "no stock in production" rule still holds —
 * see docs/17-placeholder-and-seed-content.md. All usages are flagged via
 * `data-placeholder` on `MediaPlaceholder`.
 *
 * ## What is left here, and why
 *
 * Most of what this file used to carry has moved to `real-assets.ts`, which
 * holds Sumago's own photography. What remains is the set with no owned
 * equivalent in the archive:
 *
 *   - Named founder portraits. Real headshots exist in
 *     `public/images/leadership/`, but nothing establishes which face carries
 *     which name — so these stay stock until an editor attaches a portrait in
 *     the panel (Founders & Leadership). See ASSET-INDEX.md.
 *   - Blog covers, for the seed posts whose bodies are still `[SAMPLE COPY]`.
 *     The six posts with real copy already carry real covers from
 *     `public/images/blog/`.
 *
 * Case-study covers have left: the four Proof of Work stories now render
 * Sumago's own photography from `caseStudyCovers` in `real-assets.ts`. Their
 * bodies are still `[SAMPLE COPY]`, so the honesty argument that kept them
 * stock has not gone away — it has moved into the alt text there, which
 * describes the photograph (an office floor, a hackathon, an expo stand) and
 * never claims to show the client's system.
 *   - Industry and service imagery. No owned photograph of a client's factory
 *     floor, hospital, or warehouse exists, and Sumago's own office standing in
 *     for a client's would be a different kind of dishonest.
 *   - Seed department-leader portraits, which sit against invented names.
 */

const u = (id: string, w = 1600) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=72`;

export const previewImages = {
  /** Seed blog covers, all against `[SAMPLE COPY]` bodies. */
  developers: u("photo-1531403009284-440f080d1e12"),
  aiml: u("photo-1591453089816-0fbb971b454c"),
  innovation: u("photo-1451187580459-43490279c0fa"),
  /** Founder portraits — awaiting a name-to-face decision in the panel. */
  founder: u("photo-1560250097-0b93528c311a", 800),
  cofounder: u("photo-1573496359142-b8d87734a5a2", 800),
} as const;

/**
 * Portrait headshots for the wider-team grid — PREVIEW stock only.
 * [REAL ASSET NEEDED] Replace with real Sumago team photography before launch.
 */
export const previewPortraits: string[] = [
  u("photo-1560250097-0b93528c311a", 800),
  u("photo-1573496359142-b8d87734a5a2", 800),
  u("photo-1500648767791-00dcc994a43e", 800),
  u("photo-1507003211169-0a1dd7228f2d", 800),
  u("photo-1494790108377-be9c29b29330", 800),
  u("photo-1519085360753-af0119f7cbe7", 800),
  u("photo-1506794778202-cad84cf45f1d", 800),
  u("photo-1544005313-94ddf0286df2", 800),
  u("photo-1534528741775-53994a69daeb", 800),
  u("photo-1580489944761-15a19d654956", 800),
  u("photo-1472099645785-5658abf4ff4e", 800),
  u("photo-1517841905240-472988babdf9", 800),
];

/** Industry tile imagery, keyed by slug — India-context preview stills. */
export const industryImages: Record<string, string> = {
  "logistics-and-transportation": u("photo-1635774152029-17bf0a3e1cb4", 1000),
  manufacturing: u("photo-1764114909312-c27b89ec7223", 1000),
  healthcare: u("photo-1648964388258-e71b58683ed0", 1000),
  "banking-and-financial-services": u("photo-1565374392032-8007fb37c26e", 1000),
  education: u("photo-1692269725836-fbd72e98883f", 1000),
  "retail-and-e-commerce": u("photo-1760786933988-48886fc1980e", 1000),
  "government-and-public-sector": u("photo-1760872645513-63b6846ce3c9", 1000),
  "hospitality-and-tourism": u("photo-1564507592333-c60657eea523", 1000),
  "real-estate": u("photo-1629652320041-c2c555e68101", 1000),
  "professional-services": u("photo-1577962917302-cd874c4e31d2", 1000),
};

export type PreviewImageKey = keyof typeof previewImages;

export type ServiceImage = {
  src: string;
  /** Describes the REAL photograph this slot needs — the brief for the shoot,
   *  not the stock still standing in for it today. */
  alt: string;
};

/**
 * Imagery for the redesigned service detail pages, keyed by service slug.
 *
 * PREVIEW STOCK ONLY — every `src` reuses an already-verified Unsplash ID from
 * this file and is a stand-in for a real Sumago photograph. The `alt` on each
 * entry is the actual brief: it says what must be shot before launch, which is
 * what makes these slots honest rather than decorative.
 *
 * [REAL ASSET NEEDED] Replace every src with owned Sumago photography, then
 * delete this file (see docs/17). Production is gated on `data-placeholder`.
 */
export const serviceImages: Record<string, ServiceImage[]> = {
  /* Slot order is structural, not decorative — see service-detail-visual.tsx:
     [0] hero (dissolves into #0a0708 — must already be dark, or it fights the scrim)
     [1] ghost (sits under the pull-quote at ~9% — needs a clear, readable subject)
     [2] plate (tilted 4/5 portrait crop — subject must survive a centre crop)
     [3] band (full-bleed duotone behind the outcomes)
     Every still here shows a real mobile screen: the subject of the page is the
     app, so a generic desk photo would be decoration. */
  "mobile-app-engineering": [
    {
      src: u("photo-1601784551446-20c9e07cdbdb", 1600),
      alt: "A Sumago-built app's home screen running on a handset, shot on black",
    },
    {
      src: u("photo-1526498460520-4c246339dccb", 1400),
      alt: "A Sumago mobile engineer's handset showing app source running on-device",
    },
    {
      src: u("photo-1551650975-87deedd944c3", 1400),
      alt: "A Sumago-built app UI held in hand, with its screen designs on the monitors behind",
    },
    {
      src: u("photo-1596742578443-7682ef5251cd", 1600),
      alt: "The same Sumago app running on an Android handset and a tablet side by side — one codebase, both form factors",
    },
  ],
};
