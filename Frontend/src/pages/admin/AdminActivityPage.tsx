import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { AdminOverviewActivityFeed } from '../../components/admin'
import { ListingsPager } from '../../components/donor/listings-pager'
import { ADMIN_ACTIVITY_PAGE_SIZE } from '../../constants/admin-overview'
import { adminActivityContent } from '../../placeholder/admin-activity-content'
import { adminPortalService } from '../../services/admin-portal-service'
import type { AdminOverviewActivityEvent } from '../../types/admin-overview'

export function AdminActivityPage() {
  const [page, setPage] = useState(1)
  const [events, setEvents] = useState<AdminOverviewActivityEvent[]>([])
  const [totalPages, setTotalPages] = useState(1)
  const [loadState, setLoadState] = useState<'loading' | 'ready' | 'error'>(
    'loading',
  )

  useEffect(() => {
    let cancelled = false

    const load = async () => {
      setLoadState('loading')

      try {
        const result = await adminPortalService.getActivity(
          page,
          ADMIN_ACTIVITY_PAGE_SIZE,
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
        to={adminActivityContent.routes.overview}
        className="text-primary inline-flex text-sm font-medium hover:underline"
      >
        {adminActivityContent.backToOverview}
      </Link>

      <section>
        <h1 className="text-charcoal font-display text-2xl font-bold sm:text-3xl">
          {adminActivityContent.pageTitle}
        </h1>
        <p className="text-body mt-2 text-sm">
          {adminActivityContent.pageSubtitle}
        </p>
      </section>

      <section className="border-border rounded-2xl border bg-white p-5 shadow-sm sm:p-6">
        {loadState === 'loading' ? (
          <p className="text-body text-sm">{adminActivityContent.loading}</p>
        ) : loadState === 'error' ? (
          <p className="text-clay-red text-sm">{adminActivityContent.loadError}</p>
        ) : events.length === 0 ? (
          <p className="text-body text-sm">{adminActivityContent.empty}</p>
        ) : (
          <AdminOverviewActivityFeed
            events={events}
            emptyMessage={adminActivityContent.empty}
            listClassName="divide-border divide-y"
            emptyClassName="text-body text-sm"
          />
        )}
      </section>

      {loadState === 'ready' && events.length > 0 ? (
        <ListingsPager
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
          navAriaLabel={adminActivityContent.pager.navAriaLabel}
          previousLabel={adminActivityContent.pager.previous}
          nextLabel={adminActivityContent.pager.next}
          pageLabel={adminActivityContent.pager.page}
        />
      ) : null}
    </div>
  )
}
