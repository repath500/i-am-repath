import { identity, mainWorks, moreFromLab } from './ecosystem'
import NowLine from './NowLine'
import { navigate } from './router'

const projects = [...mainWorks, ...moreFromLab]

function BuildingPreview() {
  return (
    <section
      className="mx-auto w-full max-w-[1400px] border-t border-white/10 px-4 pt-6 sm:px-6 md:px-10"
      aria-label="what repath is building"
    >
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-stoke text-[0.58rem] lowercase tracking-[0.22em] text-stone-600">
              repath is building
              <span className="text-white/15 px-2" aria-hidden="true">
                ·
              </span>
              <span className="tracking-[0.16em]">{identity.location}</span>
            </p>
            <ul className="mt-3 flex flex-wrap items-start gap-x-1 gap-y-3">
              {projects.map((work, index) => (
                <li key={work.id} className="group relative flex items-start gap-1">
                  {index > 0 ? (
                    <span className="px-1 pt-0.5 text-white/10" aria-hidden="true">
                      ·
                    </span>
                  ) : null}
                  <div className="flex flex-col">
                    <a
                      href={work.href}
                      target="_blank"
                      rel="noreferrer"
                      title={work.origin}
                      className="inline-flex items-center gap-2 font-stoke text-[0.72rem] lowercase tracking-[0.04em] text-stone-500 transition duration-300 hover:text-stone-200"
                    >
                      <img
                        src={work.icon}
                        alt=""
                        width={14}
                        height={14}
                        className="rounded-[2px] opacity-70"
                        loading="lazy"
                        decoding="async"
                      />
                      {work.name}
                    </a>
                    <span className="mt-1 hidden max-w-[28ch] font-crimson text-[0.72rem] italic leading-[1.4] text-stone-600 group-hover:block md:group-hover:block">
                      {work.origin}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <a
            href="/working-on"
            onClick={(event) => {
              event.preventDefault()
              navigate('/working-on')
            }}
            className="shrink-0 font-stoke text-[0.62rem] lowercase tracking-[0.14em] text-stone-600 transition duration-300 hover:text-stone-300"
          >
            see the full picture →
          </a>
        </div>
        <NowLine />
      </div>
    </section>
  )
}

export default BuildingPreview
