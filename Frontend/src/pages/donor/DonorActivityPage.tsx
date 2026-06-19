import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { DonorActivityFeed } from '../../components/donor/donor-activity-feed'
import { ListingsPager } from '../../components/donor/listings-pager'
import { DONOR_ACTIVITY_PAGE_SIZE } from '../../constants/donor-activity'
import { donorActivityContent } from '../../placeholder/donor-activity-content'
import { dashboardService } from '../../services/donor-impact-service'
import type { DonorActivityEvent } from '../../types/donor-impact'

export function DonorActivityPage() {
  const [page, setPage] = useState(1)
  const [events, setEvents] = useState<DonorActivityEvent[]>([])
  const [totalPages, setTotalPages] = useState(1)
  const [loadState, setLoadState] = useState<'loading' | 'ready' | 'error'>(
    'loading',
  )

  useEffect(() => {
    let cancelled = false

    const load = async () => {
      setLoadState('loading')

      try {
        const result = await dashboardService.getDonorActivity(
          page,
          DONOR_ACTIVITY_PAGE_SIZE,
        )

        if (cancelled) {
          return
        }

        setEvents(result.activity)
        setTotalPages(result.pagination.totalPages)
        setLoadState('ready')
      } catch {
        if (!cancelled) {
          setLoadState('error')
        }
      }
    }

    void load()

    return () => {
      cancelled = true
    }
  }, [page])

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
      <Link
        to={donorActivityContent.routes.dashboard}
        className="text-primary inline-flex text-sm font-medium hover:underline"
      >
        {donorActivityContent.backToDashboard}
      </Link>

      <section>
        <h1 className="text-charcoal font-display text-2xl font-bold sm:text-3xl">
          {donorActivityContent.pageTitle}
        </h1>
        <p className="text-body mt-2 text-sm">
          {donorActivityContent.pageSubtitle}
        </p>
      </section>

      <section className="border-border rounded-2xl border bg-white p-5 shadow-sm sm:p-6">
        {loadState === 'loading' ? (
          <p className="text-body text-sm">{donorActivityContent.loading}</p>
        ) : loadState === 'error' ? (
          <p className="text-clay-red text-sm">{donorActivityContent.loadError}</p>
        ) : events.length === 0 ? (
          <p className="text-body text-sm">{donorActivityContent.empty}</p>
        ) : (
          <DonorActivityFeed events={events} />
        )}
      </section>

      {loadState === 'ready' && events.length > 0 ? (
        <ListingsPager
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
          navAriaLabel={donorActivityContent.pager.navAriaLabel}
          previousLabel={donorActivityContent.pager.previous}
          nextLabel={donorActivityContent.pager.next}
          pageLabel={donorActivityContent.pager.page}
        />
      ) : null}
    </div>
  )
}
