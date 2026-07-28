/**
 * PREVIEW-ONLY stock assets (Unsplash, free license).
 * ⚠️ Every URL here is temporary. Replace with real, owned assets and DELETE
 * this file before launch. The "no stock in production" rule still holds —
 * see docs/17-placeholder-and-seed-content.md. All usages are flagged via the
 * `isPlaceholder` prop / data-placeholder on media components.
 */

const u = (id: string, w = 1600) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=72`;

export const previewImages = {
  heroOffice: u("photo-1497366216548-37526070297c"),
  teamMeeting: u("photo-1522071820081-009f0129c71c"),
  workshop: u("photo-1531482615713-2afd69097998"),
  developers: u("photo-1531403009284-440f080d1e12"),
  officeBuilding: u("photo-1486406146926-c627a92ad1ab"),
  abstractTech: u("photo-1518770660439-4636190af475"),
  dataCenter: u("photo-1558494949-ef010cbdcc31"),
  founder: u("photo-1560250097-0b93528c311a", 800),
  cofounder: u("photo-1573496359142-b8d87734a5a2", 800),
  logistics: u("photo-1601584115197-04ecc0da31d7"),
  voiceAi: u("photo-1535378917042-10a22c95931a"),
  aiml: u("photo-1591453089816-0fbb971b454c"),
  innovation: u("photo-1451187580459-43490279c0fa"),
  strategy: u("photo-1542744173-8e7e53415bb0"),
  collaborate: u("photo-1600880292203-757bb62b4baf"),
} as const;

/**
 * Culture gallery — 20 preview stills of teams, offices, and engineers at work.
 * [REAL ASSET NEEDED] Replace with real Sumago photography before launch.
 */
export const cultureGalleryImages: string[] = [
  u("photo-1522071820081-009f0129c71c", 1000),
  u("photo-1531403009284-440f080d1e12", 1000),
  u("photo-1531482615713-2afd69097998", 1000),
  u("photo-1497366216548-37526070297c", 1000),
  u("photo-1600880292203-757bb62b4baf", 1000),
  u("photo-1542744173-8e7e53415bb0", 1000),
  u("photo-1552664730-d307ca884978", 1000),
  u("photo-1553877522-43269d4ea984", 1000),
  u("photo-1522202176988-66273c2fd55f", 1000),
  u("photo-1521737711867-e3b97375f902", 1000),
  u("photo-1543269865-cbf427effbad", 1000),
  u("photo-1517048676732-d65bc937f952", 1000),
  u("photo-1531538606174-0f90ff5dce83", 1000),
  u("photo-1556761175-5973dc0f32e7", 1000),
  u("photo-1519389950473-47ba0277781c", 1000),
  u("photo-1560264357-8d9202250f21", 1000),
  u("photo-1573164713988-8665fc963095", 1000),
  u("photo-1497215728101-856f4ea42174", 1000),
  u("photo-1524758631624-e2822e304c36", 1000),
  u("photo-1600880292089-90a7e086ee0c", 1000),
];

/**
 * Life at Sumago, organised by event type — each category powers the selectable
 * gallery on the Life-at-Sumago page.
 * [REAL ASSET NEEDED] Replace with real Sumago event photography before launch.
 */
export type EventGalleryCategory = { key: string; title: string; images: string[] };

export const eventGalleries: EventGalleryCategory[] = [
  {
    key: "festivals",
    title: "Festivals",
    images: [
      "photo-1533174072545-7a4b6ad7a6c3",
      "photo-1467810563316-b5476525c0f9",
      "photo-1601050690597-df0568f70950",
      "photo-1518709268805-4e9042af9f23",
      "photo-1475721027785-f74eccf877e2",
      "photo-1519671482749-fd09be7ccebf",
    ].map((id) => u(id, 1000)),
  },
  {
    key: "conferences",
    title: "Conferences",
    images: [
      "photo-1523240795612-9a054b0db644",
      "photo-1540575467063-178a50c2df87",
      "photo-1505373877841-8d25f7d46678",
      "photo-1591115765373-5207764f72e7",
      "photo-1560439514-4e9645039924",
      "photo-1587825140708-dfaf72ae4b04",
    ].map((id) => u(id, 1000)),
  },
  {
    key: "trips",
    title: "Trips & offsites",
    images: [
      "photo-1530103862676-de8c9debad1d",
      "photo-1527529482837-4698179dc6ce",
      "photo-1516450360452-9312f5e86fc7",
      "photo-1533105079780-92b9be482077",
      "photo-1539635278303-d4002c07eae3",
      "photo-1522205408450-add114ad53fe",
    ].map((id) => u(id, 1000)),
  },
  {
    key: "celebrations",
    title: "Celebrations",
    images: [
      "photo-1530023367847-a683933f4172",
      "photo-1511578314322-379afb476865",
      "photo-1414235077428-338989a2e8c0",
      "photo-1515187029135-18ee286d815b",
      "photo-1552664730-d307ca884978",
      "photo-1543269865-cbf427effbad",
    ].map((id) => u(id, 1000)),
  },
  {
    key: "workshops",
    title: "Workshops & meetups",
    images: [
      "photo-1531482615713-2afd69097998",
      "photo-1524178232363-1fb2b075b655",
      "photo-1454165804606-c3d57bc86b40",
      "photo-1517245386807-bb43f82c33c4",
      "photo-1519070994522-88c6b756330e",
      "photo-1517048676732-d65bc937f952",
    ].map((id) => u(id, 1000)),
  },
];

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

/**
 * "Team at work" moments for the Team-page carousel — focused desk time,
 * meetings, conferences, hackathons, and team-building. PREVIEW stock only.
 * [REAL ASSET NEEDED] Replace with real Sumago photography before launch.
 */
export const teamMoments: { src: string; alt: string }[] = [
  { src: u("photo-1531403009284-440f080d1e12", 1000), alt: "Engineers pairing at a workstation" },
  { src: u("photo-1600880292203-757bb62b4baf", 1000), alt: "A working session around the table" },
  { src: u("photo-1523240795612-9a054b0db644", 1000), alt: "Presenting at an industry conference" },
  { src: u("photo-1531482615713-2afd69097998", 1000), alt: "Heads-down building at an internal hackathon" },
  { src: u("photo-1530103862676-de8c9debad1d", 1000), alt: "The team on an outdoor offsite" },
  { src: u("photo-1517048676732-d65bc937f952", 1000), alt: "A developer focused at their desk" },
  { src: u("photo-1542744173-8e7e53415bb0", 1000), alt: "A project stand-up and planning review" },
  { src: u("photo-1540575467063-178a50c2df87", 1000), alt: "The team at a technology conference" },
  { src: u("photo-1524178232363-1fb2b075b655", 1000), alt: "A hackathon team mapping ideas on a whiteboard" },
  { src: u("photo-1527529482837-4698179dc6ce", 1000), alt: "Celebrating together at a team gathering" },
  { src: u("photo-1522071820081-009f0129c71c", 1000), alt: "The team collaborating in the open office" },
  { src: u("photo-1505373877841-8d25f7d46678", 1000), alt: "A keynote session with the audience" },
  { src: u("photo-1519070994522-88c6b756330e", 1000), alt: "Late-night problem-solving during a hackathon" },
  { src: u("photo-1552664730-d307ca884978", 1000), alt: "A team-building activity" },
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
