export type Work = {
  id: string
  name: string
  href: string
  linkLabel: string
  icon: string
  role: string
  why: string
  building: string
  more?: string
}

export const pageIntro = {
  label: 'repath khan',
  lede:
    'i build ai systems for people who ship real software. not demos. products with traffic, sandboxes, and merge boundaries.',
  paragraphs: [
    'i have been in the ai space since late 2022. what started as a backup chat when gpt-4 went down became leemerchat, then infrastructure, then critique, then a whole stack i run every day. over two and a half thousand commits in the past year alone. billions of tokens through real traffic, not benchmarks.',
    'i stay deep in the ecosystem. blessed with early access to frontier models like glm, kimi, and the lanes i actually ship against. i have been fortunate to try yc products pre-launch and post-launch with their founders, and to do the same with a16z founders. that keeps the work honest. you learn what breaks before the press release.',
    'waterford, ireland. former analog devices engineer. i care about coordination over raw scale, and about building in europe without treating compliance as an afterthought. this page is the map of what i am building and why.',
  ],
}

export const mainWorks: Work[] = [
  {
    id: 'critique',
    name: 'critique',
    href: 'https://critique.sh',
    linkLabel: 'critique.sh',
    icon: 'https://www.critique.sh/icon.svg',
    role: 'flagship · vibe insurance for developers',
    why:
      'agents write code faster than teams can trust it. i got tired of review tools that only read diffs. production breaks when nobody actually runs the tree. critique exists so the merge boundary has proof, not vibes.',
    building:
      'github-native change control. every serious pull request gets cloned into a sandbox, inspected, and turned into a stored verdict. not a chat thread. if it cannot run, it should not merge. that is the whole product.',
    more:
      'i built this because i kept shipping agent-written code and watching teams merge on faith. critique is the judge that is not the writer. sandboxes, change passports, merge policy. the boring infrastructure that keeps velocity from becoming debt.',
  },
  {
    id: 'leemerchat',
    name: 'leemerchat',
    href: 'https://www.leemerchat.com',
    linkLabel: 'leemerchat.com',
    icon: 'https://www.leemerchat.com/favicon.ico',
    role: 'daily workspace · frontier models in one place',
    why:
      'one api is the wrong abstraction. serious work needs model choice, research depth, and a shell that does not fall over when your primary provider blinks. leemerchat is the workspace i wanted when gpt-4 went down at 2am.',
    building:
      'multi-model chat, research, codebase context, and connectors. the place i go for reasoning, writing, and exploration. review-first ship work lives on critique now. leemerchat stays the brain, not the gate.',
    more:
      'more than a billion tokens have moved through this product from real users. i still use it daily. when a new frontier model drops, it lands here first. glm, kimi, sonnet, gpt. whatever is actually worth routing.',
  },
  {
    id: 'leemerlabs',
    name: 'leemerlabs',
    href: 'https://www.leemerlabs.com',
    linkLabel: 'leemerlabs.com',
    icon: 'https://www.leemerlabs.com/icon.svg',
    role: 'research and infrastructure arm',
    why:
      'the products need a floor underneath them. inference, custom models, and the engineering that does not belong in a marketing page. leemerlabs is where the hard infra work lives.',
    building:
      'public inference gateway, model foundry, and the research layer behind leemerchat and critique. if i am testing a frontier model seriously, it probably routes through here first.',
    more:
      'born applied intelligence, foundry, the inference stack. this is the part of the group that does not need a glossy landing page to matter. it is the substrate.',
  },
]

export const alsoTending: Work[] = [
  {
    id: 'daildex',
    name: 'daildex',
    href: 'https://www.leemerlabs.com',
    linkLabel: 'leemerlabs.com',
    icon: 'https://www.leemerlabs.com/icon.svg',
    role: 'civic data · ireland',
    why:
      'i think ireland should know who is doing real ai work and who is performing it. daildex joins political data with that honesty. oireachtas framing, credibility signals, nothing performative.',
    building:
      'a monorepo tracking irish political infrastructure. parliamentary records, constituency context, and a surface that treats civic data like engineering, not a campaign site.',
  },
  {
    id: 'ai-regulation-ie',
    name: 'ai-regulation-ie',
    href: 'https://github.com/repath500/ai-regulation-ie',
    linkLabel: 'github.com/repath500/ai-regulation-ie',
    icon: 'https://github.com/favicon.ico',
    role: 'compliance workspace',
    why:
      'eu ai act posture should not live in a forgotten notion doc. i keep regulatory reference and safety flows adjacent to the products they actually govern.',
    building:
      'workspace and backup flow for ai regulatory compliance. the paperwork side of building in europe, kept close to the code.',
  },
  {
    id: 'repath-life',
    name: 'repath.life',
    href: 'https://repath.life',
    linkLabel: 'repath.life',
    icon: 'https://repath.life/favicon.svg',
    role: 'this site',
    why:
      'not everything i make is a product pitch. sometimes i want a quiet place. a film, a note, a letter sealed for later. this site is that.',
    building:
      'personal experiential site. square film per visit, visitor presence, notes, letters. the rest of the stack is work. this is the record of becoming.',
  },
]

export const closingNote =
  'if you landed here from linkedin or a product, the work lives at the links above. this page is just me explaining what i am actually building, and why i have not stopped.'
