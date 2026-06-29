export type PipelineStatus =
  | 'shipping'
  | 'live'
  | 'active'
  | 'research'
  | 'experimental'
  | 'private'

export type EcosystemProject = {
  id: string
  name: string
  tagline: string
  architecture: string
  status: PipelineStatus
  repo?: { label: string; href: string; visibility: 'public' | 'private' }
  live?: { label: string; href: string }
  stack?: string[]
}

export type EcosystemLayer = {
  id: string
  title: string
  mission: string
  stack: string[]
  projects: EcosystemProject[]
}

export type PipelineLogEntry = {
  id: string
  layerId: string
  projectId: string
  at: string
  status: PipelineStatus
  note: string
}

export const statusLabel: Record<PipelineStatus, string> = {
  shipping: 'shipping',
  live: 'live',
  active: 'active',
  research: 'research',
  experimental: 'experimental',
  private: 'private',
}

export const ecosystemLayers: EcosystemLayer[] = [
  {
    id: 'critique',
    title: 'critique',
    mission:
      'vibe insurance for developers — an AI-powered code verification platform. we do not just read code. we run it.',
    stack: ['typescript', 'next.js', 'prisma', 'inngest', 'e2b', 'vercel'],
    projects: [
      {
        id: 'critique-core',
        name: 'critique',
        tagline: 'flagship monorepo — GitHub-native review with ephemeral sandboxes on every push',
        architecture:
          'git diff lands in E2B sandboxes on push. specialist reviewers inspect the working tree, emit a durable JSON artifact, and publish native GitHub reviews before production-breaking merges, buglocks, leaks, or circular imports land.',
        status: 'shipping',
        repo: {
          label: 'repath500/critique',
          href: 'https://github.com/repath500',
          visibility: 'private',
        },
        live: { label: 'critique.sh', href: 'https://critique.sh' },
        stack: ['typescript', 'next.js', 'prisma', 'inngest', 'e2b'],
      },
      {
        id: 'critique-community',
        name: 'critique-community',
        tagline: 'self-hosted community edition for automated GitHub PR reviews',
        architecture:
          'community deploy path for teams that want Critique mechanics without the hosted control plane — same sandbox-first review loop, self-managed infra.',
        status: 'active',
        repo: {
          label: 'repath500/critique-community',
          href: 'https://github.com/repath500/critique-community',
          visibility: 'public',
        },
      },
      {
        id: 'critique-review',
        name: 'critique-review',
        tagline: 'free open-source review skill for Cursor, Codex, Claude, and other coding agents',
        architecture:
          'portable agent skill — inspect diff first, classify risk, verify with tests, publish findings before summary. routes heavy GitHub control-plane work to Critique when users need merge policy and stored artifacts.',
        status: 'live',
        repo: {
          label: 'repath500/critique-review',
          href: 'https://github.com/repath500/critique-review',
          visibility: 'public',
        },
      },
    ],
  },
  {
    id: 'leemer',
    title: 'leemer labs & leemerchat',
    mission:
      'frontier AI experimentation, evaluations, and deployments — a multi-model workspace with live parity to the models Repath actually ships against.',
    stack: ['typescript', 'next.js', 'runpod', 'lobehub ui'],
    projects: [
      {
        id: 'leemerchat',
        name: 'leemerchat',
        tagline: 'flagship multi-model workspace — 1B+ tokens through real traffic',
        architecture:
          'unified chat, research, codebase context, and connector surface. PowerCode retired in v8; review-first ship work routes to Critique while LeemerChat keeps frontier models and GitHub-aware assistance.',
        status: 'live',
        repo: {
          label: 'repath500/leemerchat',
          href: 'https://github.com/repath500/leemerchat',
          visibility: 'public',
        },
        live: { label: 'leemerchat.com', href: 'https://www.leemerchat.com' },
        stack: ['typescript', 'next.js', 'lobehub ui'],
      },
      {
        id: 'leemer-studio',
        name: 'leemer-studio',
        tagline: 'premium chat interface delivering live model parity for image and video generation',
        architecture:
          'first-class media desk inside LeemerChat — reference uploads, model gates, generation ledger, progress polling, and private history without polluting the main chat shell.',
        status: 'live',
        live: { label: 'leemerchat.com/studio', href: 'https://www.leemerchat.com' },
        stack: ['typescript', 'next.js'],
      },
      {
        id: 'superlm',
        name: 'superlm',
        tagline: 'routing engine and entitlement system for frontier model access',
        architecture:
          'central router for Qwen 3.7, GPT-5.4, Sonnet 4.6, GLM-5, Kimi K2.x, and partner lanes — spend controls, model metadata, and access rules shared across Leemer surfaces.',
        status: 'shipping',
        live: { label: 'leemerlabs.com', href: 'https://www.leemerlabs.com' },
        stack: ['typescript', 'runpod'],
      },
      {
        id: 'leemerchat-blog',
        name: 'leemerchat-blog',
        tagline: 'editorial-first writing outlet with high-end typography',
        architecture:
          'product narrative and changelog surface — GA posts, model launches, and migration stories (PowerCode → Critique) ship here before they hit marketing shells.',
        status: 'live',
        live: { label: 'leemerchat.com/blog', href: 'https://www.leemerchat.com/blog' },
      },
    ],
  },
  {
    id: 'civic',
    title: 'daildex & ai regulation',
    mission:
      'data systems tracking Irish political infrastructure and compliance — civic transparency with a frontier-AI engineering posture.',
    stack: ['typescript', 'upstash redis', 'vercel'],
    projects: [
      {
        id: 'daildex',
        name: 'daildex',
        tagline: 'monorepo tracking Irish political data on KildareStreet / Oireachtas framing',
        architecture:
          'joins parliamentary records, constituency context, and team credibility signals into one civic grid — built to highlight who is doing serious AI work in Ireland, not just who claims it.',
        status: 'active',
        stack: ['typescript', 'upstash redis', 'vercel'],
      },
      {
        id: 'ai-regulation-ie',
        name: 'ai-regulation-ie',
        tagline: 'workspace and backup flow for AI regulatory compliance and safety navigator',
        architecture:
          'compliance workspace for EU AI Act posture — document flows, safety navigator backups, and regulatory reference material kept adjacent to live product decisions.',
        status: 'active',
        repo: {
          label: 'repath500/ai-regulation-ie',
          href: 'https://github.com/repath500/ai-regulation-ie',
          visibility: 'public',
        },
        stack: ['typescript', 'vercel'],
      },
    ],
  },
  {
    id: 'playground',
    title: 'experimental playgrounds',
    mission:
      'smaller surfaces where interaction design, multi-agent coordination, and personal ritual meet production infrastructure.',
    stack: ['supabase', 'upstash redis', 'redis'],
    projects: [
      {
        id: 'i-am-repath',
        name: 'i-am-repath',
        tagline: 'personal experiential site — digital rituals, sealed letters, real-time visitor presence',
        architecture:
          'you are here. square film per visit, Upstash-backed presence and visitor notes, letter sealing with timed delivery — experiential layer on the same KV patterns used across the stack.',
        status: 'live',
        repo: {
          label: 'repath500/i-am-repath',
          href: 'https://github.com/repath500/i-am-repath',
          visibility: 'public',
        },
        live: { label: 'repath.life', href: 'https://repath.life' },
        stack: ['typescript', 'vite', 'upstash redis'],
      },
      {
        id: 'builder',
        name: 'builder',
        tagline: 'creative website builder powered by Supabase multi-tenancy and AI-generated CMS',
        architecture:
          'tenant-scoped sites with AI-authored content blocks — Supabase RLS for isolation, generated CMS schema per workspace, export path toward static deploys.',
        status: 'research',
        stack: ['supabase', 'typescript', 'next.js'],
      },
      {
        id: 'askwarren',
        name: 'askwarren / council',
        tagline: 'collaborative multi-agent runtimes experimenting with autonomous chat roles',
        architecture:
          'orchestrator → worker chains and role-specialized agents in shared sessions — early coordination patterns that fed KingLeemer and Mission Control thinking.',
        status: 'experimental',
        stack: ['typescript', 'redis'],
      },
    ],
  },
]

export const pipelineLog: PipelineLogEntry[] = [
  {
    id: 'critique-sandbox-artifact',
    layerId: 'critique',
    projectId: 'critique-core',
    at: '2026-03',
    status: 'shipping',
    note: 'sandbox writes /tmp/critique-review-output.json; app layer persists and publishes to GitHub without reading source directly',
  },
  {
    id: 'critique-community-ce',
    layerId: 'critique',
    projectId: 'critique-community',
    at: '2026-06',
    status: 'active',
    note: 'community edition repo public — self-hosted PR review path for teams outside hosted Critique',
  },
  {
    id: 'critique-review-skill',
    layerId: 'critique',
    projectId: 'critique-review',
    at: '2026-06',
    status: 'live',
    note: 'OSS agent skill shipped — npx skills add repath500/critique-review for Cursor, Codex, Claude',
  },
  {
    id: 'leemer-v8-critique-split',
    layerId: 'leemer',
    projectId: 'leemerchat',
    at: '2026-03',
    status: 'live',
    note: 'LeemerChat v8 retires in-app PowerCode; review-first ship work standardizes on Critique.sh',
  },
  {
    id: 'leemer-studio-ga',
    layerId: 'leemer',
    projectId: 'leemer-studio',
    at: '2026-05',
    status: 'live',
    note: 'LeemerStudio GA — image/video desk with private generation ledger inside LeemerChat',
  },
  {
    id: 'superlm-frontier-router',
    layerId: 'leemer',
    projectId: 'superlm',
    at: '2026-03',
    status: 'shipping',
    note: 'frontier stack live — GPT-5.4, GLM-5, Sonnet 4.6, Qwen 3.7, Kimi K2.6 with entitlement gates',
  },
  {
    id: 'ai-regulation-workspace',
    layerId: 'civic',
    projectId: 'ai-regulation-ie',
    at: '2026-01',
    status: 'active',
    note: 'compliance workspace and backup flows maintained alongside EU AI Act product decisions',
  },
  {
    id: 'daildex-oireachtas',
    layerId: 'civic',
    projectId: 'daildex',
    at: '2026-02',
    status: 'active',
    note: 'Oireachtas / KildareStreet data joins in monorepo — civic grid and team credibility surface in progress',
  },
  {
    id: 'repath-presence',
    layerId: 'playground',
    projectId: 'i-am-repath',
    at: '2026-06',
    status: 'live',
    note: 'presence whisper, visitor notes, and letter sealing live on repath.life with Upstash REST',
  },
  {
    id: 'builder-tenancy',
    layerId: 'playground',
    projectId: 'builder',
    at: '2026-04',
    status: 'research',
    note: 'Supabase multi-tenant CMS prototype — AI-generated blocks per workspace',
  },
  {
    id: 'council-agents',
    layerId: 'playground',
    projectId: 'askwarren',
    at: '2026-02',
    status: 'experimental',
    note: 'multi-agent council sessions — autonomous role handoffs feeding broader orchestration work',
  },
]

export const founderContext = {
  name: 'repath khan',
  handle: 'repath500',
  role: 'founder & systems engineer',
  bio: 'waterford-based builder behind the leemer group. former analog devices software engineer. ships multi-layer AI infrastructure — not slide decks.',
  access: [
    'walt access to frontier models including GLM-5, GPT-5-Turbo, Kimi K2.5, K2.6, and K2.7',
    'early access partner for YC products during foundation and post-YC with their founders',
  ],
  thesis:
    'a single opaque API is the wrong abstraction for serious work. coordination beats raw scale. european compliance posture is a design input, not a retrofit.',
}
