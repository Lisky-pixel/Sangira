import type { AdminOverviewStats } from '../../types/admin-overview'
import { adminOverviewContent } from '../../placeholder/admin-overview-content'

type AdminOverviewStatCardsProps = {
  stats: AdminOverviewStats
}

function StatCard({
  label,
  value,
  subline,
  sublineClassName,
}: {
  label: string
  value: number
  subline?: string | null
  sublineClassName?: string
}) {
  return (
    <article className="border-border rounded-2xl border bg-white p-5 shadow-sm sm:p-6">
      <p className="text-body text-sm">{label}</p>
      <p className="text-charcoal font-display mt-2 text-3xl font-bold sm:text-4xl">
        {value}
      </p>
      {subline ? (
        <p className={`mt-2 text-sm ${sublineClassName ?? 'text-body'}`}>
          {subline}
        </p>
      ) : null}
    </article>
  )
}

function transferDeltaCopy(delta: number): {
  text: string
  className: string
} {
  if (delta > 0) {
    return {
      text: adminOverviewContent.stats.transfersThisWeek.deltaUp(delta),
      className: 'text-verified font-medium',
    }
  }

  if (delta < 0) {
    return {
      text: adminOverviewContent.stats.transfersThisWeek.deltaDown(delta),
      className: 'text-clay-red font-medium',
    }
  }

  return {
    text: adminOverviewContent.stats.transfersThisWeek.deltaFlat,
    className: 'text-body font-medium',
  }
}

export function AdminOverviewStatCards({ stats }: AdminOverviewStatCardsProps) {
  const transferDelta = transferDeltaCopy(stats.transfersLastWeekDelta)

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        label={adminOverviewContent.stats.pendingVerifications.label}
        value={stats.pendingVerifications}
        subline={
          stats.pendingOverSlaHours > 0
            ? adminOverviewContent.stats.pendingVerifications.urgent(
                stats.pendingOverSlaHours,
                stats.verificationSlaTargetHours,
              )
            : null
        }
        sublineClassName="text-status-pending-text font-medium"
      />

      <StatCard
        label={adminOverviewContent.stats.activeListings.label}
        value={stats.activeListings}
      />

      <StatCard
        label={adminOverviewContent.stats.transfersThisWeek.label}
        value={stats.transfersThisWeek}
        subline={transferDelta.text}
        sublineClassName={transferDelta.className}
      />

      <StatCard
        label={adminOverviewContent.stats.registeredOrganisations.label}
        value={stats.registeredOrganisations}
        subline={adminOverviewContent.stats.registeredOrganisations.breakdown(
          stats.registeredBreakdown.donors,
          stats.registeredBreakdown.ngos,
        )}
      />
    </div>
  )
}
