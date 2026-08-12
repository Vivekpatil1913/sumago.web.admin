/**
 * The curated cut of Sumago's own photography.
 *
 * ## How to read an entry
 *
 * `[folder, n, name, alt]` — `n` is the 1-based position of the file inside
 * `assets-source/<folder>` when its images are sorted by filename. Positions,
 * not filenames, because the originals are camera dumps
 * ("WhatsApp Image 2026-08-07 at 10.53.04 AM (2).jpeg") and a rename upstream
 * would silently repoint a slot. `npm run build:images` prints the resolved
 * filename for every entry, so a drift shows up as a changed source in the
 * log rather than as a quietly swapped photograph.
 *
 * ## What is deliberately not here
 *
 * Anything showing SCOPE branding — banners, backdrops, signage. SCOPE is a
 * separate business and may appear only in the brand gateway (see CLAUDE.md),
 * so ~20 otherwise-usable frames from the anniversary and office sets are
 * excluded on that ground alone. If you add entries, check the backdrop.
 *
 * Alt text is written here, once, and travels with the asset into the registry
 * — an image that reaches a page without one fails the accessibility gate.
 */

/** Source folders under `assets-source/`. */
const OFFICE = "01_Office_Images";
const TEAM = "02_Team_Photos";
const PEOPLE = "02_Team_Photos/Individual_Photos";
const LEADERSHIP = "03_Leadership";
const MIX = "08_Mix Data";
const EV = "06_Events";

/**
 * Output groups. `width` is the largest the asset is ever displayed at
 * (see the `sizes` on each consumer), doubled for 2× screens where the slot is
 * small enough for that to be cheap.
 */
export const groups = [
  {
    /* The facility, at the best resolution the archive holds. Everything here
       is 1280px native, which is also why the group caps at 1280 rather than
       1600: asking for more would only upscale. These carry the hero and
       half-width slots, so they have to hold up large. */
    dir: "office",
    width: 1280,
    entries: [
      [OFFICE, 69, "open-plan-workspace", "Sumago's open-plan engineering floor in Nashik"],
      [OFFICE, 68, "workspace-pod", "Workstations and a discussion pod on Sumago's office floor"],
      [OFFICE, 66, "development-floor", "The development floor at Sumago's Nashik office"],
      [OFFICE, 63, "desks-by-window", "Workstations along the window at Sumago's office"],
      [OFFICE, 29, "workspace-hall", "A newly fitted-out floor at Sumago's Nashik office"],
      [OFFICE, 76, "workroom", "A project room at Sumago's Nashik office"],
      [OFFICE, 73, "meeting-room-small", "A small meeting room at Sumago's office"],
      [OFFICE, 74, "conference-room", "The conference room at Sumago's office"],
      [OFFICE, 75, "manager-cabin", "A manager's cabin at Sumago's Nashik office"],
      [OFFICE, 79, "reception", "Reception at Sumago's Nashik office"],
      [OFFICE, 64, "seminar-room", "The seminar room at Sumago's Nashik office"],
      [OFFICE, 58, "training-room", "A training room at Sumago's Nashik office"],
      [OFFICE, 55, "computer-lab", "A workstation lab at Sumago's Nashik office"],
      [OFFICE, 23, "building-street", "The Sumago Infotech office in Nashik, seen from the street"],
    ],
  },
  {
    /* The only frames in the archive that show people actually at work in the
       office — and they exist at 680px only. That is fine for a mosaic tile,
       which never renders wider than ~500px, and not fine for anything
       full-bleed, so nothing here is wired to a hero.
       [REAL ASSET NEEDED] Re-shoot the working floor at full resolution. */
    dir: "office/candid",
    width: 680,
    entries: [
      [OFFICE, 7, "engineers-at-work", "Sumago engineers at work on the Nashik development floor"],
      [OFFICE, 9, "open-floor-busy", "A working day on Sumago's development floor"],
      [OFFICE, 10, "team-at-desks", "Sumago's engineering team at their workstations"],
      [OFFICE, 11, "office-ceremony", "The team at an office ceremony at Sumago"],
      [OFFICE, 16, "awards-cabinet", "Awards and recognition on display at Sumago's office"],
      [OFFICE, 17, "boardroom", "The boardroom at Sumago's Nashik office"],
      [OFFICE, 18, "reception-lounge", "The reception lounge at Sumago's office"],
      [OFFICE, 19, "office-lounge", "A waiting and breakout area at Sumago's office"],
      [OFFICE, 20, "building-exterior", "The Sumago Infotech office building in Nashik"],
    ],
  },
  {
    dir: "team",
    width: 1600,
    entries: [
      [TEAM, 10, "everyone", "The Sumago Infotech team together at the Nashik office"],
      [TEAM, 6, "group-formal-01", "Part of the Sumago team at a company gathering"],
      [TEAM, 7, "group-formal-02", "Sumago colleagues at a company gathering"],
      [TEAM, 9, "group-formal-03", "Sumago colleagues at a company celebration"],
      [TEAM, 11, "group-outdoor-01", "The Sumago team outside the Nashik office"],
      [TEAM, 12, "group-outdoor-02", "Sumago colleagues outside the office"],
      [TEAM, 13, "group-outdoor-03", "The Sumago team gathered outdoors at the office"],
      [TEAM, 14, "session-briefing", "A team briefing session at Sumago's office"],
    ],
  },
  {
    /* Leadership headshots, deliberately unnamed. Which face belongs to which
       name is set in the admin panel (Founders & Leadership), not here — see
       docs note in ASSET-INDEX.md. A wrong name against a real face is a
       public error, and the panel is where that content lives anyway. */
    dir: "leadership",
    width: 800,
    entries: [
      [LEADERSHIP, 1, "leader-01", "A member of Sumago's leadership team"],
      [LEADERSHIP, 2, "leader-02", "A member of Sumago's leadership team"],
      [LEADERSHIP, 3, "leader-03", "A member of Sumago's leadership team"],
      [LEADERSHIP, 4, "leader-04", "A member of Sumago's leadership team"],
      [LEADERSHIP, 5, "leader-05", "A member of Sumago's leadership team"],
      [LEADERSHIP, 6, "leader-06", "A member of Sumago's leadership team"],
      [LEADERSHIP, 7, "leader-07", "A member of Sumago's leadership team"],
      [LEADERSHIP, 8, "leader-08", "A member of Sumago's leadership team"],
      [LEADERSHIP, 9, "leader-09", "A member of Sumago's leadership team"],
      [LEADERSHIP, 10, "leader-10", "A member of Sumago's leadership team"],
      [LEADERSHIP, 11, "leader-11", "A member of Sumago's leadership team"],
      [LEADERSHIP, 12, "leader-12", "A member of Sumago's leadership team"],
    ],
  },
  {
    /* The branded-shirt headshot set — one lighting setup, one backdrop, so
       they read as a series in a grid. Also unnamed, for the same reason. */
    dir: "people",
    width: 800,
    entries: [
      [PEOPLE, 21, "person-01", "A member of the Sumago team"],
      [PEOPLE, 27, "person-02", "A member of the Sumago team"],
      [PEOPLE, 28, "person-03", "A member of the Sumago team"],
      [PEOPLE, 31, "person-04", "A member of the Sumago team"],
      [PEOPLE, 33, "person-05", "A member of the Sumago team"],
      [PEOPLE, 37, "person-06", "A member of the Sumago team"],
      [PEOPLE, 40, "person-07", "A member of the Sumago team"],
      [PEOPLE, 41, "person-08", "A member of the Sumago team"],
      [PEOPLE, 44, "person-09", "A member of the Sumago team"],
      [PEOPLE, 46, "person-10", "A member of the Sumago team"],
      [PEOPLE, 49, "person-11", "A member of the Sumago team"],
      [PEOPLE, 52, "person-12", "A member of the Sumago team"],
    ],
  },
  {
    dir: "moments",
    width: 1200,
    entries: [
      [MIX, 1, "felicitation-01", "A Sumago client felicitation at the Nashik office"],
      [MIX, 2, "campus-job-fair", "Sumago hiring at a campus job fair in Nashik"],
      [MIX, 7, "client-meeting-pune", "A Sumago client meeting in Pune"],
      [MIX, 11, "office-gathering", "The team gathered on the Sumago office floor"],
      [MIX, 13, "team-celebration-01", "Sumago colleagues marking a festival at the office"],
      [MIX, 14, "team-celebration-02", "The Sumago team celebrating together at the office"],
      [MIX, 20, "godavari-conclave", "Sumago at the Godavari Investment Impact Conclave"],
      [MIX, 6, "award-handover", "A recognition handed over at the Sumago office"],
    ],
  },

  /* ------------------------------------------------------------------ *
   * Event galleries. One folder per category — these become the CMS
   * fallback galleries on /life-at-sumago and the seeded rows in the panel.
   * ------------------------------------------------------------------ */
  {
    dir: "events/conferences",
    width: 1200,
    entries: [
      [`${EV}/AI Summit`, 1, "ai-expo-01", "The Sumago team at the India AI Impact Expo 2026"],
      [`${EV}/AI Summit`, 2, "ai-expo-02", "Sumago at the India AI Impact Expo 2026 in New Delhi"],
      [MIX, 20, "godavari-conclave", "Sumago at the Godavari Investment Impact Conclave"],
      [MIX, 2, "campus-job-fair", "Sumago recruiting at a campus job fair"],
    ],
  },
  {
    dir: "events/hackathons",
    width: 1200,
    entries: [
      [`${EV}/Gemma Hackthon`, 3, "hackathon-hall", "Participants filling the hall at the Gemma hackathon hosted by Sumago"],
      [`${EV}/Gemma Hackthon`, 1, "hackathon-building-01", "Teams building through the night at the Gemma hackathon"],
      [`${EV}/Gemma Hackthon`, 6, "hackathon-briefing", "The opening briefing at the Gemma hackathon"],
      [`${EV}/Gemma Hackthon`, 7, "hackathon-building-02", "A team working on their entry at the Gemma hackathon"],
      [`${EV}/Gemma Hackthon`, 8, "hackathon-winners", "The winning team at the Gemma hackathon"],
      [`${EV}/Gemma Hackthon`, 4, "hackathon-prize-01", "A prize handed over at the Gemma hackathon"],
      [`${EV}/Gemma Hackthon`, 9, "hackathon-prize-02", "A participant receiving their award at the Gemma hackathon"],
      [`${EV}/Gemma Hackthon`, 10, "hackathon-congratulations", "Congratulations at the close of the Gemma hackathon"],
    ],
  },
  {
    dir: "events/office-opening",
    width: 1200,
    entries: [
      [`${EV}/Office Opening`, 8, "ribbon-cutting-01", "Cutting the ribbon at Sumago's new office"],
      [`${EV}/Office Opening`, 9, "ribbon-cutting-02", "The ribbon-cutting at the opening of Sumago's new office"],
      [`${EV}/Office Opening`, 6, "ribbon-cutting-03", "The team at the ribbon-cutting for Sumago's new office"],
      [`${EV}/Office Opening`, 5, "opening-family", "Families joining the opening of Sumago's new office"],
      [`${EV}/Office Opening`, 10, "opening-group-01", "The team at the opening of Sumago's new office"],
      [`${EV}/Office Opening`, 13, "opening-group-02", "Colleagues at the opening of Sumago's new office"],
      [`${EV}/Office Opening`, 16, "opening-ceremony", "The traditional ceremony opening Sumago's new office"],
      [`${EV}/Office Opening`, 18, "opening-team", "The Sumago team at the new office on opening day"],
      [`${EV}/Office Opening`, 3, "opening-cabin", "A meeting room in Sumago's new office on opening day"],
      [`${EV}/Office Opening`, 1, "opening-floor", "The new Sumago office floor, ready on opening day"],
    ],
  },
  {
    dir: "events/carnival",
    width: 1200,
    entries: [
      [`${EV}/Carnival`, 5, "carnival-group", "The Sumago team at the annual carnival"],
      [`${EV}/Carnival`, 3, "carnival-host", "Hosting the annual Sumago carnival"],
      [`${EV}/Carnival`, 8, "carnival-tables-01", "Colleagues at the annual Sumago carnival"],
      [`${EV}/Carnival`, 11, "carnival-tables-02", "The team together at the annual Sumago carnival"],
      [`${EV}/Carnival`, 14, "carnival-award-01", "An award presented at the annual Sumago carnival"],
      [`${EV}/Carnival`, 15, "carnival-award-02", "Recognising colleagues at the annual Sumago carnival"],
      [`${EV}/Carnival`, 17, "carnival-award-03", "An award moment at the annual Sumago carnival"],
      [`${EV}/Carnival`, 16, "carnival-lineup", "The team lined up at the annual Sumago carnival"],
    ],
  },
  {
    dir: "events/celebrations",
    width: 1200,
    entries: [
      [`${EV}/Anniversary`, 20, "anniversary-10-years", "Marking ten years of Sumago Infotech"],
      [`${EV}/Anniversary`, 2, "anniversary-rangoli", "A rangoli made for Sumago's anniversary celebration"],
      [`${EV}/Anniversary`, 6, "anniversary-lamp", "Lighting the lamp at Sumago's tenth-anniversary celebration"],
      [`${EV}/Anniversary`, 3, "anniversary-guests-01", "Guests at Sumago's tenth-anniversary celebration"],
      [`${EV}/Anniversary`, 5, "anniversary-guests-02", "On stage at Sumago's tenth-anniversary celebration"],
      [`${EV}/Anniversary`, 11, "anniversary-address", "Addressing the room at Sumago's anniversary celebration"],
      [`${EV}/Mens Day`, 1, "mens-day-group", "The team marking Men's Day at the Sumago office"],
      [`${EV}/Mens Day`, 18, "mens-day-lineup", "Colleagues celebrating Men's Day at the office"],
      [`${EV}/Mens Day`, 5, "mens-day-cake", "Cutting the cake on Men's Day at the Sumago office"],
    ],
  },
  {
    dir: "events/festivals",
    width: 1200,
    entries: [
      [`${EV}/Holi`, 2, "holi-colours-01", "Colleagues celebrating Holi together"],
      [`${EV}/Holi`, 3, "holi-colours-02", "The Sumago team celebrating Holi"],
      [`${EV}/Holi`, 1, "holi-group", "The Sumago team gathered for Holi"],
      [`${EV}/Holi`, 4, "holi-sunset", "Sumago's Holi celebration at sunset"],
      [`${EV}/Diwali`, 12, "diwali-group", "The team celebrating Diwali at the Sumago office"],
      [`${EV}/Diwali`, 2, "diwali-office", "Diwali celebrations on the Sumago office floor"],
      [`${EV}/Diwali`, 3, "diwali-gathering", "Colleagues gathering for Diwali at the office"],
      [`${EV}/Chirsmas`, 1, "christmas-outing-01", "The Sumago team on a Christmas outing"],
      [`${EV}/Chirsmas`, 4, "christmas-outing-02", "A Sumago team outing at Christmas"],
      [`${EV}/Chirsmas`, 3, "christmas-gifts", "Gifts exchanged at Sumago's Christmas celebration"],
      [`${EV}/AdhikMass`, 1, "adhik-maas-01", "The team marking Adhik Maas at the Sumago office"],
      [`${EV}/AdhikMass`, 4, "adhik-maas-02", "An Adhik Maas celebration at the Sumago office"],
    ],
  },
];
