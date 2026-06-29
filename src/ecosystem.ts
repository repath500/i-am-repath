export type Work = {
  id: string
  name: string
  href: string
  role: string
  why: string
  building: string
}

export const pageIntro = {
  label: 'repath khan',
  lede:
    'i build ai systems for people who ship real software. not demos — products with traffic, sandboxes, and merge boundaries.',
  why:
    'i started leemerchat in 2023 because one model going down shouldn\'t stop your work. that turned into infrastructure, a review product, and a whole stack i actually run every day. this page is the honest map — what i\'m building, and why it exists.',
  background:
    'waterford, ireland. former analog devices engineer. i care about coordination over raw scale, and about building in europe without treating compliance as an afterthought.',
}

export const mainWorks: Work[] = [
  {
    id: 'critique',
    name: 'critique',
    href: 'https://critique.sh',
    role: 'flagship · vibe insurance for developers',
    why:
      'agents write code faster than teams can trust it. i got tired of review tools that only read diffs — production breaks when nobody actually runs the tree. critique exists so the merge boundary has proof, not vibes.',
    building:
      'github-native change control. every serious pull request gets cloned into a sandbox, inspected, and turned into a stored verdict — not a chat thread. if it can\'t run, it shouldn\'t merge. that\'s the whole product.',
  },
  {
    id: 'leemerchat',
    name: 'leemerchat',
    href: 'https://www.leemerchat.com',
    role: 'daily workspace · frontier models in one place',
    why:
      'one api is the wrong abstraction. serious work needs model choice, research depth, and a shell that doesn\'t fall over when your primary provider blinks. leemerchat is the workspace i wanted when gpt-4 went down at 2am.',
    building:
      'multi-model chat, research, codebase context, and connectors — the place i go for reasoning, writing, and exploration. review-first ship work lives on critique now; leemerchat stays the brain, not the gate.',
  },
  {
    id: 'leemerlabs',
    name: 'leemerlabs',
    href: 'https://www.leemerlabs.com',
    role: 'research & infrastructure arm',
    why:
      'the products need a floor underneath them — inference, custom models, and the engineering that doesn\'t belong in a marketing page. leemerlabs is where the hard infra work lives.',
    building:
      'public inference gateway, model foundry, and the research layer behind leemerchat and critique. if i\'m testing a frontier model seriously, it probably routes through here first.',
  },
]

export const alsoTending: Work[] = [
  {
    id: 'daildex',
    name: 'daildex',
    href: 'https://www.leemerlabs.com',
    role: 'civic data · ireland',
    why:
      'i think ireland should know who is doing real ai work and who is performing it. daildex is my attempt to join political data with that honesty — oireachtas framing, credibility signals, nothing performative.',
    building:
      'a monorepo tracking irish political infrastructure — parliamentary records, constituency context, and a surface that treats civic data like engineering, not a campaign site.',
  },
  {
    id: 'ai-regulation-ie',
    name: 'ai-regulation-ie',
    href: 'https://github.com/repath500/ai-regulation-ie',
    role: 'compliance workspace',
    why:
      'eu ai act posture shouldn\'t live in a forgotten notion doc. i keep regulatory reference and safety flows adjacent to the products they actually govern.',
    building:
      'workspace and backup flow for ai regulatory compliance — the boring paperwork side of building in europe, kept close to the code.',
  },
  {
    id: 'repath-life',
    name: 'repath.life',
    href: 'https://repath.life',
    role: 'this site',
    why:
      'not everything i make is a product pitch. sometimes i want a quiet place — a film, a note, a letter sealed for later. this site is that.',
    building:
      'personal experiential site. square film per visit, visitor presence, notes, letters. the rest of the stack is work; this is the record of becoming.',
  },
]

export const closingNote =
  'if you landed here from linkedin or a product — the work lives at the links above. this page is just me explaining what i\'m actually building, and why i haven\'t stopped.'
