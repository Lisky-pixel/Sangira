import { landingStatLabels, landingStatsContent } from '../../placeholder/landing-stats'
import { LANDING_SECTION_IDS } from '../../routes/paths'
import { usePublicPlatformStats } from '../../hooks/use-public-platform-stats'
import { formatLandingStatValue } from '../../lib/format-landing-stat'

type StatCardProps = {
  label: string
  value: string | null
  isLoading: boolean
}

function StatValueSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="bg-sand mx-auto h-12 w-28 animate-pulse rounded-lg sm:h-14 sm:w-32"
    />
  )
}

function StatCard({ label, value, isLoading }: StatCardProps) {
  return (
    <article className="bg-mint-card flex flex-col items-center gap-2 rounded-xl px-6 py-8 text-center">
      {isLoading ? (
        <StatValueSkeleton />
      ) : (
        <p className="text-stat font-display text-4xl font-bold sm:text-5xl">
          {value ?? landingStatsContent.unavailableValue}
        </p>
      )}
      <p className="text-body text-xs font-medium tracking-[0.15em] uppercase">
        {label}
      </p>
    </article>
  )
}

export function StatsSection() {
  const { loadState, stats } = usePublicPlatformStats()
  const isLoading = loadState === 'loading'

  const cards = [
    {
      key: 'meals',
      label: landingStatLabels.mealsRedistributed,
      value:
        loadState === 'ready' && stats
          ? formatLandingStatValue(stats.mealsRedistributed)
          : loadState === 'error'
            ? null
            : null,
    },
    {
      key: 'waste',
      label: landingStatLabels.wastePreventedKg,
      value:
        loadState === 'ready' && stats
          ? formatLandingStatValue(stats.wastePreventedKg)
          : loadState === 'error'
            ? null
            : null,
    },
    {
      key: 'orgs',
      label: landingStatLabels.verifiedOrganisations,
      value:
        loadState === 'ready' && stats
          ? formatLandingStatValue(stats.verifiedOrganisations)
          : loadState === 'error'
            ? null
            : null,
    },
  ] as const

  return (
    <section
      className="bg-mint-band py-12 sm:py-14"
      id={LANDING_SECTION_IDS.IMPACT}
      aria-busy={isLoading}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {cards.map((stat) => (
            <StatCard
              key={stat.key}
              label={stat.label}
              value={stat.value}
              isLoading={isLoading}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
