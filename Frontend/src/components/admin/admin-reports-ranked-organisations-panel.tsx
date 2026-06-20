import { Link } from 'react-router'
import { ROUTES } from '../../routes/paths'
import { adminReportsContent } from '../../placeholder/admin-reports-content'
import type { AdminReportsRankedOrganisation } from '../../types/admin-reports'
import { VerifiedBadge } from '../ui/verified-badge'

type AdminReportsRankedOrganisationsPanelProps = {
  variant: 'donors' | 'ngos'
  items: AdminReportsRankedOrganisation[]
}

export function AdminReportsRankedOrganisationsPanel({
  variant,
  items,
}: AdminReportsRankedOrganisationsPanelProps) {
  const copy =
    variant === 'donors'
      ? adminReportsContent.lists.topDonors
      : adminReportsContent.lists.mostServedNgos

  const viewAllTo =
    variant === 'donors' ? ROUTES.ADMIN_REPORTS_DONORS : ROUTES.ADMIN_REPORTS_NGOS

  return (
    <article className="border-border flex flex-col rounded-2xl border bg-white shadow-sm">
      <header className="bg-sand/80 border-border border-b px-5 py-4 sm:px-6">
        <h2 className="text-charcoal font-display text-lg font-bold">
          {copy.title}
        </h2>
      </header>

      {items.length === 0 ? (
        <p className="text-body px-5 py-8 text-center text-sm sm:px-6">
          {copy.empty}
        </p>
      ) : (
        <ul className="divide-border divide-y">
          {items.map((item, index) => {
            const count =
              variant === 'donors' ? (item.transfers ?? 0) : (item.pickups ?? 0)

            return (
              <li
                key={`${variant}-${index}`}
                className="flex items-center justify-between gap-3 px-5 py-4 sm:px-6"
              >
                <div className="flex min-w-0 items-center gap-2">
                  <span className="text-charcoal truncate text-sm font-medium">
                    {item.organisationName}
                  </span>
                  {item.verified ? <VerifiedBadge /> : null}
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
      )}

      <footer className="border-border border-t px-5 py-4 sm:px-6">
        <Link
          to={viewAllTo}
          aria-label={copy.viewAllAria}
          className="text-primary text-sm font-medium hover:underline"
        >
          {copy.viewAll}
        </Link>
      </footer>
    </article>
  )
}
