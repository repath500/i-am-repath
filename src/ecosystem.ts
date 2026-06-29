export type Work = {
  id: string
  name: string
  href: string
  linkLabel: string
  icon: string
  role: string
  paragraphs: string[]
}

export const pageIntro = {
  label: 'repath khan',
  lede:
    'i build ai products for developers, founders, and people who want models as real tools. not chat demos.',
  paragraphs: [
    'i have been building in ai since late 2022. over two and a half thousand commits in the past year alone. billions of tokens through real traffic. what started as a backup when gpt-4 went down became leemerchat, then critique, then a lab and a stack i run every day.',
    'i am not casually using ai tools. i test models early, including pre-release lanes like glm and kimi. i talk to founders before and after launch, including people from yc and a16z-related networks. that keeps the work grounded. you see what breaks before the announcement.',
    'i build because i want to understand where technology is going. especially ai as infrastructure for builders. developer tools, coding agents, model access, founder workflows. i learn by shipping fast, breaking things, and talking to people at the edge of the market.',
    'waterford, ireland. former analog devices engineer. young, ambitious, still evolving. but serious about turning fast-moving ai into software people can actually ship with.',
  ],
}

export const beliefs = [
  'ai should work inside real development workflows, not sit beside them as a chat box.',
  'the best products come from testing models early and building before the category has a name.',
  'speed matters, but so does proof. especially when agents are writing the code.',
  'i am grateful for the founders and teams who let me test early. it shapes everything i ship.',
]

export const mainWorks: Work[] = [
  {
    id: 'critique',
    name: 'critique',
    href: 'https://critique.sh',
    linkLabel: 'critique.sh',
    icon: 'https://www.critique.sh/icon.svg',
    role: 'for builders · coding agents and developer workflows',
    paragraphs: [
      'critique is my most developer-focused product. ai coding agents, code review, repo understanding, sandboxed execution, bug fixing, pull request generation. the direction is simple: ai should help you ship software, not just reply in a thread.',
      'it is built for builders, technical founders, indie hackers, and startups who care about speed and code quality. modern and direct. not generic enterprise saas.',
      'every serious pull request can be cloned into a sandbox, inspected, and turned into a stored verdict. agents write the patch. critique judges whether it should merge. that is the workflow i wanted when review tools only read diffs and production still broke.',
    ],
  },
  {
    id: 'leemerchat',
    name: 'leemerchat',
    href: 'https://www.leemerchat.com',
    linkLabel: 'leemerchat.com',
    icon: 'https://www.leemerchat.com/favicon.ico',
    role: 'ai chat · model access and experimentation',
    paragraphs: [
      'leemerchat is the ai chat product. more than a wrapper around one api. it is a clean interface for talking to models, comparing how they behave, and using ai in a way that feels fast and useful.',
      'accessible but serious. part of the broader work around model access, usability, and better product experiences on top of large language models. over a billion tokens have moved through it from real users.',
      'when a new frontier model is worth routing, it usually lands here first. this is where i test capability before it becomes infrastructure somewhere else in the stack.',
    ],
  },
  {
    id: 'leemerlabs',
    name: 'leemerlabs',
    href: 'https://www.leemerlabs.com',
    linkLabel: 'leemerlabs.com',
    icon: 'https://www.leemerlabs.com/icon.svg',
    role: 'the lab · where experiments become products',
    paragraphs: [
      'leemerlabs is the broader ai lab identity. where i explore model workflows, test tools, prototype fast, and turn useful ideas into products. not academic research. a builder lab.',
      'inference, foundry, agent tooling, founder-facing experiments. commercially useful learning. if i am trying to understand what a model is actually good at, a lot of that work happens here before it shows up in critique or leemerchat.',
      'ambitious and technical, but product-driven. the umbrella for everything that does not fit neatly on one landing page.',
    ],
  },
]

export const closingNote =
  'this site is my personal operating system for the work. not a cv. if you care about coding agents, model interfaces, or what i am building next, the products above are where it lives.'
