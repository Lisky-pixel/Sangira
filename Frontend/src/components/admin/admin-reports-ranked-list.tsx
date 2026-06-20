import { adminReportsContent } from '../../placeholder/admin-reports-content'
import { VerifiedBadge } from '../ui/verified-badge'
import type { AdminReportsRankedOrganisation } from '../../types/admin-reports'

type AdminReportsRankedListProps = {
  variant: 'donors' | 'ngos'
  items: AdminReportsRankedOrganisation[]
  rankOffset: number
}

export function AdminReportsRankedList({
  variant,
  items,
  rankOffset,
}: AdminReportsRankedListProps) {
  const copy =
    variant === 'donors'
      ? adminReportsContent.lists.topDonors
      : adminReportsContent.lists.mostServedNgos

  return (
    <ul className="divide-border divide-y">
      {items.map((item, index) => {
        const count =
          variant === 'donors' ? (item.transfers ?? 0) : (item.pickups ?? 0)
        const rank = rankOffset + index + 1

        return (
          <li
            key={`${variant}-${rank}-${item.organisationName}`}
            className="flex items-center justify-between gap-3 py-4 first:pt-0 last:pb-0"
          >
            <div className="flex min-w-0 items-center gap-3">
              <span
                aria-hidden="true"
                className="text-body w-6 shrink-0 text-center text-sm font-medium tabular-nums"
              >
                {rank}
              </span>
              <div className="flex min-w-0 items-center gap-2">
                <span className="text-charcoal truncate text-sm font-medium">
                  {item.organisationName}
                </span>
                {item.verified ? <VerifiedBadge /> : null}
              </div>
            </div>
            <span
              className={
                variant === 'donors'
                  ? 'bg-status-verified-bg text-status-verified-text shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium tabular-nums'
                  : 'bg-verified/10 text-verified shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium tabular-nums'
              }
            >
              {copy.count(count)}
            </span>
          </li>
        )
      })}
    </ul>
  )
}
