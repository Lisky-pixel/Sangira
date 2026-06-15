import { placeholderLandingStats } from '../../placeholder/landing-stats'
import { LANDING_SECTION_IDS } from '../../routes/paths'

export function StatsSection() {
  return (
    <section
      className="bg-mint-band py-12 sm:py-14"
      id={LANDING_SECTION_IDS.IMPACT}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {placeholderLandingStats.map((stat) => (
            <article
              key={stat.label}
              className="bg-mint-card flex flex-col items-center gap-2 rounded-xl px-6 py-8 text-center"
            >
              <p className="text-stat font-display text-4xl font-bold sm:text-5xl">
                {stat.value}
              </p>
              <p className="text-body text-xs font-medium tracking-[0.15em] uppercase">
                {stat.label}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
