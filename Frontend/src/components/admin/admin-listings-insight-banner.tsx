import { BarChart3 } from 'lucide-react'
import { Link } from 'react-router'
import { adminListingsContent } from '../../placeholder/admin-listings-content'

type AdminListingsInsightBannerProps = {
  count: number
}

export function AdminListingsInsightBanner({
  count,
}: AdminListingsInsightBannerProps) {
  if (count <= 0) {
    return null
  }

  const { insightBanner, reportsPath } = adminListingsContent

  return (
    <div className="bg-status-pending-bg flex flex-col gap-4 rounded-2xl border border-status-pending-dot/20 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
      <div className="flex items-start gap-3">
        <span className="bg-status-pending-bg text-status-pending-text flex size-9 shrink-0 items-center justify-center rounded-full border border-status-pending-dot/30">
          <BarChart3 aria-hidden="true" className="size-4" />
        </span>
        <div className="min-w-0">
          <p className="text-charcoal text-sm font-semibold">
            {insightBanner.title(count)}
          </p>
          <p className="text-body mt-1 text-sm">{insightBanner.subcopy}</p>
        </div>
      </div>
      <Link
        to={reportsPath}
        className="text-primary shrink-0 text-sm font-medium hover:underline"
        aria-label={insightBanner.viewReportAria}
      >
        {insightBanner.viewReport} →
      </Link>
    </div>
  )
}
