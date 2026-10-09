export const IMAGE_MODEL = 'black-forest-labs/flux-3-image'
export const VIDEO_MODEL = 'bytedance/seedance-2.0-mini'

// "Disney" and character names from existing films are deliberately kept out of prompts:
// we describe the golden-age technique, not someone else's IP.
export const STYLE =
  'golden-age 1940s hand-drawn American cel animation: confident clean ink outlines, flat cel-painted colours with soft painted shading, lush hand-painted gouache and watercolour backgrounds with visible brush texture, warm three-strip Technicolor palette, gentle film grain, storybook charm, expressive squash-and-stretch acting'

export const NO_TEXT = 'no text, no letters, no captions, no watermark'

export const GREEN_SCREEN =
  'character isolated on a perfectly flat, evenly lit pure chroma green (#00B140) background, no shadow on the background, no floor line'

export const CHARACTERS = {
  ray: 'RAY: a young South Asian Irish man around 20, short dark messy hair with a small quiff, warm brown skin, normal rounded human ears, friendly determined eyes, black hoodie, tan takeaway apron tied over the hoodie, pencil tucked behind one ear, black canvas high-top sneakers',
  crit: 'CRIT: a small round grumpy-but-lovable owl made entirely of clear faceted cut glass like Waterford crystal, one brass monocle on a chain, a tiny green terminal screen set into its chest',
  dex: 'DEX: a cheerful plump grey carrier pigeon with round spectacles, a green postman cap with a small shamrock badge, a brown leather satchel stuffed with envelopes',
  warren: 'WARREN: a lanky scholarly rabbit with round spectacles, a knitted beanie, a long purple scarf, a brown tweed jacket, always carrying a stack of books',
  leemer: 'LEEMER: a mischievous ring-tailed lemur whose many black-and-white striped tails each end in a small glowing lantern of a different colour (red, amber, green, blue, violet)',
  spicebag: 'SPICE BAG: a sentient brown paper takeaway bag with big cartoon eyes, a wide grin, little arms and legs in brown shoes, overflowing with chips and crispy chicken, a red-and-white checked paper liner, steam curling out',
  born: 'BORN: a tiny glowing sprite that is a seedling made of pale gold crystal, two leaf-shaped crystal facets for arms, a soft inner light, curious wide eyes',
} as const

export type ImageAsset = {
  kind: 'image'
  id: string
  chapter: string
  purpose: string
  prompt: string
  aspect: '1:1' | '16:9' | '9:16' | '3:4' | '4:3' | '21:9' | '2:3' | '2:1'
  resolution: '768' | '1K' | '1.5K' | '2K'
  refs?: string[]
  seed?: number
}

export type VideoAsset = {
  kind: 'video'
  id: string
  chapter: string
  purpose: string
  prompt: string
  firstFrame?: string
  lastFrame?: string
  duration: number
  size: string
  audio: boolean
  seed?: number
}

export type Asset = ImageAsset | VideoAsset

const cast = (...names: (keyof typeof CHARACTERS)[]) =>
  names.map((name) => CHARACTERS[name]).join('. ')

const scene = (body: string, extra = '') => `${body} Style: ${STYLE}. ${extra}`.trim()

const LINEUP = ['char-lineup']

// ─────────────────────────────────────────────────────────────
// stage 1 — character references (everything else points at these)
// ─────────────────────────────────────────────────────────────
const characterAssets: ImageAsset[] = [
  {
    kind: 'image',
    id: 'char-lineup',
    chapter: 'refs',
    purpose: 'Master model sheet. Passed as a reference to every scene for character consistency.',
    aspect: '16:9',
    resolution: '2K',
    seed: 1914,
    prompt: scene(
      `Character model sheet on cream animation paper with faint blue pencil construction lines. Seven characters standing in a row, full body, same scale, each with a small hand-lettered lowercase name label beneath: ${cast('ray', 'crit', 'dex', 'warren', 'leemer', 'spicebag', 'born')}. Ray holds a small glowing faceted crystal. Hand-lettered title at the top: "the night shift — model sheet".`,
    ),
  },
  ...(['ray', 'crit', 'dex', 'warren', 'leemer', 'spicebag', 'born'] as const).map(
    (name): ImageAsset => ({
      kind: 'image',
      id: `char-${name}-turnaround`,
      chapter: 'refs',
      purpose: `Turnaround (front, three-quarter, side, back) and 4 expressions for ${name}. Used as a tighter reference when ${name} is the focus.`,
      aspect: '16:9',
      resolution: '2K',
      refs: LINEUP,
      prompt: scene(
        `Animation character turnaround sheet on cream paper for ${CHARACTERS[name]}. Front, three-quarter, side and back views in a row, then a second row of four expression heads: happy, determined, shocked, tired. Consistent proportions, construction lines visible.`,
        NO_TEXT,
      ),
    }),
  ),
  ...(['crit', 'dex', 'leemer', 'spicebag', 'born'] as const).map(
    (name): ImageAsset => ({
      kind: 'image',
      id: `sprite-${name}`,
      chapter: 'mascots',
      purpose: `Green-screen key pose for ${name}; first frame for an idle loop video that gets chroma-keyed into a transparent sprite.`,
      aspect: '1:1',
      resolution: '1K',
      refs: [`char-${name}-turnaround`],
      prompt: scene(`${CHARACTERS[name]}, standing in a relaxed idle pose, facing three-quarter toward camera, centred, full body with margin around it.`, `${GREEN_SCREEN}. ${NO_TEXT}`),
    }),
  ),
]

// ─────────────────────────────────────────────────────────────
// stage 2 — story scenes (desktop 16:9 + mobile 9:16)
// ─────────────────────────────────────────────────────────────
type SceneSpec = {
  id: string
  chapter: string
  purpose: string
  body: string
  refs?: string[]
  noText?: boolean
  mobile?: boolean
}

const sceneSpecs: SceneSpec[] = [
  {
    id: 'sc00-cover',
    chapter: '00 once upon a time',
    purpose: 'Closed storybook cover. First frame of the book-opening transition video.',
    body: 'A large ornate leather-bound storybook lying closed on deep red velvet, lit by one candle. Gold-embossed corners, a faceted crystal set into the centre of the cover, gold foil hand-lettered title "the night shift" and smaller "a waterford story". Sparkles drift in the candlelight.',
  },
  {
    id: 'sc01-storybook',
    chapter: '00 once upon a time',
    purpose: 'Open storybook. Last frame of the book-opening video, then the hero.',
    body: 'The same leather storybook now open on red velvet by candlelight. Left page: a watercolour illustration of Waterford at dusk — the round stone Reginald\'s Tower with its conical roof beside the river Suir, quay lamps reflected in the water, a row of coloured terraced houses. Right page: a richly illuminated gold and vine border around a large ornamental drop-cap, filled with decorative pen-flourishes and no readable words. Sparkles lift off the page.',
  },
  {
    id: 'sc02-counter',
    chapter: '01 the counter',
    purpose: 'Takeaway rush slapstick. Comedy beat.',
    refs: [...LINEUP, 'char-ray-turnaround', 'char-spicebag-turnaround'],
    body: `Slapstick comedy inside a small busy Irish takeaway at the 6pm rush. ${CHARACTERS.ray} juggles four takeaway boxes and a ringing phone, squash-and-stretch, sweat drops flying. A thermal ticket printer on the counter spits an absurdly long curling ribbon of blank order tickets that loops around the whole room like a party streamer. ${CHARACTERS.spicebag} leaps off the counter mid-dance with chips flying. A fryer bubbles with cartoon steam puffs. A queue of comically impatient customers taps feet and checks pocket watches. A red neon "open" sign glows in the window. Warm sodium amber and red palette.`,
  },
  {
    id: 'sc03-two-worlds',
    chapter: '02 two worlds',
    purpose: 'Split composition for the draggable two-worlds divider. Left = takeaway, right = attic lab.',
    refs: [...LINEUP, 'char-ray-turnaround'],
    body: `Symmetrical split composition divided exactly down the vertical centre. ${CHARACTERS.ray} stands in the middle, split by the line: on the left half he wears the apron and holds a takeaway bag, lit by warm sodium amber, behind him a takeaway kitchen with fryers and order tickets; on the right half he wears just the hoodie and holds a glowing laptop, lit by cool moonlit blue, behind him an attic desk with a faceted crystal and stacks of books. Same pose, mirrored lighting, both halves seamless at the centre line.`,
    noText: true,
  },
  {
    id: 'sc04-night-shift',
    chapter: '03 the night shift',
    purpose: 'The magic moment: the crystal wakes the sidekicks. Hero of the products section.',
    refs: LINEUP,
    body: `A small attic bedroom in Waterford at 3am. ${CHARACTERS.ray} sits at a cluttered wooden desk lit by the cool blue glow of a laptop and the rainbow light of a faceted cut-glass crystal on a brass stand. The crystal throws prismatic beams across the room and in them the sidekicks come alive: ${cast('crit', 'leemer', 'warren', 'dex')}. Crit peers critically at the laptop, Leemer hangs from a shelf with lantern tails glowing, Warren reads on the bed, Dex perches on the round window sill holding a letter. Through the window: rooftops, the moon and the round stone tower. A wall clock at 3:00. Deep indigo with rainbow accents.`,
    noText: true,
  },
  {
    id: 'sc05-leemer-backup',
    chapter: '03 the night shift / leemerchat',
    purpose: 'LeemerChat origin: the big model went down, Leemer brings backup light.',
    refs: [...LINEUP, 'char-leemer-turnaround', 'char-ray-turnaround'],
    body: `A dark bedroom just after the lights went out. A big old-fashioned computer monitor shows a sad drooping cartoon face. ${CHARACTERS.ray} sits in the dark with comically huge white cartoon eyes. ${CHARACTERS.leemer} swings in on a curtain rail, winking, its lantern tails lighting the room in a rainbow like a backup generator.`,
    noText: true,
  },
  {
    id: 'sc06-crit-court',
    chapter: '03 the night shift / critique',
    purpose: 'critique: Crit judges an AI agent\'s pull request. Comedy beat.',
    refs: [...LINEUP, 'char-crit-turnaround'],
    body: `Comedy courtroom. ${CHARACTERS.crit} sits as a stern judge on a tall bench built from stacked old laptops, wearing a tiny powdered judge's wig and banging a gavel. Its chest screen shows green pixel text "exit 2". Before the bench a sweaty nervous little cartoon robot coding agent with an antenna and a toolbox presents an extremely long scroll of code. A rubber stamp hangs mid-air reading "repair ready". Wood-panelled courtroom, warm amber light.`,
  },
  {
    id: 'sc07-dex-flies',
    chapter: '03 the night shift / dáildex',
    purpose: 'DáilDex: Dex delivers plain-English, source-linked alerts across Ireland.',
    refs: [...LINEUP, 'char-dex-turnaround'],
    body: `${CHARACTERS.dex} flies joyfully over a hand-painted storybook map of Ireland at dawn: patchwork green fields, dry stone walls, winding rivers, and Leinster House in Dublin drawn small as a classical Georgian building with columns. A kite-tail of envelopes flutters behind Dex, each stamped with a small tick. Dotted flight-path lines connect towns. Peach and mint dawn sky. Neutral, civic, no flags, no party colours.`,
    noText: true,
  },
  {
    id: 'sc08-warren-hole',
    chapter: '03 the night shift / warren.wiki',
    purpose: 'warren.wiki: falling down a rabbit hole of connected knowledge.',
    refs: [...LINEUP, 'char-warren-turnaround'],
    body: `${CHARACTERS.warren} tumbles happily down a deep spiralling rabbit hole whose walls are made of bookshelves. Glowing threads connect floating open books, maps, a Viking helmet, a telescope, a crystal goblet and a little round tower, forming a web of connections around him. He is reading mid-fall, completely unbothered. Warm lamplight fading into deep teal below.`,
    noText: true,
  },
  {
    id: 'sc09-born-grows',
    chapter: '03 the night shift / leemerlabs',
    purpose: 'LeemerLabs / Born: a crystal seedling grows in a tiny Irish lab greenhouse.',
    refs: [...LINEUP, 'char-born-turnaround'],
    body: `A tiny Victorian glass greenhouse turned into a lab at night, on a Waterford rooftop. ${CHARACTERS.born} stands in a terracotta pot, growing a branching lattice of pale gold crystal behind it like a tree. Seed packets on the shelf, brass instruments, a chalkboard with a downward-sloping curve. Warm gold and bone white against a starry night.`,
    noText: true,
  },
  {
    id: 'sc10-fog',
    chapter: '04 the middle',
    purpose: 'Letter 2: lost in the middle. Honest low point.',
    refs: [...LINEUP, 'char-ray-turnaround'],
    body: `${CHARACTERS.ray} walks alone along a rainy Waterford quay at night, hood up, hands in pockets, small in frame, without the apron. Thick grey fog swirls around him, forming faint question marks and half-finished app windows. Warm golden fireflies rise out of his hoodie pocket and float ahead, lighting a path through the fog. Wet cobblestones reflect a single street lamp. Muted blue-grey broken by warm gold.`,
    noText: true,
  },
  {
    id: 'sc11-fireflies',
    chapter: '05 notes',
    purpose: 'Backdrop for the notes field. Fireflies = notes.',
    refs: LINEUP,
    body: 'A wide dark meadow on the banks of the river Suir at night with hundreds of warm golden fireflies drifting at different depths, some close and big and soft-focus, some tiny and far. Faint silhouette of the round stone tower and the city across the water. Deep blue night, soft glow.',
    noText: true,
  },
  {
    id: 'sc12-sunrise',
    chapter: '06 receipts',
    purpose: 'GitHub receipts: a glass city of commits at sunrise.',
    refs: LINEUP,
    body: `On a hill above Waterford at dawn, ${CHARACTERS.ray} raises both arms, the faceted crystal glowing in one hand. Below rises a glittering city of glass towers of different heights arranged in a tidy calendar grid, glowing green, each tower a day of work. The river Suir winds through. Golden sunrise with god rays. The sidekicks cheer: Crit, Dex flying, Warren, Leemer, and Spice Bag throwing chips like confetti.`,
    noText: true,
  },
  {
    id: 'sc13-bottle',
    chapter: '07 write one',
    purpose: 'Write-your-own-letter ritual: sealed bottles drifting down the Suir.',
    body: 'Close-up of two young hands in black hoodie sleeves placing a small corked glass bottle onto the dark river Suir at night. Inside, a rolled handwritten letter tied with string and a small blank paper tag. The bottle glows warmly from within. Dozens of other glowing bottles drift downstream like floating lanterns. Quay lamps and stars ripple on the water.',
    noText: true,
  },
  {
    id: 'sc14-the-end',
    chapter: '08 not even close',
    purpose: 'Classic end card, uncorrected. First frame of the paint-gag video.',
    body: 'An ornate vintage closing title card: gold scrollwork frame on a deep red velvet curtain. In the centre, elegant gold script reading "the end". Nothing else in the frame.',
  },
  {
    id: 'sc15-not-even-close',
    chapter: '08 not even close',
    purpose: 'The same end card, corrected. Last frame of the paint-gag video.',
    refs: [...LINEUP, 'sc14-the-end'],
    body: `The same ornate end card on red velvet, but "the end" is crossed out with a bold hand-painted stroke and beneath it fresh yellow hand-lettering reads "not even close." ${CHARACTERS.ray} leans in from the side holding a giant dripping paintbrush, grinning. Crit raises an eyebrow through its monocle, Spice Bag laughs, Leemer hangs from the top of the frame.`,
  },
  {
    id: 'sc17-projector',
    chapter: '01b the reel',
    purpose: 'The real films: a projector in the attic throws them onto a bedsheet. The sheet stays blank so the real MP4 is composited onto it.',
    refs: [...LINEUP, 'char-ray-turnaround'],
    body: `The attic at night. A vintage 16mm film projector on a stack of books throws a dusty cone of warm light onto a white bedsheet pinned to the sloped wooden ceiling. The bedsheet is a perfectly flat, evenly lit, plain white rectangle, square in proportion, facing the camera straight on, with nothing projected on it. ${CHARACTERS.ray} sits cross-legged on the floor in front of it, seen from behind in silhouette, with Crit and Leemer beside him. Dust motes glitter in the beam.`,
    noText: true,
  },
  {
    id: 'sc18-intermission',
    chapter: 'gags',
    purpose: 'Intermission card shown after a long read: "get a snack".',
    refs: [...LINEUP, 'char-spicebag-turnaround'],
    body: `A vintage theatre intermission card in red and gold with art-deco borders. Centred lettering reads "intermission" and smaller below "go get a snack". ${CHARACTERS.spicebag} stands beside the text holding a tiny sign that says "me?", looking alarmed.`,
  },
  {
    id: 'sc19-credits',
    chapter: '08 not even close',
    purpose: 'Backdrop for the scrolling end credits.',
    refs: LINEUP,
    body: 'A deep red velvet theatre curtain, softly lit from below with warm footlights, gold tassels at the edges, plenty of empty dark space in the centre for scrolling credits. The faceted crystal glows small on the stage floor.',
    noText: true,
  },
  {
    id: 'sc16-lost-404',
    chapter: 'system',
    purpose: '404 page: Spice Bag ate the page.',
    refs: [...LINEUP, 'char-spicebag-turnaround'],
    body: `${CHARACTERS.spicebag} sits guiltily on an empty storybook page with crumbs and a torn paper corner sticking out of its mouth, eyes darting sideways. A tiny chip falls. Cream paper background.`,
    noText: true,
  },
]

const sceneAssets: ImageAsset[] = sceneSpecs.flatMap((spec): ImageAsset[] => {
  const prompt = scene(spec.body, spec.noText ? NO_TEXT : '')
  const desktop: ImageAsset = {
    kind: 'image',
    id: spec.id,
    chapter: spec.chapter,
    purpose: spec.purpose,
    prompt,
    aspect: '16:9',
    resolution: '2K',
    refs: spec.refs,
  }
  if (spec.mobile === false) return [desktop]
  return [
    desktop,
    {
      ...desktop,
      id: `${spec.id}-mobile`,
      purpose: `${spec.purpose} (mobile 9:16 recomposition)`,
      aspect: '9:16',
      resolution: '1.5K',
      refs: [...(spec.refs ?? []), spec.id],
      prompt: `${prompt} Recompose vertically for a phone screen; keep the main subject in the middle third.`,
    },
  ]
})

// ─────────────────────────────────────────────────────────────
// stage 3 — multiplane layers (three.js parallax, keyed to alpha)
// ─────────────────────────────────────────────────────────────
const multiplane = (layer: string, body: string, keyed: boolean): ImageAsset => ({
  kind: 'image',
  id: `mp-quay-${layer}`,
  chapter: '00 once upon a time',
  purpose: `Multiplane layer "${layer}" for the 3D parallax hero (Waterford quay at dusk).`,
  aspect: '21:9',
  resolution: '2K',
  refs: ['sc01-storybook'],
  prompt: scene(body, `${keyed ? `isolated on a flat pure chroma green (#00B140) background everywhere that is not part of this layer. ` : ''}${NO_TEXT}`),
})

const multiplaneAssets: ImageAsset[] = [
  multiplane('0-sky', 'Watercolour dusk sky only: lavender, peach and gold clouds, first stars, a pale moon. No land.', false),
  multiplane('1-far', 'Only the far bank of the river Suir: distant hills and a soft silhouette of rooftops and spires, hazy blue.', true),
  multiplane('2-mid', 'Only the Waterford quay buildings: the round stone Reginald\'s Tower with conical roof and a row of coloured terraced houses with lit windows.', true),
  multiplane('3-water', 'Only the river surface: dark blue water with long golden reflections of lamps.', true),
  multiplane('4-near', 'Only the foreground: an ornate cast-iron quay railing and one old street lamp on the right, glowing.', true),
]

// ─────────────────────────────────────────────────────────────
// stage 4 — UI art
// ─────────────────────────────────────────────────────────────
const uiAssets: ImageAsset[] = [
  {
    kind: 'image',
    id: 'ui-title-lettering',
    chapter: 'ui',
    purpose: 'Hand-lettered "i am repath" title for the hero, keyed to alpha.',
    aspect: '21:9',
    resolution: '2K',
    prompt: `Vintage 1940s animated feature main-title hand lettering reading exactly "i am repath" in lowercase, flowing brush-script with gold leaf fill, a thin dark outline and tiny sparkles, ${GREEN_SCREEN.replace('character', 'lettering')}.`,
  },
  ...[
    ['01', 'the counter'],
    ['02', 'two worlds'],
    ['03', 'the night shift'],
    ['04', 'the middle'],
    ['05', 'notes'],
    ['06', 'receipts'],
    ['07', 'write one'],
  ].map(
    ([n, title]): ImageAsset => ({
      kind: 'image',
      id: `ui-chapter-${n}`,
      chapter: 'ui',
      purpose: `Chapter title card for "${title}".`,
      aspect: '16:9',
      resolution: '1.5K',
      refs: ['sc00-cover'],
      prompt: `A vintage storybook chapter title page on aged cream paper with a delicate gold and ink border of Celtic knotwork and small crystal motifs. Centred hand-lettering reads exactly "chapter ${Number(n)}" small above, and "${title}" large below, all lowercase. Style: ${STYLE}.`,
    }),
  ),
  {
    kind: 'image',
    id: 'ui-og',
    chapter: 'ui',
    purpose: 'Open Graph share image (1200×630 crop).',
    aspect: '2:1',
    resolution: '1.5K',
    refs: [...LINEUP, 'sc12-sunrise'],
    prompt: scene(
      `Poster key art: ${CHARACTERS.ray} in the centre holding up the glowing crystal, the whole cast around him (${cast('crit', 'dex', 'warren', 'leemer', 'spicebag', 'born')}), Waterford's round tower and river behind at golden hour. Hand-lettered title across the top: "repath.life".`,
    ),
  },
  {
    kind: 'image',
    id: 'ui-favicon-crit',
    chapter: 'ui',
    purpose: 'Favicon / app icon source: Crit\'s face.',
    aspect: '1:1',
    resolution: '1K',
    refs: ['char-crit-turnaround'],
    prompt: scene(`Icon: just the head of ${CHARACTERS.crit}, front-facing, bold simple shapes that read at 32px, on a deep indigo circle.`, NO_TEXT),
  },
]

// ─────────────────────────────────────────────────────────────
// stage 5 — video (Seedance 2.0 Mini, image-to-video)
// Same first and last frame = a seamless loop.
// ─────────────────────────────────────────────────────────────
const MOTION = 'hand-drawn 2D animation feel, animated on twos, gentle camera, painterly background stays stable, characters stay on model'

const loop = (
  id: string,
  frame: string,
  chapter: string,
  purpose: string,
  prompt: string,
  duration = 8,
  size = '1280x720',
): VideoAsset => ({
  kind: 'video',
  id,
  chapter,
  purpose,
  prompt: `${prompt}. ${MOTION}. The final frame matches the first frame for a seamless loop.`,
  firstFrame: frame,
  lastFrame: frame,
  duration,
  size,
  audio: false,
})

const videoAssets: VideoAsset[] = [
  {
    kind: 'video',
    id: 'v00-book-opens',
    chapter: '00 once upon a time',
    purpose: 'Intro: the storybook cover opens to the first page (plays once, ~6s).',
    prompt: `The closed leather storybook slowly opens by itself, the cover swinging up and over, pages fanning with a soft breeze and sparkles, settling open on the first page. Candle flame flickers. ${MOTION}.`,
    firstFrame: 'sc00-cover',
    lastFrame: 'sc01-storybook',
    duration: 6,
    size: '1280x720',
    audio: true,
  },
  loop('v01-storybook-idle', 'sc01-storybook', '00 once upon a time', 'Hero idle loop behind the 3D layers.', 'Sparkles drift up from the open page, candle flame flickers, the watercolour river shimmers with moving reflections'),
  loop('v01b-projector', 'sc17-projector', '01b the reel', 'Loop: projector flicker and dust; the bedsheet stays blank for compositing.', 'The projector reels turn, the light cone flickers softly, dust motes drift, Leemer\'s tail sways. The white bedsheet stays perfectly blank, flat and still', 8),
  loop('v02-counter-chaos', 'sc02-counter', '01 the counter', 'Comedy loop for the takeaway chapter.', 'Ray juggles the boxes in a looping arc, the ticket ribbon keeps unspooling and waving, Spice Bag dances on the counter, fryer steam puffs, customers tap their feet', 8),
  loop('v04-night-shift', 'sc04-night-shift', '03 the night shift', 'Ambient loop: crystal light, sidekicks breathing.', 'The crystal pulses softly and its rainbow beams sweep slowly, Ray types, Crit blinks through its monocle, Leemer\'s lanterns sway, Warren turns a page, Dex ruffles its feathers', 10),
  {
    kind: 'video',
    id: 'v05-leemer-arrives',
    chapter: '03 the night shift / leemerchat',
    purpose: 'Beat: lights out, Leemer swings in with lantern tails.',
    prompt: `The room is dark and the monitor flickers off with a sad face, Ray's eyes pop wide, then Leemer swings in on the curtain rail and its lantern tails light up one by one in red, amber, green, blue and violet, ending on a wink. ${MOTION}.`,
    firstFrame: 'sc05-leemer-backup',
    duration: 6,
    size: '1280x720',
    audio: true,
  },
  {
    kind: 'video',
    id: 'v06-crit-gavel',
    chapter: '03 the night shift / critique',
    purpose: 'Beat: Crit reads the scroll, bangs the gavel, the stamp lands.',
    prompt: `Crit squints through its monocle at the long scroll, harrumphs, bangs the gavel twice, the "repair ready" stamp slams down, the little robot gulps and its antenna droops. Comic timing, squash and stretch. ${MOTION}.`,
    firstFrame: 'sc06-crit-court',
    duration: 6,
    size: '1280x720',
    audio: true,
  },
  loop('v07-dex-flight', 'sc07-dex-flies', '03 the night shift / dáildex', 'Loop: Dex flying over Ireland, envelopes fluttering.', 'Dex flaps happily in place while the map scrolls gently beneath, envelopes flutter in the kite tail, clouds drift', 8),
  loop('v08-warren-fall', 'sc08-warren-hole', '03 the night shift / warren.wiki', 'Loop: endless fall down the rabbit hole.', 'Warren drifts downward reading while bookshelves scroll upward past him endlessly and the glowing threads between books pulse', 8),
  loop('v09-born-grows', 'sc09-born-grows', '03 the night shift / leemerlabs', 'Loop: crystal lattice branches grow and shimmer.', 'Born sways and the crystal lattice behind it shimmers with light travelling along its branches, stars twinkle', 8),
  loop('v10-fog', 'sc10-fog', '04 the middle', 'Loop: Ray walks in place, fog rolls, fireflies lead.', 'Ray walks slowly in place, fog rolls across the frame, rain falls gently, the fireflies drift ahead and glow brighter', 10),
  loop('v11-fireflies', 'sc11-fireflies', '05 notes', 'Ambient loop behind notes.', 'Fireflies drift and blink at different depths, grass sways, river glints', 12),
  loop('v12-sunrise', 'sc12-sunrise', '06 receipts', 'Loop: triumph on the hill.', 'Sun rays shimmer, the glass towers sparkle, the sidekicks bounce and cheer, chips fly like confetti, Dex circles overhead', 8),
  loop('v13-bottles', 'sc13-bottle', '07 write one', 'Loop: bottles drifting on the Suir.', 'The glowing bottles drift slowly downstream, ripples spread, lamp reflections wobble', 10),
  {
    kind: 'video',
    id: 'v14-not-even-close',
    chapter: '08 not even close',
    purpose: 'Finale gag: "the end" gets painted over with "not even close."',
    prompt: `Ray leans into the end card with a giant paintbrush, strikes through "the end" in one bold stroke, paints "not even close." underneath, then turns to camera and grins as Crit raises an eyebrow, Spice Bag laughs and Leemer drops down from the frame. ${MOTION}.`,
    firstFrame: 'sc14-the-end',
    lastFrame: 'sc15-not-even-close',
    duration: 8,
    size: '1280x720',
    audio: true,
  },
  ...(['crit', 'dex', 'leemer', 'spicebag', 'born'] as const).map((name) =>
    loop(
      `v-sprite-${name}`,
      `sprite-${name}`,
      'mascots',
      `Idle loop for ${name}, chroma-keyed to a transparent sprite for corner mascots.`,
      `${name === 'spicebag' ? 'Spice Bag does a little shuffle dance, steam puffs' : name === 'dex' ? 'Dex bobs its head and adjusts its cap' : name === 'leemer' ? 'Leemer sways and its lantern tails swing' : name === 'crit' ? 'Crit blinks slowly and adjusts its monocle, unimpressed' : 'Born bobs gently and its inner light pulses'}. The pure green background stays perfectly flat and unchanged`,
      4,
      '720x720',
    ),
  ),
  ...['sc02-counter', 'sc04-night-shift', 'sc07-dex-flies', 'sc10-fog', 'sc12-sunrise'].map((frame) =>
    loop(
      `v-mobile-${frame}`,
      `${frame}-mobile`,
      'mobile',
      `9:16 loop of ${frame} for phones.`,
      'Gentle ambient motion of everything in the scene, characters breathing and blinking, light shimmering',
      6,
      '720x1280',
    ),
  ),
]

export const assets: Asset[] = [
  ...characterAssets,
  ...sceneAssets,
  ...multiplaneAssets,
  ...uiAssets,
  ...videoAssets,
]
