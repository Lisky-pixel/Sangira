import { useEffect, useState } from 'react'
import {
  ADMIN_LISTINGS_PAGE,
  ADMIN_LISTING_STATUS_FILTER,
  type AdminListingStatusFilter,
} from '../../constants/admin-listings'
import { adminListingsContent } from '../../placeholder/admin-listings-content'
import { adminPortalService } from '../../services/admin-portal-service'
import type {
  AdminListingListItem,
  AdminListingStatusCounts,
} from '../../types/admin-listings'
import { AdminListingsInsightBanner } from '../../components/admin/admin-listings-insight-banner'
import { AdminListingsStatusTabs } from '../../components/admin/admin-listings-status-tabs'
import { AdminListingsTable } from '../../components/admin/admin-listings-table'
import { VerificationQueuePager } from '../../components/admin/verification-queue-pager'

const EMPTY_COUNTS: AdminListingStatusCounts = {
  all: 0,
  active: 0,
  awaiting_pickup: 0,
  completed: 0,
  expired: 0,
}

export function AdminListingsPage() {
  const [page, setPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState<AdminListingStatusFilter>(
    ADMIN_LISTING_STATUS_FILTER.ALL,
  )
  const [listings, setListings] = useState<AdminListingListItem[]>([])
  const [statusCounts, setStatusCounts] =
    useState<AdminListingStatusCounts>(EMPTY_COUNTS)
  const [unmatchedExpiredCount, setUnmatchedExpiredCount] = useState(0)
  const [totalItems, setTotalItems] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [loadState, setLoadState] = useState<'loading' | 'ready' | 'error'>(
    'loading',
  )

  useEffect(() => {
    let cancelled = false

    const load = async () => {
      setLoadState('loading')
      try {
        const result = await adminPortalService.listListings({
          page,
          pageSize: ADMIN_LISTINGS_PAGE.PAGE_SIZE,
          status: statusFilter,
        })
        if (cancelled) return
        setListings(result.listings)
        setStatusCounts(result.statusCounts)
        setUnmatchedExpiredCount(result.insights.unmatchedExpiredThisMonth)
        setTotalItems(result.pagination.totalItems)
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
  }, [page, statusFilter])

  const handleStatusChange = (nextStatus: AdminListingStatusFilter) => {
    setStatusFilter(nextStatus)
    setPage(1)
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      <header>
        <h1 className="text-charcoal font-display text-2xl font-bold sm:text-3xl">
          {adminListingsContent.pageTitle}
        </h1>
        <p className="text-body mt-2 text-sm">
          {adminListingsContent.pageSubtitle}
        </p>
      </header>

      {loadState === 'loading' && statusCounts.all === 0 ? (
        <p className="text-body text-sm">{adminListingsContent.loading}</p>
      ) : (
        <>
          <AdminListingsStatusTabs
            value={statusFilter}
            counts={statusCounts}
            onChange={handleStatusChange}
          />

          <AdminListingsInsightBanner count={unmatchedExpiredCount} />

          {loadState === 'loading' ? (
            <p className="text-body text-sm">{adminListingsContent.loading}</p>
          ) : loadState === 'error' ? (
            <p className="text-clay-red text-sm">
              {adminListingsContent.loadError}
            </p>
          ) : listings.length === 0 ? (
            <div className="border-border rounded-2xl border bg-white p-8 text-center shadow-sm">
              <p className="text-body text-sm">
                {adminListingsContent.empty(statusFilter)}
              </p>
            </div>
          ) : (
            <>
              <AdminListingsTable listings={listings} />
              <VerificationQueuePager
                page={page}
                totalPages={totalPages}
                shownCount={listings.length}
                totalItems={totalItems}
                onPageChange={setPage}
                labels={adminListingsContent.pager}
              />
            </>
          )}
        </>
      )}
    </div>
  )
}
