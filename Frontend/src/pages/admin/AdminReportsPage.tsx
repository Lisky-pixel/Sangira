import { useEffect, useState } from 'react'
import {
  AdminReportsFoodTypeBars,
  AdminReportsHeaderActions,
  AdminReportsMealsByDayChart,
  AdminReportsRankedOrganisationsPanel,
  AdminReportsSkeleton,
  AdminReportsStatCards,
} from '../../components/admin'
import { adminReportsContent } from '../../placeholder/admin-reports-content'
import { adminPortalService } from '../../services/admin-portal-service'
import type { AdminReportsData } from '../../types/admin-reports'

export function AdminReportsPage() {
  const [reports, setReports] = useState<AdminReportsData | null>(null)
  const [loadState, setLoadState] = useState<'loading' | 'ready' | 'error'>(
    'loading',
  )

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoadState('loading')
      try {
        const data = await adminPortalService.getReports()
        if (!cancelled) {
          setReports(data)
          setLoadState('ready')
        }
      } catch {
        if (!cancelled) {
          setReports(null)
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
            {adminReportsContent.pageTitle}
          </h1>
          <p className="text-body mt-2 text-sm">
            {adminReportsContent.pageSubtitle}
          </p>
        </div>
        <AdminReportsHeaderActions />
      </header>

      {loadState === 'loading' ? (
        <AdminReportsSkeleton />
      ) : loadState === 'error' || !reports ? (
        <p className="text-clay-red text-sm">{adminReportsContent.loadError}</p>
      ) : (
        <>
          <AdminReportsStatCards stats={reports.stats} />

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <AdminReportsMealsByDayChart data={reports.mealsByDayOfWeek} />
            <AdminReportsFoodTypeBars items={reports.listingsByFoodType} />
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <AdminReportsRankedOrganisationsPanel
              variant="donors"
              items={reports.topDonors}
            />
            <AdminReportsRankedOrganisationsPanel
              variant="ngos"
              items={reports.mostServedNgos}
            />
          </div>
        </>
      )}
    </div>
  )
}
