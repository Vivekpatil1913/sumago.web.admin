/**
 * Sumago's own photography — owned assets, safe for production.
 *
 * The counterpart to `preview-assets.ts`: everything there is licensed stock
 * standing in for a photograph that does not exist yet, and everything here is
 * a real Sumago photograph. Anything that moves from that file to this one
 * stops rendering the `Preview · stock` badge and stops tripping the launch
 * gate, which is the whole point of keeping them apart.
 *
 * Files come from `assets-source/` (untracked master photography) via
 * `npm run build:images`, which writes `public/images/**`. Do not hand-edit the
 * paths below without editing `scripts/image-manifest.mjs` to match — the
 * manifest is what regenerates the files, so a path that only exists here is a
 * 404 waiting for the next rebuild.
 *
 * Alt text is written once, in the manifest, and copied here. It describes the
 * photograph, not the slot, so the same asset reads correctly wherever it is
 * reused.
 *
 * ## What is deliberately absent
 *
 * Named portraits. The archive has excellent leadership headshots, but nothing
 * in it establishes which face belongs to which name, and a wrong name against
 * a real person is a public error rather than a cosmetic one. The headshots
 * ship as `leadershipHeadshots` — unnamed and unassigned — and the admin panel
 * (Founders & Leadership) is where a person gets attached to one. See
 * ASSET-INDEX.md for the thumbnail index editors work from.
 */

export type Photo = {
  src: string;
  alt: string;
};

const office = (name: string, alt: string): Photo => ({
  src: `/images/office/${name}.webp`,
  alt,
});

/**
 * The facility. Native 1280px — safe up to a half-width slot on a large
 * screen, which is the widest anything here is asked to fill.
 */
export const officePhotos = {
  openPlan: office("open-plan-workspace", "Sumago's open-plan engineering floor in Nashik"),
  workspacePod: office("workspace-pod", "Workstations and a discussion pod on Sumago's office floor"),
  developmentFloor: office("development-floor", "The development floor at Sumago's Nashik office"),
  desksByWindow: office("desks-by-window", "Workstations along the window at Sumago's office"),
  workspaceHall: office("workspace-hall", "A newly fitted-out floor at Sumago's Nashik office"),
  workroom: office("workroom", "A project room at Sumago's Nashik office"),
  meetingRoom: office("meeting-room-small", "A small meeting room at Sumago's office"),
  conferenceRoom: office("conference-room", "The conference room at Sumago's office"),
  managerCabin: office("manager-cabin", "A manager's cabin at Sumago's Nashik office"),
  reception: office("reception", "Reception at Sumago's Nashik office"),
  seminarRoom: office("seminar-room", "The seminar room at Sumago's Nashik office"),
  trainingRoom: office("training-room", "A training room at Sumago's Nashik office"),
  computerLab: office("computer-lab", "A workstation lab at Sumago's Nashik office"),
  buildingStreet: office("building-street", "The Sumago Infotech office in Nashik, seen from the street"),
} as const satisfies Record<string, Photo>;

/**
 * The only frames of people actually working in the office, and they exist at
 * 680px only. Sized for mosaic tiles (which never render past ~500px) and
 * nothing wider — a hero built from these would look soft.
 * [REAL ASSET NEEDED] Re-shoot the working floor at full resolution.
 */
const candid = (name: string, alt: string): Photo => ({
  src: `/images/office/candid/${name}.webp`,
  alt,
});

export const candidPhotos = {
  engineersAtWork: candid("engineers-at-work", "Sumago engineers at work on the Nashik development floor"),
  openFloorBusy: candid("open-floor-busy", "A working day on Sumago's development floor"),
  teamAtDesks: candid("team-at-desks", "Sumago's engineering team at their workstations"),
  officeCeremony: candid("office-ceremony", "The team at an office ceremony at Sumago"),
  awardsCabinet: candid("awards-cabinet", "Awards and recognition on display at Sumago's office"),
  boardroom: candid("boardroom", "The boardroom at Sumago's Nashik office"),
  receptionLounge: candid("reception-lounge", "The reception lounge at Sumago's office"),
  officeLounge: candid("office-lounge", "A waiting and breakout area at Sumago's office"),
  buildingExterior: candid("building-exterior", "The Sumago Infotech office building in Nashik"),
} as const satisfies Record<string, Photo>;

const team = (name: string, alt: string): Photo => ({
  src: `/images/team/${name}.webp`,
  alt,
});

/** Whole-company and group photography — the highest-resolution set there is. */
export const teamPhotos = {
  everyone: team("everyone", "The Sumago Infotech team together at the Nashik office"),
  groupFormal1: team("group-formal-01", "Part of the Sumago team at a company gathering"),
  groupFormal2: team("group-formal-02", "Sumago colleagues at a company gathering"),
  groupFormal3: team("group-formal-03", "Sumago colleagues at a company celebration"),
  groupOutdoor1: team("group-outdoor-01", "The Sumago team outside the Nashik office"),
  groupOutdoor2: team("group-outdoor-02", "Sumago colleagues outside the office"),
  groupOutdoor3: team("group-outdoor-03", "The Sumago team gathered outdoors at the office"),
  briefing: team("session-briefing", "A team briefing session at Sumago's office"),
} as const satisfies Record<string, Photo>;

/** Client felicitations, conferences, and campus days. */
const moment = (name: string, alt: string): Photo => ({
  src: `/images/moments/${name}.webp`,
  alt,
});

export const momentPhotos = {
  felicitation: moment("felicitation-01", "A Sumago client felicitation at the Nashik office"),
  campusJobFair: moment("campus-job-fair", "Sumago hiring at a campus job fair in Nashik"),
  clientMeetingPune: moment("client-meeting-pune", "A Sumago client meeting in Pune"),
  officeGathering: moment("office-gathering", "The team gathered on the Sumago office floor"),
  celebration1: moment("team-celebration-01", "Sumago colleagues marking a festival at the office"),
  celebration2: moment("team-celebration-02", "The Sumago team celebrating together at the office"),
  godavariConclave: moment("godavari-conclave", "Sumago at the Godavari Investment Impact Conclave"),
  awardHandover: moment("award-handover", "A recognition handed over at the Sumago office"),
} as const satisfies Record<string, Photo>;

/**
 * The whole team at an awards evening — the frame that closes the /about story
 * slideshow, after the two founders.
 *
 * Sits at `/images/aboutnew.webp` rather than under `moments/` because it did
 * not come through `image-manifest.mjs`; renaming it would only break the path
 * an editor already knows.
 *
 * It is a 2.9:1 panorama in a 16/9 frame, so the slideshow crops roughly a
 * sixth off each end. The centre of the frame is where the leadership sits, so
 * the crop keeps the subject — but it is the reason this photograph should not
 * be reused in a taller slot without a purpose-made crop.
 */
export const teamAwardsEvening: Photo = {
  src: "/images/aboutnew.webp",
  alt: "The Sumago team together at a company awards evening",
};

/**
 * Leadership headshots, unnamed on purpose (see the file header). Editors pick
 * one of these in the panel and attach the name there; nothing on the site
 * asserts an identity from this list.
 */
export const leadershipHeadshots: string[] = Array.from(
  { length: 12 },
  (_, i) => `/images/leadership/leader-${String(i + 1).padStart(2, "0")}.webp`,
);

/**
 * Named leadership portraits — the one set here where a face is asserted to
 * belong to a name, because these arrived already identified (the originals sit
 * in `public/leader board photo/`, filed under each person's name).
 *
 * Built outside `image-manifest.mjs` on purpose: the manifest indexes
 * `assets-source/` by position, and these did not come from that archive. They
 * were encoded once from the named originals into `public/images/leadership/named/`
 * at 900px — twice the widest slot they fill (18rem in the /team spotlight).
 *
 * A portrait added here is a real photograph of a real person: it must never
 * carry the `stock` flag, and the name beside it must be verified before it
 * ships. Roles are NOT recorded here — they belong to the person, not the
 * photograph, and the admin panel (Founders & Leadership) is where they are set.
 */
const namedPortrait = (file: string, name: string): Photo => ({
  src: `/images/leadership/named/${file}.webp`,
  alt: `${name} of Sumago Infotech`,
});

export const founderPortraits = {
  sudhirGorade: namedPortrait("sudhir-gorade", "Sudhir Gorade"),
  sonaliGorade: namedPortrait("sonali-gorade", "Sonali Gorade"),
} as const satisfies Record<string, Photo>;

/**
 * The founders on a stage, as opposed to `founderPortraits` above, which are
 * headshots. Both name a face, so the same rule applies: verified identity, no
 * `stock` flag, ever.
 *
 * These sit in `public/images/people/` as JPEGs rather than beside the WebP
 * portraits, because they arrived from the event photographer rather than
 * through `image-manifest.mjs`. `next/image` re-encodes them on the way out, so
 * the format costs the visitor nothing.
 *
 * The alt says what the photograph shows — someone speaking at a podium — not
 * which event it was. The occasion is not recorded anywhere the site can check,
 * and naming one would be inventing a fact (CLAUDE.md).
 */
export const founderSpeaking = {
  sudhirGorade: {
    src: "/images/people/sudhir.jpeg",
    alt: "Sudhir Gorade of Sumago Infotech speaking at a podium",
  },
  sonaliGorade: {
    src: "/images/people/sonali.jpeg",
    alt: "Sonali Gorade of Sumago Infotech speaking at a podium",
  },
} as const satisfies Record<string, Photo>;

export const namedLeadershipPortraits = {
  diptiPawar: namedPortrait("dipti-pawar", "Dipti Pawar"),
  pankajPathak: namedPortrait("pankaj-pathak", "Pankaj Pathak"),
  prachiGavali: namedPortrait("prachi-gavali", "Prachi Gavali"),
  prasadPawar: namedPortrait("prasad-pawar", "Prasad Pawar"),
  satishA: namedPortrait("satish-a", "Satish A"),
  vrushaliVarpe: namedPortrait("vrushali-varpe", "Vrushali Varpe"),
  yashGhodake: namedPortrait("yash-ghodake", "Yash Ghodake"),
} as const satisfies Record<string, Photo>;

/**
 * The branded-shirt headshot series — one backdrop, one lighting setup, so
 * they read as a set in a grid rather than as twelve unrelated photographs.
 * Unnamed for the same reason as the leadership set.
 */
export const teamHeadshots: Photo[] = Array.from({ length: 12 }, (_, i) => ({
  src: `/images/people/person-${String(i + 1).padStart(2, "0")}.webp`,
  alt: "A member of the Sumago team",
}));

/* ---------------------------------------------------------------------- *
 * Culture and events
 * ---------------------------------------------------------------------- */

/**
 * The auto-scrolling culture collage, shared by /about, /life-at-sumago and
 * the home page. Ordered so the strip alternates between people and place —
 * two group shots in a row read as one photograph at scroll speed.
 */
export const cultureGallery: Photo[] = [
  teamPhotos.everyone,
  candidPhotos.engineersAtWork,
  officePhotos.openPlan,
  teamPhotos.groupOutdoor1,
  candidPhotos.teamAtDesks,
  officePhotos.workspacePod,
  teamPhotos.groupFormal1,
  momentPhotos.celebration1,
  officePhotos.developmentFloor,
  teamPhotos.groupFormal3,
  candidPhotos.openFloorBusy,
  officePhotos.conferenceRoom,
  teamPhotos.groupOutdoor3,
  momentPhotos.officeGathering,
  officePhotos.reception,
  teamPhotos.briefing,
  candidPhotos.officeCeremony,
  officePhotos.desksByWindow,
  teamPhotos.groupOutdoor2,
  candidPhotos.awardsCabinet,
];

/**
 * "The team at work" strip on /team — office days, client meetings,
 * conferences, hackathons, and the gatherings in between.
 */
export const teamMomentPhotos: Photo[] = [
  candidPhotos.engineersAtWork,
  teamPhotos.everyone,
  { src: "/images/events/conferences/ai-expo-01.webp", alt: "The Sumago team at the India AI Impact Expo 2026" },
  { src: "/images/events/hackathons/hackathon-hall.webp", alt: "Participants filling the hall at the Gemma hackathon hosted by Sumago" },
  momentPhotos.clientMeetingPune,
  candidPhotos.teamAtDesks,
  officePhotos.conferenceRoom,
  { src: "/images/events/conferences/godavari-conclave.webp", alt: "Sumago at the Godavari Investment Impact Conclave" },
  { src: "/images/events/hackathons/hackathon-winners.webp", alt: "The winning team at the Gemma hackathon" },
  teamPhotos.groupOutdoor1,
  momentPhotos.felicitation,
  candidPhotos.openFloorBusy,
  { src: "/images/events/carnival/carnival-group.webp", alt: "The Sumago team at the annual carnival" },
  momentPhotos.campusJobFair,
];

/**
 * Covers for the Proof of Work stories, keyed by story slug.
 *
 * Each one is the frame in the archive closest to what its story describes —
 * engineers heads-down for a build, a training session for a workshop. None of
 * them photographs the client's product, because no such photograph is Sumago's
 * to publish; what they show is the work behind it, which is owned and true.
 * The alt text says what the photograph is, not what the story is, so a reader
 * is never told they are looking at the client's system.
 *
 * Resolution is the constraint on this list. These fill a 16/9 card about
 * 600px across on the /impact grid and a 768px slot on the story page, so
 * every entry is landscape and at least 1200px wide — the 680px candid set
 * would render soft on a high-density screen at either size.
 */
export const caseStudyCovers = {
  "mahindra-rise-app-launch": {
    src: "/images/events/hackathons/hackathon-building-01.webp",
    alt: "Teams building through the night at the Gemma hackathon hosted by Sumago",
  },
  "nasscom-indian-oil-ai-ml-workshop": {
    src: "/images/team/session-briefing.webp",
    alt: "A hands-on training session at Sumago's Nashik office",
  },
  "webespoke-ai": {
    src: "/images/events/conferences/ai-expo-02.webp",
    alt: "Sumago at the India AI Impact Expo 2026 in New Delhi",
  },
  "mamastops-logistics-platform": {
    src: "/images/office/development-floor.webp",
    alt: "The development floor at Sumago's Nashik office",
  },
} as const satisfies Record<string, Photo>;

export type EventGallery = {
  key: string;
  title: string;
  images: Photo[];
};

/**
 * The selectable galleries on /life-at-sumago, and the rows the panel seeds.
 *
 * Categories follow the archive as it actually is — the events Sumago runs —
 * rather than a generic festivals/conferences/trips split. `key` is what the
 * CMS stores, so renaming one orphans its published gallery.
 */
export const realEventGalleries: EventGallery[] = [
  {
    key: "office-opening",
    title: "Opening the new office",
    images: [
      { src: "/images/events/office-opening/ribbon-cutting-01.webp", alt: "Cutting the ribbon at Sumago's new office" },
      { src: "/images/events/office-opening/ribbon-cutting-02.webp", alt: "The ribbon-cutting at the opening of Sumago's new office" },
      { src: "/images/events/office-opening/opening-ceremony.webp", alt: "The traditional ceremony opening Sumago's new office" },
      { src: "/images/events/office-opening/opening-family.webp", alt: "Families joining the opening of Sumago's new office" },
      { src: "/images/events/office-opening/opening-group-01.webp", alt: "The team at the opening of Sumago's new office" },
      { src: "/images/events/office-opening/opening-team.webp", alt: "The Sumago team at the new office on opening day" },
      { src: "/images/events/office-opening/ribbon-cutting-03.webp", alt: "The team at the ribbon-cutting for Sumago's new office" },
      { src: "/images/events/office-opening/opening-group-02.webp", alt: "Colleagues at the opening of Sumago's new office" },
      { src: "/images/events/office-opening/opening-floor.webp", alt: "The new Sumago office floor, ready on opening day" },
      { src: "/images/events/office-opening/opening-cabin.webp", alt: "A meeting room in Sumago's new office on opening day" },
    ],
  },
  {
    key: "hackathons",
    title: "Hackathons",
    images: [
      { src: "/images/events/hackathons/hackathon-hall.webp", alt: "Participants filling the hall at the Gemma hackathon hosted by Sumago" },
      { src: "/images/events/hackathons/hackathon-building-01.webp", alt: "Teams building through the night at the Gemma hackathon" },
      { src: "/images/events/hackathons/hackathon-briefing.webp", alt: "The opening briefing at the Gemma hackathon" },
      { src: "/images/events/hackathons/hackathon-building-02.webp", alt: "A team working on their entry at the Gemma hackathon" },
      { src: "/images/events/hackathons/hackathon-winners.webp", alt: "The winning team at the Gemma hackathon" },
      { src: "/images/events/hackathons/hackathon-prize-01.webp", alt: "A prize handed over at the Gemma hackathon" },
      { src: "/images/events/hackathons/hackathon-prize-02.webp", alt: "A participant receiving their award at the Gemma hackathon" },
      { src: "/images/events/hackathons/hackathon-congratulations.webp", alt: "Congratulations at the close of the Gemma hackathon" },
    ],
  },
  {
    key: "conferences",
    title: "Conferences & summits",
    images: [
      { src: "/images/events/conferences/ai-expo-02.webp", alt: "Sumago at the India AI Impact Expo 2026 in New Delhi" },
      { src: "/images/events/conferences/ai-expo-01.webp", alt: "The Sumago team at the India AI Impact Expo 2026" },
      { src: "/images/events/conferences/godavari-conclave.webp", alt: "Sumago at the Godavari Investment Impact Conclave" },
      { src: "/images/events/conferences/campus-job-fair.webp", alt: "Sumago recruiting at a campus job fair" },
    ],
  },
  {
    key: "carnival",
    title: "The annual carnival",
    images: [
      { src: "/images/events/carnival/carnival-group.webp", alt: "The Sumago team at the annual carnival" },
      { src: "/images/events/carnival/carnival-award-01.webp", alt: "An award presented at the annual Sumago carnival" },
      { src: "/images/events/carnival/carnival-tables-01.webp", alt: "Colleagues at the annual Sumago carnival" },
      { src: "/images/events/carnival/carnival-award-02.webp", alt: "Recognising colleagues at the annual Sumago carnival" },
      { src: "/images/events/carnival/carnival-lineup.webp", alt: "The team lined up at the annual Sumago carnival" },
      { src: "/images/events/carnival/carnival-tables-02.webp", alt: "The team together at the annual Sumago carnival" },
      { src: "/images/events/carnival/carnival-award-03.webp", alt: "An award moment at the annual Sumago carnival" },
      { src: "/images/events/carnival/carnival-host.webp", alt: "Hosting the annual Sumago carnival" },
    ],
  },
  {
    key: "celebrations",
    title: "Milestones & celebrations",
    images: [
      { src: "/images/events/celebrations/anniversary-10-years.webp", alt: "Marking ten years of Sumago Infotech" },
      { src: "/images/events/celebrations/anniversary-lamp.webp", alt: "Lighting the lamp at Sumago's tenth-anniversary celebration" },
      { src: "/images/events/celebrations/anniversary-rangoli.webp", alt: "A rangoli made for Sumago's anniversary celebration" },
      { src: "/images/events/celebrations/anniversary-guests-01.webp", alt: "Guests at Sumago's tenth-anniversary celebration" },
      { src: "/images/events/celebrations/anniversary-guests-02.webp", alt: "On stage at Sumago's tenth-anniversary celebration" },
      { src: "/images/events/celebrations/anniversary-address.webp", alt: "Addressing the room at Sumago's anniversary celebration" },
      { src: "/images/events/celebrations/mens-day-group.webp", alt: "The team marking Men's Day at the Sumago office" },
      { src: "/images/events/celebrations/mens-day-lineup.webp", alt: "Colleagues celebrating Men's Day at the office" },
      { src: "/images/events/celebrations/mens-day-cake.webp", alt: "Cutting the cake on Men's Day at the Sumago office" },
    ],
  },
  {
    key: "festivals",
    title: "Festivals",
    images: [
      { src: "/images/events/festivals/holi-colours-01.webp", alt: "Colleagues celebrating Holi together" },
      { src: "/images/events/festivals/diwali-group.webp", alt: "The team celebrating Diwali at the Sumago office" },
      { src: "/images/events/festivals/holi-group.webp", alt: "The Sumago team gathered for Holi" },
      { src: "/images/events/festivals/adhik-maas-01.webp", alt: "The team marking Adhik Maas at the Sumago office" },
      { src: "/images/events/festivals/holi-colours-02.webp", alt: "The Sumago team celebrating Holi" },
      { src: "/images/events/festivals/christmas-outing-01.webp", alt: "The Sumago team on a Christmas outing" },
      { src: "/images/events/festivals/diwali-office.webp", alt: "Diwali celebrations on the Sumago office floor" },
      { src: "/images/events/festivals/adhik-maas-02.webp", alt: "An Adhik Maas celebration at the Sumago office" },
      { src: "/images/events/festivals/holi-sunset.webp", alt: "Sumago's Holi celebration at sunset" },
      { src: "/images/events/festivals/christmas-outing-02.webp", alt: "A Sumago team outing at Christmas" },
      { src: "/images/events/festivals/diwali-gathering.webp", alt: "Colleagues gathering for Diwali at the office" },
      { src: "/images/events/festivals/christmas-gifts.webp", alt: "Gifts exchanged at Sumago's Christmas celebration" },
    ],
  },
];
