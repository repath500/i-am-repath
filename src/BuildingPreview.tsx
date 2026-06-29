import { mainWorks, moreFromLab } from './ecosystem'
import { navigate } from './router'

const projects = [...mainWorks, ...moreFromLab]

function BuildingPreview() {
  return (
    <section
      className="mx-auto w-full max-w-[1400px] border-t border-white/10 px-4 pt-6 sm:px-6 md:px-10"
      aria-label="what repath is building"
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-stoke text-[0.58rem] lowercase tracking-[0.22em] text-stone-600">
            repath is building
          </p>
          <ul className="mt-3 flex flex-wrap items-center gap-x-1 gap-y-2">
            {projects.map((work, index) => (
              <li key={work.id} className="flex items-center gap-1">
                {index > 0 ? (
                  <span className="px-1 text-white/10" aria-hidden="true">
                    ·
                  </span>
                ) : null}
                <a
                  href={work.href}
                  target="_blank"
                  rel="noreferrer"
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
    </section>
  )
}

export default BuildingPreview
