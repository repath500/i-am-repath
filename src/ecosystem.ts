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

export type CritiqueShipRelease = {
  version: string
  title: string
  date: string
  current?: boolean
  highlights: string[]
  essay?: { label: string; href: string }
}

export type CritiqueBlogPost = {
  slug: string
  title: string
  date: string
  category: 'product' | 'model updates' | 'essays'
  author?: string
  summary: string
  href: string
}

export const critiqueCurrentVersion = 'v6.6'

export const critiqueShipLog: CritiqueShipRelease[] = [
  {
    version: 'v6.6',
    title: 'current ship line — change-control spine at full v6 maturity',
    date: '2026-06-29',
    current: true,
    highlights: [
      'live artifact on critique.sh — v6 line now spans Merge Gate API, Critique Intake, Agent Workspace, and OpenCode sandbox review as one writer → judge → merge loop',
      'community edition open-source path public — self-hosted PR review split into repath500/critique-community (see June 23 OSS essay)',
      'Coding Agent API lifecycle contract — title, tags, metadata, lifecycle, nextActions, and OpenAPI coverage for CI repair, support-to-fix, and supervisor workflows',
      'OpenCode review runtime from v6.5 rolled forward — 30-minute worker budget, background E2B command handles, @critique-bot PR chat, pr_comment_thread storage',
      'Agent Workspace shell from v6.3–v6.4 — tabbed session rail, floating ops inspector, calmer composer dock at /workspace',
    ],
    essay: {
      label: 'ship log',
      href: 'https://www.critique.sh/version',
    },
  },
  {
    version: 'v6.5',
    title: 'OpenCode review runtime hardening and PR chat readiness',
    date: '2026-06-26',
    highlights: [
      'QStash review worker extended to 30-minute serverless budget for full OpenCode sandbox passes',
      'OpenCode /session/:id/message runs through E2B background command handles — heartbeats and stall abort without monopolizing the sandbox',
      'duplicate review claims wait for real sandbox budgets instead of reclaiming after 10 minutes',
      '@critique-bot production default for hosted PR chat (legacy @critique alias kept)',
      'pr_comment_thread migration — trigger comments, prompts, replies, and errors stored for GitHub PR chat runs',
    ],
    essay: {
      label: 'ship log',
      href: 'https://www.critique.sh/version',
    },
  },
  {
    version: 'v6.4',
    title: 'Agent Workspace usability, operator boundaries, and layout polish',
    date: '2026-06-26',
    highlights: [
      'slimmer session header — toggle controls and single status line instead of duplicate runtime chrome',
      'left rail tabbed into Lanes, Repos, Sources, Projects; mobile sheet matches',
      'sticky composer dock reduced to input bar — preflight detail on demand, provider keys in settings sheet',
      'operations inspector floats by default on desktop; pin to dock when needed',
    ],
  },
  {
    version: 'v6.3',
    title: 'Agent Workspace layout aligned to a calmer T3-style shell',
    date: '2026-06-23',
    highlights: [
      'fixed three-region shell at /workspace — session rail, transcript, optional ops inspector',
      'empty state is sparse centered prompt + composer; active lanes own the center column',
      'prompt queue management moved to inspector Agents tab',
    ],
  },
  {
    version: 'v6.2',
    title: 'Critique Intake and sharper sandbox review recovery',
    date: '2026-06-23',
    highlights: [
      'Critique Intake ships — embeddable widget, browser context capture, deterministic triage, agent-ready handoff',
      'install via /intake/widget.js → POST /api/intake/report; Dashboard → Intake inbox',
      'OpenCode owns end-to-end sandbox review — hard wall-clock abort on stalled turns',
    ],
    essay: {
      label: 'intake essay',
      href: 'https://www.critique.sh/blog/critique-intake-agentic-bug-intake',
    },
  },
  {
    version: 'v6.1.1',
    title: 'agent stack integrations — upstreamSignals on the merge gate',
    date: '2026-06-17',
    highlights: [
      'upstreamSignals on POST /api/v1/reviews — RWX, Swytchcode, Iron Book cookbooks on /merge-gate-api',
      'partner attestation rides the same Change Passport as PASS / WARN / FAIL verdicts',
    ],
    essay: {
      label: 'v6.1.1 essay',
      href: 'https://www.critique.sh/blog/critique-v611-agent-stack-integrations',
    },
  },
  {
    version: 'v6.1',
    title: 'Platform API v1, Merge Gate packaging, lifecycle webhooks',
    date: '2026-06-17',
    highlights: [
      'POST /api/v1/reviews live — queue PR review over HTTP with crt_ keys',
      'Merge Gate API names the judge role — writer vs judge vs fixer, structured findings[], webhooks',
      'GLM-5.2 catalog rollover at same 3-credit floor; calmer default light-mode chrome',
    ],
    essay: {
      label: 'merge gate essay',
      href: 'https://www.critique.sh/blog/critique-merge-gate-api-v61',
    },
  },
]

export const critiqueBlogPosts: CritiqueBlogPost[] = [
  {
    slug: 'senior-developer-shortage',
    title: 'The senior developer shortage is coming. We\'re engineering it ourselves.',
    date: '2026-06-27',
    category: 'essays',
    summary:
      'entry-level hiring collapsed while AI productivity soared — the five-to-seven year mentorship lag means a senior drought around 2029–2031, and every team that ran the spreadsheet will compete for a pool they drained.',
    href: 'https://www.critique.sh/blog/senior-developer-shortage',
  },
  {
    slug: 'coding-agent-api-cloud-workflows',
    title: 'Critique Coding Agent API: How Teams Are Actually Using Cloud Agents Over HTTP',
    date: '2026-06-24',
    category: 'product',
    author: 'repath khan',
    summary:
      'lifecycle fields, tags, metadata, intent classification, SSE status, and OpenAPI — shaped for CI repair, support-to-fix, internal fix bots, and writer→judge supervisor loops.',
    href: 'https://www.critique.sh/blog/critique-coding-agent-api-cloud-workflows',
  },
  {
    slug: 'critique-intake',
    title: 'Critique Intake: Feedback That Arrives Already Debugged',
    date: '2026-06-23',
    category: 'product',
    summary:
      'embeddable bug widget, one focused follow-up, browser context capture, deterministic triage, and agent-ready handoff into Builder, Review runs, and Change Passports.',
    href: 'https://www.critique.sh/blog/critique-intake-agentic-bug-intake',
  },
  {
    slug: 'critique-going-open-source',
    title: 'Critique Is Going Open Source',
    date: '2026-06-23',
    category: 'essays',
    summary:
      'public community edition for self-hosted GitHub PR review — what opens first, what stays out of scope, and why the split lives in a separate public repo (critique-community).',
    href: 'https://www.critique.sh/blog/critique-going-open-source',
  },
  {
    slug: 'critique-v611',
    title: 'Critique v6.1.1: Agent Stack Integrations — RWX, Swytchcode, and Iron Book',
    date: '2026-06-17',
    category: 'product',
    author: 'repath khan',
    summary:
      'upstreamSignals on the Merge Gate API — build validation, API execution, and runtime agent IAM on the same Change Passport without Critique pretending to be CI or enterprise IAM.',
    href: 'https://www.critique.sh/blog/critique-v611-agent-stack-integrations',
  },
  {
    slug: 'glm-52-critique',
    title: 'GLM-5.2 Lands in Critique: 1M Context, Design Arena #1, Same 3-Credit GLM-5.1 Shelf',
    date: '2026-06-17',
    category: 'model updates',
    summary:
      'GLM-5.2 replaces GLM-5.1 and GLM-5V-Turbo at the same 3-credit review floor — Z.ai benchmarks vs GPT-5.5 and Claude Opus 4.8, Design Arena Elo 1360.',
    href: 'https://www.critique.sh/blog/glm-5-2-long-horizon-critique-review-remedy',
  },
  {
    slug: 'kimi-k27-code',
    title: 'Kimi K2.7 Code Lands in Critique: Open-Source Coding at 4.5 Credits',
    date: '2026-06-13',
    category: 'model updates',
    summary:
      'Kimi K2.7 Code joins the Moonshot lane at 4.5 credits per PR review run — vendor coding benchmarks vs GPT-5.5 and Opus 4.8, reasoning-efficiency gains over K2.6.',
    href: 'https://www.critique.sh/blog/kimi-k2-7-code-critique-pr-review-remedy',
  },
  {
    slug: 'you-merged-that-why',
    title: 'You Merged That. Why.',
    date: '2026-06-15',
    category: 'essays',
    summary:
      'AI velocity outpaced review — what actually happens to PRs when teams merge anyway, and how sandbox verification plus merge policy closes the gap.',
    href: 'https://www.critique.sh/blog/you-merged-that-why',
  },
]

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
        tagline: 'flagship monorepo at v6.6 — AI change control at the GitHub merge boundary',
        architecture:
          'writer → judge → merge loop: Coding Agent API and Builder write patches; Checkpoint gates slop; OpenCode sandboxes run specialist review and emit /tmp/critique-review-output.json; Merge Gate API returns PASS / WARN / FAIL on Change Passports; Remedy fixes with proof. Critique Intake feeds the loop from production bug reports.',
        status: 'shipping',
        repo: {
          label: 'repath500/critique',
          href: 'https://github.com/repath500',
          visibility: 'private',
        },
        live: { label: 'critique.sh · v6.6', href: 'https://critique.sh' },
        stack: ['typescript', 'next.js', 'prisma', 'inngest', 'e2b', 'opencode'],
      },
      {
        id: 'critique-community',
        name: 'critique-community',
        tagline: 'self-hosted community edition for automated GitHub PR reviews',
        architecture:
          'community deploy path aligned with the June 2026 OSS launch — self-hosted GitHub PR review without the hosted control plane. same sandbox-first review loop, separate public repo from the private monorepo.',
        status: 'live',
        repo: {
          label: 'repath500/critique-community',
          href: 'https://github.com/repath500/critique-community',
          visibility: 'public',
        },
        live: {
          label: 'OSS essay',
          href: 'https://www.critique.sh/blog/critique-going-open-source',
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
    id: 'critique-v66-current',
    layerId: 'critique',
    projectId: 'critique-core',
    at: '2026-06-29',
    status: 'shipping',
    note: 'v6.6 live — Merge Gate + Intake + Agent Workspace + OpenCode review as one change-control spine on critique.sh',
  },
  {
    id: 'critique-coding-agent-api',
    layerId: 'critique',
    projectId: 'critique-core',
    at: '2026-06-24',
    status: 'shipping',
    note: 'Coding Agent API lifecycle contract — tags, metadata, nextActions, OpenAPI for CI repair and supervisor loops (Repath essay)',
  },
  {
    id: 'critique-intake-ship',
    layerId: 'critique',
    projectId: 'critique-core',
    at: '2026-06-23',
    status: 'live',
    note: 'Critique Intake v6.2 — embeddable widget, deterministic triage, handoff into Review runs and Change Passports',
  },
  {
    id: 'critique-oss-community',
    layerId: 'critique',
    projectId: 'critique-community',
    at: '2026-06-23',
    status: 'live',
    note: 'community edition going open source — self-hosted PR review in repath500/critique-community',
  },
  {
    id: 'critique-v611-merge-gate',
    layerId: 'critique',
    projectId: 'critique-core',
    at: '2026-06-17',
    status: 'live',
    note: 'v6.1.1 upstreamSignals — RWX, Swytchcode, Iron Book attestation on Merge Gate API',
  },
  {
    id: 'critique-review-skill',
    layerId: 'critique',
    projectId: 'critique-review',
    at: '2026-06-02',
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
