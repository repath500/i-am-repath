export type Work = {
  id: string
  name: string
  href: string
  linkLabel: string
  icon: string
  role: string
  origin: string
  paragraphs: string[]
}

export type ShipLogEntry = {
  date: string
  line: string
}

export const pageIntro = {
  label: 'repath khan',
  alsoKnownAs: 'some people know me as ray. my name is repath khan.',
  lede:
    'i build ai products for developers, founders, and people who want models as real tools. not chat demos.',
  paragraphs: [
    'i have been building in ai since late 2022. over two and a half thousand commits in the past year alone. billions of tokens through real traffic. what started as a backup for when gpt-4 went down became leemerchat, then critique, then a stack of products i run every day.',
    'i am not casually using ai tools. i test models early, including pre-release lanes like glm and kimi. i talk to founders before and after launch, including people from yc, a16z-adjacent networks, and other startup ecosystems. that keeps the work grounded. you see what breaks before the announcement.',
    'i build because i want to understand where technology is going, especially ai as infrastructure for people who ship. developer tools, coding agents, model access, founder workflows. i learn by building fast, breaking things, and talking to people close to the edge of the market.',
    'waterford, ireland. former analog devices software intern. young, ambitious, still evolving. serious about turning fast-moving ai into software people can actually ship with.',
  ],
}

export const nowLine = {
  label: 'now',
  text: 'shipping critique\'s community edition and tightening the agent review loop.',
}

export const identity = {
  location: 'waterford, ireland',
  rayRepath: 'ray to some. repath to the work.',
  builder: 'repath khan · builder',
}

export const testingLane = {
  label: 'testing lane',
  line: 'early access to glm, kimi, and frontier models before they ship.',
}

export const shipLog: ShipLogEntry[] = [
  {
    date: 'jun 2026',
    line: 'proof of work on repath.life — github as receipts.',
  },
  {
    date: 'may 2026',
    line: 'critique community edition open sourced on github.',
  },
  {
    date: 'apr 2026',
    line: 'warren.wiki rabbit hole mode and askwarren shipped.',
  },
  {
    date: 'mar 2026',
    line: 'leemerchat routing for new frontier models before public launch.',
  },
  {
    date: 'feb 2026',
    line: 'critique sandbox review loop — clone, inspect, verdict.',
  },
  {
    date: 'jan 2026',
    line: 'leemerlabs inference gateway hardened for production traffic.',
  },
]

export const beliefs = [
  'ai should work inside real development workflows, not sit beside them as a chat box.',
  'the best products come from testing models early and building before the category has a name.',
  'speed matters, but so does proof, especially when agents are writing the code.',
  'i am grateful for the founders and teams who let me test early. it shapes everything i ship.',
]

export const mainWorks: Work[] = [
  {
    id: 'critique',
    name: 'critique',
    href: 'https://critique.sh',
    linkLabel: 'critique.sh',
    icon: 'https://www.critique.sh/icon.svg',
    role: 'for builders, coding agents, and developer workflows.',
    origin: 'born from watching agents write code nobody trusted to merge.',
    paragraphs: [
      'critique is my most developer-focused product. ai coding agents, code review, repo understanding, sandboxed execution, bug fixing, and pull request generation.',
      'the direction is simple: ai should help you ship software, not just reply in a thread.',
      'it is built for technical founders, indie hackers, startups, and developers who care about speed and code quality. modern and direct. not generic enterprise saas.',
      'every serious pull request can be cloned into a sandbox, inspected, and turned into a stored verdict. agents write the patch. critique judges whether it should merge.',
      'critique is also going open source. a self-hosted community edition for github pr review lives in repath500/critique-community, split from the hosted product so teams can run the review loop on their own infrastructure.',
    ],
  },
  {
    id: 'leemerchat',
    name: 'leemerchat',
    href: 'https://www.leemerchat.com',
    linkLabel: 'leemerchat.com',
    icon: 'https://www.leemerchat.com/favicon.ico',
    role: 'ai chat, model access, and experimentation.',
    origin: 'started when gpt-4 went down and i needed a backup that became the main thing.',
    paragraphs: [
      'leemerchat is the ai chat product. more than a wrapper around one api. it is a clean interface for talking to models, comparing how they behave, and using ai in a way that feels fast and useful.',
      'accessible but serious. real users, real traffic, and billions of tokens moving through it. part of the broader work around model access, usability, and better experiences on top of large language models.',
      'when a new frontier model is worth routing, it usually lands here first. this is where i test capability before it becomes product elsewhere.',
    ],
  },
  {
    id: 'leemerlabs',
    name: 'leemerlabs',
    href: 'https://www.leemerlabs.com',
    linkLabel: 'leemerlabs.com',
    icon: 'https://www.leemerlabs.com/icon.svg',
    role: 'the lab for inference, foundry, and experiments.',
    origin: 'the umbrella for everything that does not fit on one landing page yet.',
    paragraphs: [
      'leemerlabs is the broader lab identity. ireland-hosted inference, custom model training through foundry, and the place where i prototype before ideas harden into products.',
      'not academic research. a builder lab.',
      'inference gateway, born applied intelligence, commercially useful experiments. ambitious and technical, but product-driven. the umbrella for work that does not fit on one landing page.',
    ],
  },
]

export const moreFromLab: Work[] = [
  {
    id: 'warren',
    name: 'warren.wiki',
    href: 'https://warren.wiki',
    linkLabel: 'warren.wiki',
    icon: 'https://www.warren.wiki/favicon.ico',
    role: 'knowledge, discovery, and infinite wiki exploration.',
    origin: 'for people who think in networks, not linear articles.',
    paragraphs: [
      'warren.wiki turns any topic into a living outline you can expand by following connections. wiki mode for structured learning, rabbit hole mode for discovery, and askwarren for real-time answers blended with search and news.',
      'built from ireland. privacy-first and open source minded. one of the domain products that came out of the same lab stack as everything else. finance and research shaped, but useful for anyone who thinks in networks rather than linear articles.',
    ],
  },
]

export const openToWork = {
  heading: 'if you\'re building in this space',
  paragraphs: [
    'if you\'re working on agents, developer tools, or model-facing products — i want to hear from you.',
    'founding engineer roles, ai product builds, technical collaborations with teams that are serious about shipping.',
    'email me. i read everything that comes through.',
  ],
  email: 'ray@critique.sh',
}

export const closingNote =
  'this site is my personal operating system for the work. not a cv. if you care about coding agents, model interfaces, or what i am building next, the links above are where it lives.'
