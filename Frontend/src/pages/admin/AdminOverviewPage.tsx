import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import {
  AdminOverviewActivityFeed,
  AdminOverviewFlagsPanel,
  AdminOverviewStatCards,
} from '../../components/admin'
import { ADMIN_RECENT_ACTIVITY_LIMIT } from '../../constants/admin-overview'
import { adminOverviewContent } from '../../placeholder/admin-overview-content'
import { adminPortalService } from '../../services/admin-portal-service'
import type { AdminOverviewData } from '../../types/admin-overview'

function formatOverviewDate(now = new Date()): string {
  return now.toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

export function AdminOverviewPage() {
  const [overview, setOverview] = useState<AdminOverviewData | null>(null)
  const [loadState, setLoadState] = useState<'loading' | 'ready' | 'error'>(
    'loading',
  )

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoadState('loading')
      try {
        const data = await adminPortalService.getOverview()
        if (!cancelled) {
          setOverview(data)
          setLoadState('ready')
        }
      } catch {
        if (!cancelled) {
          setOverview(null)
          setLoadState('error')
        }
      }
    }

    void load()

    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-charcoal font-display text-2xl font-bold sm:text-3xl">
            {adminOverviewContent.pageTitle}
          </h1>
          <p className="text-body mt-2 text-sm">
            {adminOverviewContent.pageSubtitle}
          </p>
        </div>
        <p className="bg-sand text-body rounded-full px-4 py-2 text-sm font-medium">
          {formatOverviewDate()}
        </p>
      </header>

      {loadState === 'loading' ? (
        <p className="text-body text-sm">{adminOverviewContent.loading}</p>
      ) : loadState === 'error' || !overview ? (
        <p className="text-clay-red text-sm">{adminOverviewContent.loadError}</p>
      ) : (
        <>
          <AdminOverviewStatCards stats={overview.stats} />

          <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(16rem,1fr)]">
            <section className="border-border overflow-hidden rounded-2xl border bg-white shadow-sm">
              <header className="bg-sand/80 border-border flex items-center justify-between gap-3 border-b px-5 py-4 sm:px-6">
                <h2 className="text-charcoal font-display text-lg font-bold">
                  {adminOverviewContent.activity.title}
                </h2>
                <Link
                  to={adminOverviewContent.routes.viewAllActivity}
                  className="text-primary text-sm font-medium hover:underline"
                >
                  {adminOverviewContent.activity.viewAll}
                </Link>
              </header>
              <AdminOverviewActivityFeed
                events={overview.recentActivity}
                maxItems={ADMIN_RECENT_ACTIVITY_LIMIT}
              />
            </section>

            <AdminOverviewFlagsPanel flags={overview.flags} />
          </div>
        </>
      )}
    </div>
  )
}
