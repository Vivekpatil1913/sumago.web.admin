# Photography — what shipped, and what still needs a decision

Sumago's own photography now carries the site. This file says where it came
from, where it went, and the one thing that still needs a human.

## The pipeline

```
assets-source/            master originals, 337 files, 786 MB — untracked, never served
      │
      │  npm run build:images        (scripts/build-image-assets.mjs)
      │  curated cut lives in        scripts/image-manifest.mjs
      ▼
public/images/            114 optimised webp, 9.2 MB — this is what ships
      │
      ▼
src/lib/real-assets.ts    the registry every page imports
```

Editing the manifest and re-running `npm run build:images` is the whole
workflow. The build log prints `<source file> → <output>` for every asset, so
if an original is renamed upstream the changed source shows up in the log
rather than as a quietly swapped photograph.

`assets-source/` is gitignored. Keep a backup of it somewhere that is not this
repository — it is the only copy of the originals.

## What is now real

| Surface | Was | Now |
| --- | --- | --- |
| Culture collage (`/about`, `/life-at-sumago`, home) | 20 Unsplash stills | 20 Sumago photographs |
| Event galleries (`/life-at-sumago`) | 5 invented stock categories | 6 real events, 51 photographs |
| Team-at-work strip (`/team`) | 14 Unsplash stills | 14 Sumago photographs |
| About page hero image | Unsplash office | Sumago's Nashik engineering floor |
| Contact "Schedule a consultation" backdrop | Unsplash meeting room | Sumago's own conference room |
| Home innovation band | Unsplash abstract | Sumago at the India AI Impact Expo 2026 |
| Industry tile fallback | Unsplash abstract | Sumago's own floor |

The six event categories are the events Sumago actually runs, not a generic
split: **Opening the new office**, **Hackathons**, **Conferences & summits**,
**The annual carnival**, **Milestones & celebrations**, **Festivals**.

## ⚠️ The one open decision: who is who

Twelve leadership headshots and twelve team headshots are built and live at
`/images/leadership/leader-01…12.webp` and `/images/people/person-01…12.webp`.
**None of them is attached to a name anywhere in the code**, because nothing in
the archive establishes which face belongs to which person — `6575.jpg` and
`pathak.jpg` are plainly the same man, and `pathak` is not a Gorade.

A wrong name against a real person is a public error, so the site still renders
flagged stock in the two named founder slots (`/team`, home leadership band)
rather than a real face that might be the wrong one.

**To fix it:** open the admin panel → **Founders & Leadership**, and for each
person set their portrait to the matching file below. The record wins over the
code the moment it has a photo, so no code change is needed.

Contact sheets, with filenames printed under each face:

- `docs/asset-index-leadership.jpg` — the 12 leadership headshots
- `docs/asset-index-people.jpg` — the 12 branded-shirt team headshots

Source files, in build order, if you would rather work from the originals in
`assets-source/03_Leadership/`:

| Built file | Original |
| --- | --- |
| `leader-01.webp` | `63199ff1-dd1f-4334-a4a7-8b79bf9a182c.jpg` |
| `leader-02.webp` | `6575.jpg` |
| `leader-03.webp` | `a4c7f3e4-133b-4a7c-91b7-3b054d3c7f02.jpg` |
| `leader-04.webp` | `ChatGPT Image Feb 12, 2026, 05_51_57 PM (1).png` |
| `leader-05.webp` | `hr.jpg` |
| `leader-06.webp` | `image (16).png` |
| `leader-07.webp` | `image (17).png` |
| `leader-08.webp` | `image (18).png` |
| `leader-09.webp` | `image (20).png` |
| `leader-10.webp` | `image (21).png` |
| `leader-11.webp` | `image-removebg-preview - 2026-08-06T144740.647.png` |
| `leader-12.webp` | `pathak.jpg` |

`leader-03` is a two-person portrait — if that is the founder and co-founder
together, it belongs on the About page rather than in a single-person slot.

Once names are set in the panel, `previewImages.founder` / `.cofounder` can be
deleted from `src/lib/preview-assets.ts` along with their two call sites.

## What is deliberately still stock

Nothing here is an oversight; each has a reason.

- **Blog and case-study covers** (7). Every one of those posts is `[SAMPLE COPY]`.
  Putting real photography on invented content makes the content look more
  credible than it is. They graduate when the copy does.
- **Industry tiles** (10). No owned photograph of a client's factory floor,
  hospital, or warehouse exists. Sumago's own office standing in for a client's
  would be its own kind of dishonest.
- **Service detail imagery** (`mobile-app-engineering`, 4 slots). Needs real
  screenshots of Sumago-built apps on real devices.
- **Seed department leaders** (7). Those names are invented placeholders; real
  faces against invented names would be worse than stock. Delete the seed list
  once the panel has real leaders with a Department set.

## Excluded on purpose

Roughly 20 otherwise-usable frames were dropped because SCOPE branding is
visible — backdrops at the anniversary event, signage on two office exteriors,
a banner behind a podium. SCOPE is a separate business and may appear only in
the brand gateway (see `CLAUDE.md`). **Check the backdrop before adding entries
to the manifest.**

## Known quality gaps

- **Nobody working, at full resolution.** The only frames of people actually at
  their desks are 680 px (`public/images/office/candid/`). They are fine in a
  mosaic tile, which never renders past ~500 px, and they are wired nowhere
  else. A proper shoot of the working floor is the single highest-value
  addition to this archive.
- Men's Day, Diwali and Christmas sources top out at 510–637 px, and the office
  opening set at 956 px. Acceptable in a gallery grid, not for a hero.
- The rest of the office set is 1280 px native, which is why the `office` group
  caps there — asking for 1600 would only upscale.
