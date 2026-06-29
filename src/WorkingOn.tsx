import { useEffect, useMemo, useState } from 'react'
import {
  critiqueBlogPosts,
  critiqueCurrentVersion,
  critiqueShipLog,
  ecosystemLayers,
  founderContext,
  pipelineLog,
  statusLabel,
  type CritiqueBlogPost,
  type CritiqueShipRelease,
  type EcosystemLayer,
  type EcosystemProject,
  type PipelineStatus,
} from './ecosystem'
import MusicMute from './MusicMute'
import PresenceWhisper from './PresenceWhisper'
import { navigate } from './router'
import { updateWorkingOnMeta } from './share'
import { useMusicMuted } from './useMusicMuted'

const statusTone: Record<PipelineStatus, string> = {
  shipping: 'border-emerald-400/25 text-emerald-300/90',
  live: 'border-sky-400/25 text-sky-300/90',
  active: 'border-amber-400/25 text-amber-300/90',
  research: 'border-violet-400/25 text-violet-300/90',
  experimental: 'border-fuchsia-400/25 text-fuchsia-300/90',
  private: 'border-stone-500/30 text-stone-400',
}

function StatusBadge({ status }: { status: PipelineStatus }) {
  return (
    <span
      className={`inline-flex border px-2 py-0.5 font-stoke text-[0.52rem] lowercase tracking-[0.16em] ${statusTone[status]}`}
    >
      {statusLabel[status]}
    </span>
  )
}

function ProjectCard({ project }: { project: EcosystemProject }) {
  return (
    <article className="note-row border border-white/10 bg-white/[0.02] p-5 md:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <h3 className="font-stoke text-lg lowercase tracking-[0.02em] text-stone-100 md:text-xl">
          {project.name}
        </h3>
        <StatusBadge status={project.status} />
      </div>

      <p className="mt-3 font-crimson text-[1.05rem] leading-[1.45] text-stone-400">
        {project.tagline}
      </p>

      <p className="mt-4 font-crimson text-[0.98rem] leading-[1.55] text-stone-500">
        {project.architecture}
      </p>

      {(project.stack?.length ?? 0) > 0 && (
        <ul className="mt-5 flex flex-wrap gap-2">
          {project.stack!.map((item) => (
            <li
              key={item}
              className="border border-white/8 px-2 py-1 font-stoke text-[0.5rem] lowercase tracking-[0.14em] text-stone-600"
            >
              {item}
            </li>
          ))}
        </ul>
      )}

      <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2 font-stoke text-[0.58rem] lowercase tracking-[0.14em]">
        {project.repo && (
          <a
            href={project.repo.href}
            target="_blank"
            rel="noreferrer"
            className="text-stone-500 transition hover:text-stone-200"
          >
            {project.repo.label}
            {project.repo.visibility === 'private' ? ' · private' : ''}
          </a>
        )}
        {project.live && (
          <a
            href={project.live.href}
            target="_blank"
            rel="noreferrer"
            className="text-stone-400 transition hover:text-stone-100"
          >
            {project.live.label} ↗
          </a>
        )}
      </div>
    </article>
  )
}

function CritiqueShipCard({ release }: { release: CritiqueShipRelease }) {
  return (
    <article
      className={`note-row border p-5 md:p-6 ${
        release.current
          ? 'border-emerald-400/20 bg-emerald-400/[0.03]'
          : 'border-white/10 bg-white/[0.02]'
      }`}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-stoke text-[0.58rem] lowercase tabular-nums tracking-[0.16em] text-stone-600">
            {release.date}
          </p>
          <h3 className="mt-1 font-stoke text-lg lowercase tracking-[0.02em] text-stone-100">
            {release.version}
            {release.current ? (
              <span className="ml-2 text-emerald-300/80">· current</span>
            ) : null}
          </h3>
        </div>
        {release.current ? <StatusBadge status="shipping" /> : null}
      </div>

      <p className="mt-3 font-crimson text-[1.02rem] leading-[1.45] text-stone-400">
        {release.title}
      </p>

      <ul className="mt-4 space-y-2">
        {release.highlights.map((item) => (
          <li
            key={item}
            className="flex gap-3 font-crimson text-[0.95rem] leading-[1.5] text-stone-500"
          >
            <span className="text-stone-700" aria-hidden="true">
              ·
            </span>
            <span>{item}</span>
          </li>
        ))}
      </ul>

      {release.essay && (
        <a
          href={release.essay.href}
          target="_blank"
          rel="noreferrer"
          className="mt-5 inline-block font-stoke text-[0.58rem] lowercase tracking-[0.14em] text-stone-500 transition hover:text-stone-200"
        >
          {release.essay.label} ↗
        </a>
      )}
    </article>
  )
}

function CritiqueBlogCard({ post }: { post: CritiqueBlogPost }) {
  return (
    <article className="note-row border-b border-white/8 py-5 last:border-b-0">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-stoke text-[0.52rem] lowercase tracking-[0.16em] text-stone-600">
        <span className="tabular-nums">{post.date}</span>
        <span className="text-white/15" aria-hidden="true">
          ·
        </span>
        <span>{post.category}</span>
        {post.author && (
          <>
            <span className="text-white/15" aria-hidden="true">
              ·
            </span>
            <span>{post.author}</span>
          </>
        )}
      </div>
      <a
        href={post.href}
        target="_blank"
        rel="noreferrer"
        className="mt-2 block font-stoke text-[1rem] lowercase leading-snug text-stone-200 transition hover:text-stone-50 md:text-[1.05rem]"
      >
        {post.title}
      </a>
      <p className="mt-2 font-crimson text-[0.96rem] leading-[1.52] text-stone-500">
        {post.summary}
      </p>
    </article>
  )
}

function LayerSection({ layer, index }: { layer: EcosystemLayer; index: number }) {
  return (
    <section
      className="note-row border-t border-white/10 pt-12 md:pt-16"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <div className="grid gap-8 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] md:gap-12">
        <div>
          <p className="font-stoke text-[0.62rem] lowercase tracking-[0.24em] text-stone-600">
            layer {String(index + 1).padStart(2, '0')}
          </p>
          <h2 className="mt-3 font-stoke text-[clamp(1.8rem,5vw,2.8rem)] font-light lowercase leading-none text-stone-100">
            {layer.title}
          </h2>
          <p className="mt-5 max-w-[42ch] font-crimson text-lg italic leading-[1.5] text-stone-500">
            {layer.mission}
          </p>
          <ul className="mt-6 flex flex-wrap gap-2">
            {layer.stack.map((item) => (
              <li
                key={item}
                className="border border-white/10 px-2.5 py-1 font-stoke text-[0.52rem] lowercase tracking-[0.16em] text-stone-500"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-4">
          {layer.projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </section>
  )
}

function WorkingOn() {
  const [now, setNow] = useState(() => new Date())
  const { musicMuted, toggleMusicMuted } = useMusicMuted()

  const sortedLog = useMemo(
    () => [...pipelineLog].sort((a, b) => b.at.localeCompare(a.at)),
    [],
  )

  const projectLookup = useMemo(() => {
    const map = new Map<string, { layer: string; project: string }>()
    for (const layer of ecosystemLayers) {
      for (const project of layer.projects) {
        map.set(`${layer.id}:${project.id}`, {
          layer: layer.title,
          project: project.name,
        })
      }
    }
    return map
  }, [])

  useEffect(() => {
    updateWorkingOnMeta()
  }, [])

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000)
    return () => window.clearInterval(timer)
  }, [])

  const clock = now
    .toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    })
    .toLowerCase()

  return (
    <main className="relative min-h-[100dvh] overflow-x-hidden bg-[#050505] text-stone-100">
      <PresenceWhisper />
      <div className="pointer-events-none fixed inset-0 grain opacity-[0.13]" />

      <div className="relative mx-auto w-full max-w-[980px] px-5 py-12 sm:px-6 md:py-20">
        <div className="flex items-start justify-between gap-4">
          <a
            href="/"
            onClick={(event) => {
              event.preventDefault()
              navigate('/')
            }}
            className="inline-flex items-center gap-2 font-stoke text-[0.7rem] lowercase tracking-[0.18em] text-stone-500 transition duration-300 hover:text-stone-100"
          >
            <span aria-hidden="true">&larr;</span>
            repath
          </a>
          <span
            className="font-stoke text-[0.58rem] lowercase tabular-nums tracking-[0.18em] text-stone-600"
            aria-label="local time"
          >
            {clock}
          </span>
        </div>

        <header className="mt-12 md:mt-16">
          <p className="font-stoke text-[0.62rem] lowercase tracking-[0.24em] text-stone-600">
            repath500 · systems map
          </p>
          <h1 className="mt-4 font-stoke text-[clamp(2.2rem,8vw,4.6rem)] font-light lowercase leading-[0.95] tracking-[-0.01em] text-stone-100">
            what i&apos;m working on
          </h1>
          <p className="mt-6 max-w-[58ch] font-crimson text-lg leading-[1.55] text-stone-500 md:text-xl">
            one ecosystem, four layers — critique at{' '}
            <span className="text-stone-400">{critiqueCurrentVersion}</span> for
            merge-boundary change control, leemer for frontier models, civic data
            for compliance posture, and smaller playgrounds where interaction
            design meets infrastructure.
          </p>
        </header>

        <section className="note-row mt-14 border border-emerald-400/15 bg-emerald-400/[0.03] p-5 md:p-7">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="font-stoke text-[0.62rem] lowercase tracking-[0.22em] text-stone-600">
                flagship · critique.sh
              </p>
              <h2 className="mt-3 font-stoke text-[clamp(1.8rem,5vw,3rem)] font-light lowercase leading-none text-stone-100">
                {critiqueCurrentVersion} ship line
              </h2>
            </div>
            <a
              href="https://www.critique.sh/version"
              target="_blank"
              rel="noreferrer"
              className="font-stoke text-[0.58rem] lowercase tracking-[0.14em] text-stone-500 transition hover:text-stone-200"
            >
              ship log ↗
            </a>
          </div>
          <p className="mt-5 max-w-[62ch] font-crimson text-[1.02rem] leading-[1.55] text-stone-500">
            AI change control at the GitHub merge boundary — not a comment bot.
            Checkpoint gates slop, OpenCode sandboxes run specialist review,
            Merge Gate API judges PASS / WARN / FAIL, Change Passports store
            evidence, and Critique Intake feeds production bugs into the same
            loop.
          </p>
          <div className="mt-8 space-y-4">
            {critiqueShipLog.slice(0, 4).map((release) => (
              <CritiqueShipCard key={release.version} release={release} />
            ))}
          </div>
        </section>

        <section className="note-row mt-12 border border-white/10 p-5 md:p-7">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="font-stoke text-[0.62rem] lowercase tracking-[0.22em] text-stone-600">
                from critique.sh/blog
              </p>
              <h2 className="mt-3 font-stoke text-[clamp(1.5rem,4vw,2.2rem)] font-light lowercase text-stone-100">
                latest essays &amp; product notes
              </h2>
            </div>
            <a
              href="https://www.critique.sh/blog"
              target="_blank"
              rel="noreferrer"
              className="font-stoke text-[0.58rem] lowercase tracking-[0.14em] text-stone-500 transition hover:text-stone-200"
            >
              all posts ↗
            </a>
          </div>
          <div className="mt-6 border-t border-white/10">
            {critiqueBlogPosts.map((post) => (
              <CritiqueBlogCard key={post.slug} post={post} />
            ))}
          </div>
        </section>

        <section className="note-row mt-14 border border-white/10 bg-white/[0.02] p-5 md:p-7">
          <p className="font-stoke text-[0.62rem] lowercase tracking-[0.22em] text-stone-600">
            spine
          </p>
          <div className="mt-5 space-y-3 font-crimson text-[1rem] leading-[1.6] text-stone-400 md:text-[1.05rem]">
            <p>
              <span className="text-stone-300">critique {critiqueCurrentVersion}</span>{' '}
              — writer → judge → merge: sandboxes, Merge Gate API, Intake, and
              Change Passports at the merge boundary.
            </p>
            <p>
              <span className="text-stone-300">leemerchat + superlm</span>{' '}
              route frontier models with live parity and entitlements.
            </p>
            <p>
              <span className="text-stone-300">daildex + ai-regulation-ie</span>{' '}
              anchor Irish civic data and EU compliance flows.
            </p>
            <p>
              <span className="text-stone-300">playgrounds</span> (this site,
              builder, council) test rituals, tenancy, and multi-agent
              coordination that feed the production stack.
            </p>
          </div>
        </section>

        <section className="note-row mt-12 border border-white/10 p-5 md:p-7">
          <p className="font-stoke text-[0.62rem] lowercase tracking-[0.22em] text-stone-600">
            founder context
          </p>
          <div className="mt-4 grid gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            <div>
              <p className="font-stoke text-sm lowercase text-stone-200">
                {founderContext.name}
              </p>
              <p className="mt-1 font-stoke text-[0.58rem] lowercase tracking-[0.16em] text-stone-600">
                {founderContext.role} · @{founderContext.handle}
              </p>
              <p className="mt-4 font-crimson text-[1.02rem] leading-[1.55] text-stone-500">
                {founderContext.bio}
              </p>
            </div>
            <div>
              <ul className="space-y-3 font-crimson text-[0.98rem] leading-[1.55] text-stone-500">
                {founderContext.access.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="text-stone-700" aria-hidden="true">
                      ·
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-5 font-crimson text-[0.98rem] italic leading-[1.55] text-stone-600">
                {founderContext.thesis}
              </p>
            </div>
          </div>
        </section>

        {ecosystemLayers.map((layer, index) => (
          <LayerSection key={layer.id} layer={layer} index={index} />
        ))}

        <section className="note-row mt-16 border-t border-white/10 pt-12 md:pt-16">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="font-stoke text-[0.62rem] lowercase tracking-[0.24em] text-stone-600">
                pipeline log
              </p>
              <h2 className="mt-3 font-stoke text-[clamp(1.6rem,4vw,2.4rem)] font-light lowercase text-stone-100">
                recent status
              </h2>
            </div>
            <p className="max-w-[36ch] font-crimson text-sm italic text-stone-600">
              every entry maps to a live repo, deploy, or research thread — not
              roadmap fiction.
            </p>
          </div>

          <ol className="mt-8 space-y-0 border-t border-white/10">
            {sortedLog.map((entry) => {
              const lookup = projectLookup.get(`${entry.layerId}:${entry.projectId}`)
              return (
                <li
                  key={entry.id}
                  className="grid gap-3 border-b border-white/8 py-5 md:grid-cols-[7rem_minmax(0,1fr)_auto]"
                >
                  <span className="font-stoke text-[0.58rem] lowercase tabular-nums tracking-[0.14em] text-stone-600">
                    {entry.at}
                  </span>
                  <div>
                    <p className="font-stoke text-[0.72rem] lowercase tracking-[0.06em] text-stone-300">
                      {lookup?.project ?? entry.projectId}
                      <span className="text-stone-700"> · </span>
                      <span className="text-stone-600">{lookup?.layer}</span>
                    </p>
                    <p className="mt-1 font-crimson text-[0.98rem] leading-[1.5] text-stone-500">
                      {entry.note}
                    </p>
                  </div>
                  <div className="md:justify-self-end">
                    <StatusBadge status={entry.status} />
                  </div>
                </li>
              )
            })}
          </ol>
        </section>

        <footer className="mt-16 flex flex-col gap-5 border-t border-white/10 pt-6 font-stoke text-[0.68rem] lowercase tracking-[0.14em] text-stone-500 md:flex-row md:items-center md:justify-between">
          <nav className="flex flex-wrap items-center gap-2">
            <a
              href="/"
              onClick={(event) => {
                event.preventDefault()
                navigate('/')
              }}
              className="transition hover:text-stone-100"
            >
              home
            </a>
            <span className="text-white/15" aria-hidden="true">
              |
            </span>
            <a
              href="/notes"
              onClick={(event) => {
                event.preventDefault()
                navigate('/notes')
              }}
              className="transition hover:text-stone-100"
            >
              notes
            </a>
            <span className="text-white/15" aria-hidden="true">
              |
            </span>
            <a
              href="/letter"
              onClick={(event) => {
                event.preventDefault()
                navigate('/letter')
              }}
              className="transition hover:text-stone-100"
            >
              letter
            </a>
            <span className="text-white/15" aria-hidden="true">
              |
            </span>
            <a
              href="https://www.linkedin.com/in/repathkhan/"
              target="_blank"
              rel="noreferrer"
              className="transition hover:text-stone-100"
            >
              linkedin
            </a>
          </nav>
          <div className="flex items-center gap-4">
            <MusicMute muted={musicMuted} onToggle={toggleMusicMuted} />
            <span>© {founderContext.name}</span>
          </div>
        </footer>
      </div>
    </main>
  )
}

export default WorkingOn
