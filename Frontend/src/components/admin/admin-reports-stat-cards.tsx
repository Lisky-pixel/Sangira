import { adminReportsContent } from '../../placeholder/admin-reports-content'
import type { AdminReportsStats } from '../../types/admin-reports'

const STAT_VALUE_CLASS = 'text-stat font-display mt-2 text-3xl font-bold sm:text-4xl'
const STAT_CONTEXT_CLASS = 'text-stat font-medium'

type AdminReportsStatCardsProps = {
  stats: AdminReportsStats
}

function StatCard({
  label,
  value,
  subline,
}: {
  label: string
  value: string
  subline?: string | null
}) {
  return (
    <article className="border-border rounded-2xl border bg-white p-5 shadow-sm sm:p-6">
      <p className="text-body text-sm">{label}</p>
      <p className={STAT_VALUE_CLASS}>{value}</p>
      {subline ? (
        <p className={`mt-2 text-sm ${STAT_CONTEXT_CLASS}`}>{subline}</p>
      ) : null}
    </article>
  )
}

function monthOverMonthCopy(percent: number | null): string | null {
  const { stats } = adminReportsContent

  if (percent === null) {
    return null
  }

  if (percent > 0) {
    return stats.mealsRedistributed.monthOverMonthUp(percent)
  }

  if (percent < 0) {
    return stats.mealsRedistributed.monthOverMonthDown(percent)
  }

  return stats.mealsRedistributed.monthOverMonthFlat
}

export function AdminReportsStatCards({ stats }: AdminReportsStatCardsProps) {
  const matchTimeValue =
    stats.averageMatchTimeMinutes === null
      ? adminReportsContent.stats.averageMatchTime.emptyValue
      : adminReportsContent.stats.averageMatchTime.value(
          stats.averageMatchTimeMinutes,
        )

  const matchTimeSubline =
    stats.averageMatchTimeMinutes === null
      ? adminReportsContent.stats.averageMatchTime.noRecentMatches
      : adminReportsContent.stats.averageMatchTime.caption(
          stats.averageMatchTimeRollingDays,
        )

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        label={adminReportsContent.stats.mealsRedistributed.label}
        value={stats.mealsRedistributed.total.toLocaleString()}
        subline={monthOverMonthCopy(
          stats.mealsRedistributed.monthOverMonthChangePercent,
        )}
      />

      <StatCard
        label={adminReportsContent.stats.wastePrevented.label}
        value={adminReportsContent.stats.wastePrevented.value(
          stats.wastePreventedKg,
        )}
      />

      <StatCard
        label={adminReportsContent.stats.completedTransfers.label}
        value={stats.completedTransfers.toLocaleString()}
      />

      <StatCard
        label={adminReportsContent.stats.averageMatchTime.label}
        value={matchTimeValue}
        subline={matchTimeSubline}
      />
    </div>
  )
}
