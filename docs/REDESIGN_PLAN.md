# repath.life v2 — "cut glass"

A complete redesign plan for repath.life. New vibe, new structure, Three.js at the core, built from who Repath actually is.

> **The one-line idea:** Waterford is famous for cut crystal. Repath is a Waterford kid who works in a takeaway by day and builds AI tools at night. The site becomes a **piece of living Waterford crystal** that light (his films, his work, his words) passes through and comes out the other side as a spectrum. *One person in, many colours out.*

---

## Table of contents

0. [TL;DR](#0-tldr)
1. [Research dossier: who Repath is](#1-research-dossier-who-repath-is)
2. [Honest audit of the current site](#2-honest-audit-of-the-current-site)
3. [Creative direction: "cut glass"](#3-creative-direction-cut-glass)
4. [Information architecture](#4-information-architecture)
5. [The experience, chapter by chapter](#5-the-experience-chapter-by-chapter)
6. [Product "worlds": one 3D object per product](#6-product-worlds-one-3d-object-per-product)
7. [Personal, live, and secret features](#7-personal-live-and-secret-features)
8. [Design system](#8-design-system)
9. [21st.dev and component sourcing](#9-21stdev-and-component-sourcing)
10. [Tech architecture](#10-tech-architecture)
11. [Media pipeline: films, images, audio](#11-media-pipeline-films-images-audio)
12. [Performance budget and degradation ladder](#12-performance-budget-and-degradation-ladder)
13. [Accessibility](#13-accessibility)
14. [Copy deck](#14-copy-deck)
15. [Build phases with acceptance criteria](#15-build-phases-with-acceptance-criteria)
16. [Risks and mitigations](#16-risks-and-mitigations)
17. [Assets and decisions needed from Repath](#17-assets-and-decisions-needed-from-repath)
18. [Inspiration board](#18-inspiration-board)

---

## 0. TL;DR

| | Today | v2 |
|---|---|---|
| Feeling | Quiet, dark, grain, one square film, serif notes. A diary. | Cinematic, tactile, alive. A crystal object you can turn in your hands. Still honest, still lowercase, but with *pulse*. |
| Hero | "i am repath" fades, random film plays. | A real-time 3D Waterford-crystal prism. Films play *inside* the facets, refracted into a spectrum. Your cursor turns it. |
| Work | Long text page (`/working-on`). | Five product "worlds", each a distinct 3D object (critique terminal monolith, DáilDex Ireland point map, Warren knowledge graph, LeemerChat model stream, LeemerLabs growing lattice). |
| Proof | Flat GitHub calendar. | A 3D GitHub **skyline**: a year of commits as a glass city you fly over. |
| Personal | Notes, letters, narration, presence. | All of that kept, plus live Waterford time + weather (it actually rains on the glass when it rains in Waterford), the takeaway-vs-lab split, Gaeilge mode, a hidden `critique` terminal, and visitor names engraved in the crystal. |
| Stack | React 19 + Vite + Tailwind 4, no 3D. | Same base, plus `three`, `@react-three/fiber`, `drei`, `postprocessing`, `motion`, `lenis`, `zustand`, and selected 21st.dev components. |

The **signature mechanic** we keep from v1: the *develop* effect, where text starts blurred and sharpens like a photograph in a darkroom tray. In v2 everything develops: text, the crystal's clarity, even the colour saturation as you scroll.

---

## 1. Research dossier: who Repath is

Gathered from repath.life, critique.sh, critique.sh/founder, daildex.com, leemerlabs.com, leemerchat.com/about-us, warren.wiki, LinkedIn posts, and GitHub (`repath500`).

### 1.1 The person

- **Repath "Ray" Khan.** "ray to some. repath to the work."
- **Waterford, Ireland.** He's proud of it. Waterford is Ireland's oldest city (founded by Vikings in 914) and is world-famous for **Waterford Crystal**. Reginald's Tower and the Viking Triangle are its landmarks.
- **Two worlds.** From critique.sh/founder: *"I help run a busy takeaway in Waterford — speed, reliability, customers, operations, costs, staff, and pressure are not theory. If something breaks, you feel it immediately."* and *"In a takeaway, nobody cares about your clever theory. Customers wait. Staff stress. Money moves."*
- **Builds at night.** *"young, outside the usual network, building on nights, testing fast."*
- **Founder beliefs (his own five):** speed matters · taste matters · trust matters · small teams deserve power · Ireland can compete globally.
- **Proof over hype.** "github is the receipts." 2,500+ commits in the past year. Billions of tokens through real traffic.
- **Former Analog Devices software intern.** In AI since late 2022 (OrionAI → LeemerChat → Critique → the rest).
- **Emotional register (from the notes and letters):** survival, resolve, grief, brotherhood ("growing up with my brothers"), being lost in the middle, "i'm going to win", "i'm not done. not even close." Profanity used sparingly and on purpose. Everything lowercase.
- **Bar for his own work:** *"Can this make a developer genuinely more dangerous? Faster. Sharper. Less blocked."*

### 1.2 The products (each needs its own visual identity in v2)

| Product | What it is (Oct 2026) | Visual hook for v2 |
|---|---|---|
| **critique.sh** | Independent code review CLI for local changes. `critique finish --intent "…" --json` returns outcome, evidence, limits, exit code. Also CritiqueCode, an open-source agentic coding harness. Community edition open sourced. | Terminal, exit codes, "verdict", a monolith that inspects things. Mono type. Signal green. |
| **DáilDex** (daildex.com) | Follow Irish TDs and Senators, get plain-English, source-linked email alerts when they vote, speak, or ask parliamentary questions. "Ask Dex" AI assistant. 234 representatives, 43 constituencies. Launched 29 Sep 2026; featured in data.gov.ie Open Data Showcase on 1 Oct 2026. Backend open source (MIT). | Map of Ireland made of points, 43 constituencies lighting up as votes come in. Tá/Níl. Civic green. |
| **LeemerChat** | Ireland-built multi-model AI workspace. Started as a backup when GPT-4 went down. Was one of the most used apps on OpenRouter. | Streams of tokens flowing between model "stars". |
| **LeemerLabs** | Independent AI lab in Waterford: Born models (Born-9B Preview), BornBench, European inference, Gaeilge (Irish language) research, private fine-tuning. "A language should not need permission to enter the future." | A lattice that grows: training as organic crystal growth. Gaeilge text. |
| **warren.wiki** | Infinite knowledge explorer. Wiki mode, rabbit-hole mode, AskWarren. "for people who think in networks, not linear articles." | 3D force-directed knowledge graph you can pull on. |

**Note on the name:** the user wrote "DailDex.com". The live product is **daildex.com** (DáilDex, with the fada). `dialdex.com` is a parked domain owned by HugeDomains, so we never link to it. Fun coincidence we can use as an easter egg: the *Rayner Dialdex* is a 1970s gem **refractometer**, an instrument that measures the refractive index of crystal. That fits a site about light passing through crystal almost too well.

### 1.3 What his own product sites already say about taste

critique.sh/founder: *"Developer tools do not have to feel dead. Serious engineering can still have a memorable brand."* and *"Infrastructure can feel alive. Crit, the cinematic product language, the agent-worker framing — intentional."*

So the redesign isn't us imposing a vibe. **Cinematic, alive, memorable** is his stated taste. v1 was the quiet diary. v2 is the same person with the lights on.

---

## 2. Honest audit of the current site

### 2.1 What's genuinely great (keep, elevate)

1. **The voice.** Lowercase, honest, unpolished-on-purpose. Notes like "motivation visits. resolve stays." are the soul of the site. *Do not lose this.*
2. **The develop mechanic.** Blur-to-sharp text tied to video progress is a real signature.
3. **The 11 films** with one-word titles (living, fly, rise, alive, peace, who cares, darkest hours, no option, i am, smile, figure it out).
4. **Narration** via ElevenLabs ("david" voice), music crossfades, and the hidden note you unlock by finishing everything.
5. **Letters to your future self** (`/letter`) with delivery dates, threads, and replies.
6. **Presence** ("someone else is here") and **public names** via Upstash.
7. **GitHub as receipts.**

### 2.2 What's holding it back

1. **No sense of place or scale.** It's a dark rectangle with a square video. Nothing says Waterford, takeaway, Ireland, AI lab, or *ambition*.
2. **The work is buried.** Critique, DáilDex (missing entirely), Warren, and Leemer are paragraphs on a sub-page. A visitor can't *feel* the range of what he's shipped.
3. **DáilDex isn't on the site at all**, even though it's his newest launch and has government recognition (data.gov.ie). That's the single biggest content gap.
4. **Everything uses the same treatment** (stone-500 Stoke label, Crimson body, border-t, repeat). It becomes wallpaper.
5. **Motion is decorative, not spatial.** Fades and rises only. No depth, no interaction, nothing to play with.
6. **Code health:** `App.tsx` is 933 lines and mixes audio engine, video state machine, typography logic, and layout. Desktop and mobile note blocks are duplicated. `README.md` describes an older version. This needs to be untangled before 3D gets added on top.
7. **Mixed-aspect films are forced into a square** (`11.mp4` is portrait 576×1024, `12.mp4` is landscape 1024×576), so they get cropped.

### 2.3 What we drop

- The Stoke font (it reads "wedding invitation", not "builder").
- The flat grain dot overlay (replaced by a real film-grain pass in the post-processing stack).
- The "one random film, then a note" as the *whole* homepage. It becomes one chapter.

---

## 3. Creative direction: "cut glass"

### 3.1 The concept

**Waterford crystal is cut by hand.** Each cut is a decision. Light enters, hits the cuts, and splits into colour. That's the metaphor for the whole site:

- **The crystal = Repath.** Faceted, made by pressure and heat (the takeaway, the hard seasons in the notes).
- **The light = his life and work.** Films, products, commits, words.
- **The spectrum = what comes out.** Five products, a public letter, a record of becoming.

The tagline evolves from *"a record of becoming"* to:

> **repath.life — cut by hand in waterford.**

(Alternative: *"pressure, light, and a lot of commits."* or keep *"a record of becoming"* as the subtitle.)

### 3.2 Three moods, driven by real Waterford time

The site reads the actual time in `Europe/Dublin` and the sun position over Waterford (lat 52.2593, lon −7.1101).

| Mood | When | Look |
|---|---|---|
| **Daylight** | Sunrise → 2h before sunset | Cool white light, crisp refraction, pale glass, ink text on near-white areas inside panels. |
| **Golden** | Around sunset | Low amber light raking across facets, long caustics, warm spectrum. |
| **3am** | Night (default for most visitors, matches when he builds) | Deep ink, sodium-amber street-light glow from one side (the takeaway), cold blue monitor glow from the other (the lab). The signature mood. |

A tiny line in the corner explains it: `waterford · 03:12 · light rain · 9°` so the mood is never random.

### 3.3 Motion principles

1. **One easing curve everywhere**: keep `cubic-bezier(0.16, 1, 0.3, 1)` from v1 (continuity), plus a spring for physical objects (`stiffness 120, damping 18`).
2. **Develop, don't fade.** Reveals go blur → sharp, desaturated → colour, low-refraction → full dispersion.
3. **Physical, not floaty.** Objects have weight. The crystal has inertia when you drag it and settles.
4. **Scroll is a camera dolly**, not a page scroll. The DOM scrolls normally (for accessibility and SEO); the 3D camera follows a spline keyed to scroll progress.
5. **Silence is a feature.** Every chapter has one moment of stillness where nothing moves but the grain.

### 3.4 Sound

- Keep the music bed (`sparky-deathcap-september.mp3`) and narration system.
- Add a tiny **glass sound palette** (4–6 one-shots: soft clink, ring, shimmer, low hum) via Web Audio, pitch-shifted per facet. Muted until first user gesture; respects the existing music mute toggle.
- Spatialise the takeaway ambience (extractor fan hum, distant till beeps, rain) on the left channel and the lab ambience (fan whine, keyboard) on the right in Chapter 02. Subtle, under −24 LUFS.

---

## 4. Information architecture

### 4.1 Routes

| Route | v2 purpose | Notes |
|---|---|---|
| `/` | The full scroll journey (chapters 00–07). | One page, one persistent WebGL canvas. |
| `/work` | Index of all five product worlds. | `/working-on` 301 → `/work`. |
| `/work/critique`, `/work/daildex`, `/work/leemerchat`, `/work/leemerlabs`, `/work/warren` | Deep-dive page per product with its own 3D object full-bleed. | Shareable, own OG image. |
| `/films` | All 11 films as a refracted shard gallery. | `/films/:slug` deep links (e.g. `/films/figure-it-out`). |
| `/notes`, `/notes/:id` | Existing notes feed, restyled as glass cards. | Keep URLs (they've been shared). |
| `/letter`, `/letter/:id` | Repath's public letters plus write-your-own. | Keep URLs and localStorage keys. |
| `/receipts` | Full-screen GitHub skyline. | Optional standalone. |
| `/now` | What he's doing this week. Live GitHub activity, current focus. | Replaces `nowLine`. |

### 4.2 Navigation

- **Desktop:** a floating "lens" nav pill at the top centre (frosted glass, `backdrop-filter`, 1px inner highlight). Items: `films · work · notes · letter · now`. Live clock and weather on the right. Music toggle as a small waveform icon that animates while playing.
- **Mobile:** bottom dock (Magic UI "Dock"-style) with 4 icons + "more" sheet. Thumb-reachable.
- **Command palette** (`⌘K` / `/`): jump to any film, note, product, or letter. Type `critique` to open the secret terminal (see §7).

---

## 5. The experience, chapter by chapter

The homepage is one long scroll with eight chapters. A single R3F `<Canvas>` sits fixed behind the DOM; each chapter registers a "scene state" (camera position, crystal pose, lighting, which objects are visible) and the scene interpolates between them by scroll progress.

### Chapter 00 — Arrival ("i am repath")

**Goal:** first 3 seconds should make someone say "oh."

- Black screen. A single thin line of light draws across (like a laser scoring glass).
- The line splits into a spectrum and the words **i am repath** etch in, letter by letter, as if cut with a wheel (text-scramble that resolves into a glass-material 3D text, or a DOM heading with a shader mask on top).
- The crystal assembles from shards flying in from the edges and locks together with a soft *clink*.
- Below: `waterford, ireland · builder · 03:12` (live) and a small "scroll" cue that is a drop of light falling.
- **Interaction:** drag or move the cursor and the crystal rotates with inertia. Hovering a facet makes it ring (a pitch per facet).
- **Fallback:** if WebGL is unavailable or reduced motion is on, show a pre-rendered crystal still (AVIF) and the heading, no animation.

**The crystal itself:** a procedurally generated faceted shape. Start from an icosahedron with `detail = 1`, apply non-uniform scaling to make it taller (like a cut-glass tumbler or obelisk, nodding to Reginald's Tower), flat-shade it so the cuts read clearly. Material: drei `MeshTransmissionMaterial` with `thickness ~1.2`, `ior ~1.56` (lead crystal territory), `chromaticAberration ~0.06`, `anisotropy ~0.3`, `distortion ~0.1`, `backside: true`. Behind it is an environment the crystal refracts (see Chapter 01).

### Chapter 01 — Frames (the films)

**Goal:** the films become *the light that passes through the crystal.*

- As you scroll in, the camera pushes past the crystal. Behind it, the films are revealed playing on **11 floating shards** (thin bevelled glass slabs) arranged in a loose arc. Each shard's aspect matches its film (square, portrait, landscape), so no more cropping.
- The shards play a **muted 3-second loop preview** (generated by the media pipeline). The crystal in the foreground refracts them, so you see the films broken into spectra through the glass.
- **Click a shard:** it flies to centre and scales up, the others dim and drift back, the full-quality film loads and plays **with sound** (same autoplay-with-sound logic as v1, same "tap for sound" fallback), and the music crossfades exactly as today.
- **When the film ends:** the *develop* moment. The note (or letter line) appears beside the film blurred and sharpens. "listen" plays the narration. Buttons: `play again · another frame · share`.
- **Film title** is engraved on the bottom edge of each shard in tiny caps: `09 · no option`.
- **Mobile:** shards become a vertical snap carousel (one film per screen), still 3D but camera-locked; tap to play.

### Chapter 02 — Two worlds

**Goal:** make the takeaway-by-day, AI-by-night story *physical*.

- Full-bleed split screen with a **draggable divider** (cursor or thumb).
  - **Left: the takeaway.** Warm sodium amber. A scrolling rail of **order tickets** (thermal-printer style, monospace, torn edge) that print in from the top: `#2514 · 2× spice bag · 1× curry chips · collection 18:40`. Steam particles rise. Ambient: extractor hum.
  - **Right: the lab.** Cold blue. A terminal printing real-looking agent output: `critique finish --intent "stop duplicate charges"` → `outcome repair_ready` → `exit 2`. Ambient: keyboard.
- As you drag the divider toward centre, the two sides' light **mixes into white** on the crystal, which hangs in the middle. That's the thesis: both worlds make the person.
- Copy (his own words, lightly trimmed): *"in a takeaway, nobody cares about your clever theory. customers wait. staff stress. money moves. that shaped how i think about software."*
- Implementation: two DOM panels with `clip-path` driven by a motion value; the WebGL layer reads the same value for light mixing. Tickets are DOM (crisp text) on top of a WebGL steam layer.

### Chapter 03 — The work (spectrum)

**Goal:** show the range. Five products, five colours, five objects.

- The crystal splits white light into **five beams** (a nod to Pink Floyd's prism, but the beams are coloured to match each product). Each beam lands on a product object (§6).
- Horizontal scroll-jacked section on desktop (pinned, scroll moves the camera along the spectrum). Vertical stack on mobile.
- Each product card: name, one-line role, one-line origin story (from v1 `ecosystem.ts`, e.g. "born from watching agents write code nobody trusted to merge."), a live stat where possible (DáilDex: "234 representatives tracked"; Critique: latest CLI version; GitHub stars), and a `visit →` link plus `go deeper →` to `/work/:slug`.
- **Order:** critique → daildex → leemerchat → leemerlabs → warren. (Decision for Repath: is critique still the lead? See §17.)

### Chapter 04 — Receipts (GitHub skyline)

**Goal:** turn "github is the receipts" from a slogan into a place.

- Fetch the past 365 days of contributions for `repath500` (same data source as today's `react-github-calendar`, via a cached edge function so we're not rate-limited).
- Render as a **7 × 52 grid of glass columns**, height = commits that day, emissive intensity = relative activity. It looks like a crystal city at night.
- Camera does a slow fly-over as you scroll. Hover a column to see `tue 14 jul · 23 commits`. The tallest day gets a tiny flag.
- A counter ticks up: **2,5xx commits in the last year** (Magic UI-style number ticker).
- The weekly rhythm line from v1 ("last seven days: …") sits under it.
- Below: the **ship log** as a horizontal timeline marquee (`sep 2026 · daildex launched`, `sep 2026 · critiquecode open sourced`, `may 2026 · critique community edition`, …).

### Chapter 05 — Notes and letters

**Goal:** the emotional core. Slow everything down here.

- The camera drifts into a dark field. **Notes float as frosted glass cards** at different depths, drifting slowly. Mood-coded: `light` cards are clearer, `heavy` cards are frostier and sit deeper.
- Hover/focus a card: it comes forward, de-frosts (develop), and the note sharpens. Click: opens the full note with narration.
- **Repath's public letters** appear as paper (not glass) with an **ink-bleed reveal shader**: the text appears as if written live in fountain-pen ink. Latest letter first, as today.
- The hidden "thank you for reading all of it" note still unlocks when someone completes every note and film (existing `progress.ts`).

### Chapter 06 — Write one (seal it in glass)

**Goal:** turn the visitor into a participant.

- Existing "write a letter to your future self" feature (local-first, with delivery date presets).
- New ritual: when you seal the letter, it **folds, slides into a small glass bottle / crystal capsule**, and the capsule drifts off into the field from Chapter 05 with your chosen date engraved on it. On the delivery date, returning visitors see their capsule come back and crack open.
- Optional: "leave your name" (existing `/api/names`). Names get **engraved around the base of the hero crystal** in tiny type, like a dedication on a trophy. Moderated by the existing length cap, plus a simple blocklist.

### Chapter 07 — Contact / now

**Goal:** a clear, confident ending.

- Big line: **"if you're building in this space, i want to hear from you."**
- Email as a magnetic button: `ray@critique.sh` (confirm which address, §17).
- `now:` line (what he's shipping this week), live presence as fireflies ("3 people here right now"), Waterford clock and weather.
- Final frame: the crystal, small, rotating slowly. Under it: *"i'm not done. not even close."*
- Footer: links to all five products, GitHub, LinkedIn, X, and `© repath khan · waterford, ireland`.

---

## 6. Product "worlds": one 3D object per product

Each object lives in `src/scene/worlds/` and is used in two places: small in Chapter 03 and full-bleed on `/work/:slug`.

### 6.1 critique: "the monolith"

- A tall black-glass slab (2001 monolith energy) with a terminal **rendered onto its face** (DOM-to-texture via a canvas, or drei `<Html transform occlude>`).
- A scanner line sweeps down the monolith, "inspecting" a code diff that floats in front of it. Lines turn green (pass) or amber (needs repair).
- At the end it prints a verdict: `outcome repair_ready · evidence attached · exit 2`.
- Palette: near-black, signal green `#39D353` (ties to the GitHub skyline), amber `#F5A524` for warnings. Mono type.
- Deep page: interactive "run a finish check" demo with three canned scenarios, an install command with copy button (`npm install --global @critiquedotsh/cli`), and links to CritiqueCode (open source) and critique-community.

### 6.2 DáilDex: "the island"

- **Ireland made of ~4,000 points** (instanced mesh), shaped from a GeoJSON outline of the 43 Dáil constituencies (public data from data.gov.ie / Tailte Éireann boundaries). Points are grouped by constituency.
- Every few seconds a constituency **pulses** and an alert card floats up: `your TD voted Tá on a housing motion · official record ↗`. Colours mark activity type, matching DáilDex's own system (vote, debate, question, news).
- Hover a constituency: name plus number of TDs. Keyboard accessible via a hidden list.
- Badge: **"as featured on data.gov.ie"**.
- Palette: civic green `#169B62` (Irish flag green), white, with orange `#FF883E` used sparingly. Never party colours, to stay non-partisan like DáilDex itself.
- Deep page: "follow your TD" link to daildex.com, "Ask Dex" mention, link to the open-source backend repo.

### 6.3 LeemerChat: "the router"

- Six to eight glowing "model stars" (unlabelled, or labelled generically: frontier, open-weight, fast, reasoning…) in a ring. A central node (the user) sends **streams of token particles** that route to different stars and back. The routing visibly *switches* when one star "goes down" (dims), echoing the origin story: *"started when gpt-4 went down and i needed a backup that became the main thing."*
- Palette: violet-to-cyan.

### 6.4 LeemerLabs: "the growth"

- A **crystal lattice that grows** in real time (instanced cubes/octahedra added along a diffusion-limited-aggregation path). Growth speeds up on scroll, like a training run. A small loss-curve sparkline in the corner trends down.
- Gaeilge floats nearby: *"Ní neart go cur le chéile"* (there is no strength without unity), tying to the Irish-language research.
- Palette: pale gold and bone white.

### 6.5 warren.wiki: "the warren"

- A 3D **force-directed knowledge graph** (`d3-force-3d` or `r3f-forcegraph`). Seed node: "waterford". Click a node and it expands into related nodes (canned data, a few levels deep): waterford → vikings → reginald's tower → … → crystal → refraction → light → this website. A rabbit hole that ends where you started.
- Palette: earthy green and sand (a warren is a burrow).

---

## 7. Personal, live, and secret features

These are what make it *his* site and not a template.

### 7.1 Live Waterford

- **Clock** in `Europe/Dublin`, always shown (v1 shows the visitor's local time; v2 shows *his*, and labels it).
- **Weather** from Open-Meteo (free, no key) for Waterford, cached 15 min in an edge function at `/api/waterford`. Drives:
  - **Rain on the glass**: a screen-space raindrop refraction shader over the crystal when it's raining in Waterford (it often is). This is the single most delightful "is this real?" moment.
  - Fog density when it's misty. Wind sways steam particles in Chapter 02.
- **Sun position** via `suncalc` drives the three moods (§3.2).

### 7.2 Currently shipping

- Edge function `/api/now` pulls the latest public GitHub events for `repath500` (cached 10 min) and shows: `pushed to critique-code · 2h ago`. Displayed as a tiny pulsing dot plus text in the nav. Falls back to the hand-written `nowLine` if the API is unavailable.

### 7.3 Presence as fireflies

- Existing `/api/presence` count becomes small light motes orbiting the crystal, one per active visitor. Your own mote is slightly brighter and follows your cursor loosely.

### 7.4 Secret: the `critique` terminal

- Type `critique` anywhere (or `⌘K` then "terminal") to drop down a Quake-style terminal. Commands:
  - `critique finish --intent "build a life"` → prints a verdict in finish.v1 style: `outcome: in_progress · evidence: 2,5xx commits, 11 films, 2 letters · limits: still in the middle · exit 0`.
  - `whoami` → `repath. ray to some.`
  - `ls work/` → lists the five products.
  - `cat notes/06` → prints note 6.
  - `play 09` → plays the "no option" film.
  - `gaeilge` → toggles Gaeilge mode.
  - `rain` → forces rain on the glass.
  - `help`, `clear`, `exit`.

### 7.5 Secret: Gaeilge mode

- Toggles key labels to Irish (e.g. `films → scannáin`, `work → obair`, `notes → nótaí`, `letter → litir`, `now → anois`) and swaps the hero to **"is mise repath"**. Nods to LeemerLabs' Gaeilge work. Translations should be checked by a fluent speaker before shipping.

### 7.6 Secret: the refractometer

- Hold `R` (or long-press the crystal on mobile) to show a vintage-instrument overlay: `refractive index 1.56 · lead crystal · origin waterford`. A wink at the Rayner *Dialdex* refractometer coincidence (§1.2).

### 7.7 Takeaway receipt for your visit

- On leaving (or via a "get receipt" button in the footer), generate a thermal-receipt-style image of the visit: `order #<visitor number> · 3 films watched · 2 notes read · 1 letter sealed · thank you, come again`. Shareable PNG via a canvas. Ties the takeaway world to the visitor.

### 7.8 Keep from v1

`RespectWhisper`, `IdentityWhisper`, `PresenceWhisper`, hidden note, progress tracking, narration, music ducking, letter delivery. They all get restyled and moved into the new structure; the logic stays.

---

## 8. Design system

### 8.1 Colour tokens (Tailwind 4 `@theme`)

```css
@theme {
  /* base */
  --color-ink: #05060a;          /* background, deeper/cooler than v1 #050505 */
  --color-ink-2: #0b0d14;        /* raised surfaces */
  --color-glass: #e8f1f2;        /* primary text on dark */
  --color-glass-dim: #9aa4ad;    /* secondary text */
  --color-glass-faint: #4a525c;  /* tertiary, labels */
  --color-edge: rgb(255 255 255 / 0.08); /* hairlines */

  /* the two worlds */
  --color-sodium: #ff9f43;       /* takeaway / street light */
  --color-monitor: #5b8cff;      /* lab / screen glow */

  /* product accents (only used inside their own world) */
  --color-critique: #39d353;
  --color-daildex: #169b62;
  --color-daildex-accent: #ff883e;
  --color-leemerchat: #8b5cf6;
  --color-leemerlabs: #e9d8a6;
  --color-warren: #7f9f6a;
}
```

Rule: the **spectrum** (full rainbow) only ever appears *through refraction*. It's never used as a flat UI colour. That keeps it special.

### 8.2 Typography

| Role | Font | Why |
|---|---|---|
| Display (hero, chapter titles) | **Instrument Serif** (Google Fonts, free), italic for emphasis | Editorial, sharp, feels like cut glass. Pairs with the existing serif voice but is more modern than Crimson. |
| Long-form (notes, letters) | **Crimson Text** (keep) or **Newsreader** | Continuity with v1. Notes should still feel like v1 notes. |
| UI / labels | **Geist** or **Inter Tight** | Clean, technical, legible at small sizes. |
| Data / terminal / tickets | **Geist Mono** or **JetBrains Mono** | Critique terminal, order tickets, receipts, stats. |

Type scale (fluid with `clamp`): display `clamp(3rem, 10vw, 9rem)`, h2 `clamp(2rem, 5vw, 4rem)`, body `1.125rem / 1.65`, label `0.6875rem`, tracking `0.18em`, lowercase. **Lowercase stays the default** everywhere. It's his voice.

Self-host fonts (`@fontsource/*` or files in `/public/fonts`) instead of Google Fonts CSS, to cut a render-blocking request.

### 8.3 Surfaces

- **Glass panel:** `bg-white/[0.03] backdrop-blur-xl border border-white/10` plus a 1px top inner highlight (`inset 0 1px 0 rgb(255 255 255 / 0.08)`) and an SVG noise overlay at 3% opacity.
- **Paper (letters only):** warm off-white `#efe9df`, subtle fibre texture, ink `#1b1a17`. The only light surface on the site, which makes letters feel precious.
- **Ticket (takeaway only):** thermal paper `#f4f1ea`, mono type, zig-zag torn edge via CSS `mask`.

### 8.4 Motion tokens

```ts
export const ease = [0.16, 1, 0.3, 1] as const      // from v1
export const spring = { type: 'spring', stiffness: 120, damping: 18 }
export const durations = { xs: 0.2, sm: 0.4, md: 0.7, lg: 1.2, xl: 2.4 }
```

### 8.5 Cursor

- Desktop: a small ring cursor that becomes a **lens** (magnifies and slightly refracts what's under it, via a CSS `backdrop-filter` circle or a WebGL pass) when over interactive objects. Hidden on touch devices and when reduced motion is on.

---

## 9. 21st.dev and component sourcing

21st.dev is a registry of 12,000+ community React + Tailwind components installable via the shadcn CLI, or pulled in through their MCP (`npx @21st-dev/cli@latest init --client cursor`). Free tier: 2 copies per day, so pick deliberately. Everything below gets **restyled to our tokens**. We take the mechanics, not the look.

### 9.1 Shortlist by chapter

Names are from the 21st catalog (Oct 2026). Verify each preview before installing.

| Use | Candidate(s) on 21st.dev | How we adapt it |
|---|---|---|
| Hero shader backdrop | **Liquid Metal Shader** (johnmamanao), **Cloud Shader** (Manu Arora) | Recolour to ink/sodium/monitor; use as the environment the crystal refracts, not as a visible background. |
| Arrival text | Motion Primitives **Text Scramble** / **Text Effect** (ibelick) | Glyphs scramble then "cut" into place. |
| Chapter backgrounds | **Luminous Topography** (Mehi), **Floating paths** (Bundui.io), **Beams Background** (Kokonut UI), **Sonar Grid** (NIMA MZ) | Topography = contour lines of Waterford harbour/the Suir. Beams = the spectrum beams in Chapter 03. Sonar = presence pings. |
| Film gallery | **Centered Hero with Image Fan**, **Editorial Collage Hero** (felipemenezes098), **Parallax Scrolling** (osmosupply), **Scroll Morph Hero** (Prashant Som) | Layout reference for the mobile carousel and the `/films` page. |
| Product cards | Aceternity **3D Card Effect**, Magic UI **Border Beam**, Motion Primitives **Spotlight** | Tilt + beam in each product's accent colour. |
| Receipts | Magic UI **Number Ticker**, **Marquee**; Aceternity **Tracing Beam** | Commit counter, ship-log marquee, timeline beam. |
| Terminal | Magic UI **Terminal** | Base for the secret critique terminal and Chapter 02's lab side. |
| Notes field | Motion Primitives **Morphing Dialog**, Magic UI **Blur Fade** | Card → full-note morph; blur fade = develop. |
| Nav | Magic UI **Dock** (mobile), a glass pill (custom) | Bottom dock on mobile. |
| Command palette | shadcn **Command** (cmdk) | `⌘K`. |
| Typography specimen | **Lycoris Specimen** (Kedhareswer Naidu) | Reference for the `/now` page layout. |

### 9.2 Setup

```bash
# one-time: shadcn in a Vite + Tailwind 4 project
npx shadcn@latest init           # choose "new-york", CSS variables, src/components/ui
# add path alias "@/*" -> "src/*" in tsconfig.app.json and vite.config.ts

# optional: 21st MCP for the agent
npx @21st-dev/cli@latest init --client cursor
```

Folder convention: anything from 21st or shadcn lands in `src/components/ui/` *as our code* (owned, edited). Bespoke components go in `src/components/`.

---

## 10. Tech architecture

### 10.1 Dependencies to add

```bash
npm i three @react-three/fiber @react-three/drei @react-three/postprocessing postprocessing \
      motion lenis zustand maath suncalc
npm i -D @types/three @types/suncalc leva r3f-perf vite-plugin-glsl
# later / optional:
npm i d3-force-3d          # warren graph
npm i cmdk                 # command palette (via shadcn)
```

- `@react-three/fiber` v9+ supports React 19 (which the repo already uses).
- `motion` is the current name of Framer Motion.
- `lenis` gives smooth scroll that still uses native scrolling (good for accessibility).
- `zustand` is the bridge between DOM and canvas (scroll progress, active chapter, mood, audio state).
- Keep Vite (no need to move to Next.js; the site is a client-side experience with a few edge functions, which Vercel already serves from `/api`).

### 10.2 Proposed file structure

```
src/
  main.tsx
  app/
    Root.tsx                 # router + providers + persistent canvas
    routes.ts                # extends existing router.ts (keeps /notes/:id, /letter/:id)
  state/
    useScene.ts              # zustand: scroll, chapter, mood, pointer, quality tier
    useAudio.ts              # extracted from App.tsx: music, narration, crossfades, ducking
    useFilms.ts              # extracted from App.tsx: queue, current film, progress, develop
  scene/
    Canvas.tsx               # <Canvas> + PerformanceMonitor + AdaptiveDpr + Suspense
    Rig.tsx                  # camera spline keyed to scroll
    Crystal.tsx              # the hero crystal (geometry + transmission material)
    Environment.tsx          # what the crystal refracts (shader backdrop + film textures)
    Shards.tsx               # film shards (Chapter 01)
    Skyline.tsx              # GitHub skyline (Chapter 04)
    NotesField.tsx           # floating glass notes (Chapter 05)
    Fireflies.tsx            # presence
    Rain.tsx                 # rain-on-glass pass
    Effects.tsx              # postprocessing: bloom, chromatic aberration, noise, vignette
    worlds/
      Monolith.tsx           # critique
      Island.tsx             # daildex
      Router.tsx             # leemerchat
      Growth.tsx             # leemerlabs
      Warren.tsx             # warren
    shaders/
      rain.frag.glsl
      inkReveal.frag.glsl
      caustics.frag.glsl
  chapters/
    Arrival.tsx  Frames.tsx  TwoWorlds.tsx  Spectrum.tsx
    Receipts.tsx Notes.tsx   WriteOne.tsx  Contact.tsx
  pages/
    Work.tsx  WorkDetail.tsx  Films.tsx  NotesPage.tsx  LetterPage.tsx  Now.tsx
  components/
    ui/                      # shadcn + 21st components (owned)
    Nav.tsx  Dock.tsx  CommandPalette.tsx  Terminal.tsx  Ticket.tsx  Receipt.tsx
    Develop.tsx              # the signature blur→sharp text primitive
    GlassPanel.tsx  MagneticButton.tsx  LiveWaterford.tsx
  content/
    films.ts  notes.ts  letters.ts  ecosystem.ts  shiplog.ts  gaeilge.ts
api/
  names.ts  notes.ts  presence.ts  speak.ts   # existing
  waterford.ts                                  # weather + sun, cached
  now.ts                                        # github events, cached
  contributions.ts                              # github contributions, cached
```

### 10.3 Key patterns

**DOM drives, canvas follows.** All content is real HTML in the scroll flow. Each chapter section has a `data-chapter` attribute; an `IntersectionObserver` + Lenis scroll progress write `{ chapter, progress }` into zustand. The canvas reads it in `useFrame` (no React re-renders per frame).

```tsx
// state/useScene.ts
export const useScene = create<SceneState>()((set) => ({
  chapter: 'arrival',
  progress: 0,            // 0..1 within chapter
  globalProgress: 0,      // 0..1 whole page
  mood: 'night',
  tier: 'high',           // high | medium | low | static
  setScroll: (p) => set(p),
}))

// scene/Rig.tsx
useFrame((state, delta) => {
  const { globalProgress } = useScene.getState()
  const target = cameraSpline.getPointAt(globalProgress)
  easing.damp3(state.camera.position, target, 0.35, delta)  // maath
  state.camera.lookAt(lookSpline.getPointAt(globalProgress))
})
```

**One canvas for the whole app.** It's mounted once in `Root.tsx`, so navigating between `/` and `/work/critique` doesn't rebuild the WebGL context. Route changes swap which scene graph is visible, and objects animate between layouts.

**Film textures.** Use `THREE.VideoTexture` on hidden `<video muted loop playsInline>` elements with the short preview loops. Only the 3–4 shards nearest the camera play at once; the others show a poster texture. The *selected* film uses the real `<video>` element from `useFilms` (the one with sound), so the audio engine from v1 still owns playback.

**Develop primitive.** Extract v1's blur/opacity/translate math into `<Develop progress={0..1}>` so every reveal on the site uses the same signature.

**Refactor first.** Before any 3D, split `App.tsx` into `useAudio`, `useFilms`, and presentational pieces, with no visual change. This de-risks everything after.

### 10.4 Post-processing stack (tier: high)

`EffectComposer` → `Bloom` (luminanceThreshold 0.8, intensity 0.6, mipmapBlur) → `ChromaticAberration` (tiny, radial) → `Noise` (opacity 0.04, replaces the v1 grain div) → `Vignette` (0.35). Medium tier drops chromatic aberration; low tier keeps only noise and vignette.

---

## 11. Media pipeline: films, images, audio

### 11.1 Current films (measured)

| File | Title | Size | Resolution | Duration |
|---|---|---|---|---|
| 1.mp4 | living | 1.4 MB | 720×720 | 13.7s |
| 2.mp4 | fly | 3.3 MB | 722×720 | 29.2s |
| 3.mp4 | rise | 5.8 MB | 720×724 | 53.3s |
| 4.mp4 | alive | 1.5 MB | 576×576 | 16.9s |
| 5.mp4 | peace | 0.4 MB | 768×576 | 13.7s |
| 6.mp4 | who cares | 1.7 MB | 576×576 | 36.4s |
| 8.mp4 | darkest hours | 3.6 MB | 576×576 | 78.4s |
| 9.mp4 | no option | 4.6 MB | 726×720 | 64.6s |
| 10.mp4 | i am | 3.1 MB | 576×576 | 26.2s |
| 11.mp4 | smile | 1.2 MB | 576×1024 (portrait) | 20.7s |
| 12.mp4 | figure it out | 3.1 MB | 1024×576 (landscape) | 33.4s |

All H.264, about 29 MB total. Odd dimensions (722, 724, 726) should be normalised to even numbers.

### 11.2 Script: `scripts/build-media.sh`

For each film, generate:

1. **Preview loop** (for shards): 3s, muted, 360px on the long edge, ~150 KB.
   `ffmpeg -ss <best moment> -t 3 -i in.mp4 -an -vf "scale=360:-2,fps=24" -c:v libx264 -crf 30 -preset slow -movflags +faststart previews/<slug>.mp4`
2. **Poster** (AVIF + JPEG fallback) from the same moment.
   `ffmpeg -ss <t> -i in.mp4 -frames:v 1 -vf "scale=720:-2" posters/<slug>.jpg` then `avifenc`.
3. **Full film**, normalised to even dimensions, H.264 `crf 23` + `faststart`, and optionally an AV1/WebM rendition for browsers that support it (`<source type="video/webm; codecs=av01">` first).
4. **A `films.ts` manifest** generated from ffprobe: slug, title, aspect, duration, preview, poster, sources.

Optionally move full films to Vercel Blob or a CDN so the repo stays light.

### 11.3 New imagery needed

- 6–12 photos: Waterford at night (quay, Reginald's Tower, the Suir), the takeaway (kitchen, tickets, the counter at closing), his desk/monitor at 3am, a portrait or two. These go into the Two Worlds chapter, the `/now` page, and OG images.
- A real Waterford Crystal piece photographed on black (optional), as a reference for the 3D crystal and as an HDRI-style environment source.
- **Product screenshots/recordings** for each world's deep page (critique CLI run, DáilDex alert email, Warren rabbit hole, LeemerChat, BornBench).

### 11.4 OG images

Per-route OG images rendered at build time (or via a Vercel OG edge function): the crystal still plus route title. Films get a poster-based OG with the title (`09 · no option`).

---

## 12. Performance budget and degradation ladder

### 12.1 Budgets

| Metric | Target |
|---|---|
| LCP (mobile, 4G, mid-range Android) | < 2.2s (the hero heading is DOM text, so it paints before WebGL) |
| Initial JS (gzip), excluding the 3D chunk | < 120 KB |
| 3D chunk (three + fiber + drei subset + scene) | < 350 KB gzip, lazy-loaded right after first paint |
| CLS | < 0.05 |
| Frame rate | 60fps desktop, ≥ 45fps mid mobile, auto-degrade below that |
| Hero transfer before interaction | < 1.5 MB (no full films until clicked) |

### 12.2 Quality tiers

drei `<PerformanceMonitor>` plus a GPU tier check (`detect-gpu`) picks a starting tier, then steps down if FPS drops.

| Tier | Crystal material | Post FX | Shards playing | DPR | Extras |
|---|---|---|---|---|---|
| **high** | `MeshTransmissionMaterial`, samples 10, backside | full | 4 | ≤ 2 | rain shader, caustics, fireflies |
| **medium** | transmission, samples 4, no backside | bloom + noise | 2 | ≤ 1.5 | rain (lite) |
| **low** | `MeshPhysicalMaterial` + env map (fake refraction) | noise | 1 | 1 | none |
| **static** | pre-rendered AVIF stills + CSS | none | 0 | n/a | reduced motion, no WebGL, or save-data |

Also: pause the render loop when the tab is hidden or the canvas is off-screen (`frameloop="demand"` outside active chapters), and dispose textures on route change.

---

## 13. Accessibility

- **The canvas is decorative** (`aria-hidden`). Every piece of content (films, notes, products, letters) exists as real, focusable HTML.
- **Keyboard:** tab through shards, product cards, and notes in a logical order; `Enter` plays/opens; `Esc` closes; skip-to-content link.
- **Reduced motion:** static tier, no scroll-jacking, no camera moves, instant develops.
- **Audio:** nothing autoplays with sound without a fallback; narration has a visible transcript (the note text itself); music toggle is persistent.
- **Captions** for any film that has speech (to check with Repath).
- **Contrast:** body text ≥ 4.5:1 against ink; labels can't drop below `--color-glass-faint` on raised surfaces.
- **Scroll-jacking** (Chapter 03 horizontal) must still be operable by keyboard and must not trap focus; on mobile it becomes vertical.

---

## 14. Copy deck

Keep his words where they exist. New lines are written in his register: lowercase, short, honest.

**Meta title:** `repath.life — cut by hand in waterford`
**Meta description:** `repath khan. builder from waterford, ireland. films, notes, and the products i ship: critique, dáildex, leemerchat, leemerlabs, warren.`

**00 Arrival:** `i am repath` / `waterford, ireland · builder · {time}`
**01 Frames:** label `frames` / sub `some moments i kept, and the small truths they left behind.` (v1 line)
**02 Two worlds:** title `two worlds` / left `the counter` / right `the terminal` / body: his takeaway quote.
**03 Spectrum:** title `one light. five colours.` / sub `everything i'm building, split out.`
**04 Receipts:** title `github is the receipts.` (v1) / `some commits become products. some become infrastructure. some become lessons.` (v1)
**05 Notes:** title `notes` / sub `the small truths, in no particular order.`
**06 Write one:** title `write one too.` / sub `seal it, or don't. you do you.` (from letter 1)
**07 Contact:** `if you're building in this space, i want to hear from you.` / closing `i'm not done. not even close.` (from letter 1)

**Product one-liners:**
- critique: `your agent writes the change. critique checks it.`
- dáildex: `see what your td said, did and voted for — in your inbox.`
- leemerchat: `started when gpt-4 went down. became the main thing.`
- leemerlabs: `ai made for irish reality.`
- warren: `for people who think in networks, not linear articles.`

---

## 15. Build phases with acceptance criteria

Each phase ships to a Vercel preview and is mergeable on its own. Order is chosen so the riskiest technical pieces (3D performance, video textures) are proven early.

### Phase 0 — Foundations (no visual change)

- Split `App.tsx` into `useAudio`, `useFilms`, `<Develop>`, and presentational components. Remove duplicated mobile/desktop note blocks.
- Add path alias `@/`, shadcn init, design tokens in `@theme`, self-hosted fonts.
- Update `README.md`.
- **Done when:** the live site looks and behaves identically, `npm run build` and `npm run lint` pass, `App.tsx` < 250 lines.

### Phase 1 — The crystal (hero proof of concept)

- Persistent canvas, quality tiers, `Crystal.tsx` with transmission material, shader environment, drag-to-rotate, facet ring sounds, Arrival sequence, static fallback.
- **Done when:** hero hits 60fps on an M1 MacBook Air and ≥ 45fps on a mid-range Android (e.g. Pixel 6a), LCP < 2.2s, and reduced motion shows the still.

### Phase 2 — Frames

- Media pipeline script, previews and posters, `films.ts` manifest, `Shards.tsx` with video textures, select-to-play wired to `useFilms`/`useAudio`, develop-on-end, mobile carousel, `/films` and `/films/:slug`.
- **Done when:** all v1 film behaviour works (sound fallback, crossfade, narration, progress tracking) and no film is cropped.

### Phase 3 — Two worlds + Spectrum + product worlds (small)

- Split-screen with tickets and terminal, light mixing. Five world objects at "card" scale. Spectrum beams. Horizontal pinned scroll (desktop).
- **Done when:** all five products are visible with correct links, DáilDex included, and the section is keyboard operable.

### Phase 4 — Receipts

- `/api/contributions` edge function (cached), `Skyline.tsx`, counter, ship-log marquee (updated with DáilDex and CritiqueCode open source).
- **Done when:** the skyline renders real data, has a flat-calendar fallback, and hover tooltips work.

### Phase 5 — Notes, letters, write one

- Notes field, ink-reveal letters, capsule-sealing animation, names engraved on the crystal, restyled `/notes` and `/letter` (URLs and localStorage keys unchanged so existing visitors keep their letters).
- **Done when:** a letter written on v1 still appears and delivers on v2.

### Phase 6 — Personal layer

- `/api/waterford` (weather + sun), moods, rain shader, `/api/now`, fireflies, command palette, secret terminal, Gaeilge mode, refractometer, visit receipt.
- **Done when:** weather drives rain correctly (testable via the `rain` command), and every secret has a no-JS-safe path (none of them block content).

### Phase 7 — Deep pages, polish, launch

- `/work/:slug` pages, OG images, sound design pass, Lighthouse and accessibility pass, cross-browser (Safari iOS is the hardest for transmission and video textures), 301s from `/working-on`.
- **Done when:** Lighthouse mobile ≥ 85 performance and ≥ 95 accessibility, no console errors, and Safari iOS 17+ works.

---

## 16. Risks and mitigations

| Risk | Mitigation |
|---|---|
| Transmission material is expensive on mobile GPUs | Quality tiers (§12.2); low tier fakes refraction with an env map. Prove it in Phase 1 before building more. |
| iOS Safari video-texture quirks (autoplay, `playsInline`, CORS) | Same-origin files, `muted playsInline loop`, start on first gesture if needed, poster fallback. |
| Scroll-jacking feels bad | Only one pinned section (Chapter 03), Lenis with native scroll, off for reduced motion and on mobile. |
| Losing the intimacy of v1 under spectacle | Chapter 05 (notes and letters) is deliberately slow, dark, and quiet. The develop mechanic and his voice carry through. Review this against v1 at every phase. |
| Bundle bloat | Lazy-load the 3D chunk, import drei per module, tree-shake three, measure with `rollup-plugin-visualizer`. |
| Political neutrality for DáilDex | Use DáilDex's own non-partisan framing; no party colours; demo alerts use generic topics ("housing motion", "school transport"). |
| Gaeilge accuracy | Have a fluent speaker check every string before Gaeilge mode ships. |
| GitHub API rate limits | All GitHub calls go through cached edge functions (10–60 min TTL). |
| Repo weight from media | Move full films to Vercel Blob or a CDN in Phase 2. |

---

## 17. Assets and decisions needed from Repath

1. **Lead product:** is critique still the headline, or should DáilDex lead right now since it just launched and got the data.gov.ie feature?
2. **Contact email:** `ray@critique.sh` (current site) or `ray@daildex.com` (on DáilDex), or a personal address?
3. **Takeaway:** comfortable showing it (name, photos), or keep it anonymous ("a busy takeaway in waterford")?
4. **Photos:** Waterford at night, the takeaway, desk at 3am, a portrait. Even phone photos work; they'll be graded to match.
5. **New films?** Any new clips since September to add to the 11?
6. **Tagline:** "cut by hand in waterford" vs. keeping "a record of becoming".
7. **Socials to link:** GitHub `repath500`, LinkedIn, X/Twitter handle?
8. **Gaeilge:** does he (or someone close) speak Irish to check strings?
9. **Music:** keep "sparky-deathcap-september" as the only bed, or add a second track for the night mood?
10. **Visitor names on the crystal:** opt in to moderation (manual approve) or auto-publish with a blocklist?

---

## 18. Inspiration board

**Repath's own surfaces (tone reference):**
- critique.sh/founder: "infrastructure can feel alive", numbered sections (`[ 01.A ]`), the thesis structure.
- daildex.com: plain English, source-linked, calm civic confidence.
- leemerlabs.com: "a language should not need permission to enter the future."

**21st.dev (component mechanics):** Liquid Metal Shader, Cloud Shader, Luminous Topography, Floating paths, Beams Background, Sonar Grid, Scroll Morph Hero, Editorial Collage Hero, Parallax Scrolling, and the Aceternity UI, Magic UI, and Motion Primitives libraries.

**Three.js / R3F reference points (techniques to study, not copy):**
- pmndrs drei `MeshTransmissionMaterial` examples (glass, dispersion).
- The `react-three-fiber` examples gallery: "Caustics", "Glass flower", "Scroll controls", "Image gallery".
- GitHub Skyline (3D contribution graphs).
- Classic Pink Floyd prism imagery, for the spectrum beams in Chapter 03.

**Real-world references:**
- Waterford Crystal cutting (the wheel, the cuts, the light).
- Thermal receipt printers and takeaway order rails.
- Night street light on the Waterford quays (sodium amber on wet ground).
- Darkroom photo developing (the *develop* mechanic).

---

*Plan written October 2026. Research sources: repath.life, critique.sh, critique.sh/founder, critique.sh/blog, daildex.com, leemerlabs.com, leemerchat.com/about-us, warren.wiki, github.com/repath500, Repath's public LinkedIn posts, 21st.dev catalog.*
