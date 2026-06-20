import { ChevronRight } from 'lucide-react'
import { Link } from 'react-router'
import { ADMIN_FLAGS_LIMIT } from '../../constants/admin-overview'
import { adminOverviewContent } from '../../placeholder/admin-overview-content'
import type { AdminOverviewFlag } from '../../types/admin-overview'

type AdminOverviewFlagsPanelProps = {
  flags: AdminOverviewFlag[]
}

export function AdminOverviewFlagsPanel({ flags }: AdminOverviewFlagsPanelProps) {
  const visibleFlags = flags.slice(0, ADMIN_FLAGS_LIMIT)

  return (
    <section className="border-border rounded-2xl border bg-white shadow-sm">
      <header className="border-border border-b px-5 py-4 sm:px-6">
        <h2 className="text-charcoal font-display text-lg font-bold">
          {adminOverviewContent.flags.title}
        </h2>
      </header>

      {visibleFlags.length === 0 ? (
        <p className="text-body px-5 py-6 text-sm sm:px-6">
          {adminOverviewContent.flags.empty}
        </p>
      ) : (
        <ul className="divide-border divide-y px-5 sm:px-6">
          {visibleFlags.map((flag) => (
            <li key={flag.type} className="py-4">
              <p className="text-charcoal text-sm font-semibold">{flag.title}</p>
              <p className="text-body mt-1 text-sm">{flag.detail}</p>
              <Link
                to={flag.reviewPath}
                className="text-primary mt-2 inline-flex items-center gap-1 text-sm font-medium hover:underline"
              >
                {adminOverviewContent.flags.review}
                <ChevronRight aria-hidden="true" className="size-4" />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
