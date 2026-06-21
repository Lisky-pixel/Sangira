import { Suspense, useEffect, useMemo, useState } from 'react'
import { useAuth } from '../../auth'
import { ListingsPager } from '../../components/donor/listings-pager'
import { NgoBrowseFilterBar } from '../../components/ngo/ngo-browse-filter-bar'
import { NgoBrowseMapPanelLazy } from '../../components/ngo/ngo-browse-map-lazy'
import { NgoBrowseViewToggle } from '../../components/ngo/ngo-browse-view-toggle'
import { NgoListingCard } from '../../components/ngo/ngo-listing-card'
import { MY_LISTINGS_PAGE_SIZE } from '../../constants/my-listings'
import {
  EMPTY_NGO_BROWSE_FILTERS,
  filterNgoBrowseListings,
  type NgoBrowseFilters,
} from '../../lib/ngo-browse-filters'
import { getActiveRequestedListingIds } from '../../lib/ngo-my-requests-filters'
import { getNgoServiceCoordinates } from '../../lib/ngo-service-location'
import { paginateItems } from '../../lib/paginate-items'
import { toast } from '../../lib/toast'
import { ngoBrowseContent } from '../../placeholder/ngo-browse-content'
import { listingService } from '../../services/listing-service'
import { requestService } from '../../services/request-service'
import type { NgoBrowseListing } from '../../types/ngo-browse-listing'
import type { NgoBrowseViewMode } from '../../components/ngo/ngo-browse-view-toggle'

export function NgoBrowseListingsPage() {
  const { state, refreshMe } = useAuth()
  const ngoCoordinates =
    state.status === 'authed' ? getNgoServiceCoordinates(state.user) : null

  const [listings, setListings] = useState<NgoBrowseListing[]>([])
  const [requestedListingIds, setRequestedListingIds] = useState<Set<string>>(
    new Set(),
  )
  const [loadState, setLoadState] = useState<'loading' | 'ready' | 'error'>(
    'loading',
  )
  const [filters, setFilters] = useState(EMPTY_NGO_BROWSE_FILTERS)
  const [page, setPage] = useState(1)
  const [viewMode, setViewMode] = useState<NgoBrowseViewMode>('list')

  useEffect(() => {
    if (state.status === 'authed') {
      void refreshMe()
    }
  }, [refreshMe, state.status])

  useEffect(() => {
    let cancelled = false

    async function loadListings() {
      setLoadState('loading')
      try {
        const [browseData, mineData] = await Promise.all([
          listingService.browseListings(),
          requestService.listMyRequests(),
        ])
        if (!cancelled) {
          setListings(browseData)
          setRequestedListingIds(
            getActiveRequestedListingIds(mineData.requests),
          )
          setLoadState('ready')
        }
      } catch {
        if (!cancelled) {
          setLoadState('error')
          toast.error(ngoBrowseContent.loadError)
        }
      }
    }

    const timeoutId = window.setTimeout(() => {
      void loadListings()
    }, 0)

    return () => {
      cancelled = true
      window.clearTimeout(timeoutId)
    }
  }, [])

  const filteredListings = useMemo(
    () => filterNgoBrowseListings(listings, filters),
    [filters, listings],
  )

  const pagination = useMemo(
    () =>
      paginateItems(
        filteredListings,
        page,
        MY_LISTINGS_PAGE_SIZE,
      ),
    [filteredListings, page],
  )

  const handleFiltersChange = (next: NgoBrowseFilters) => {
    setFilters(next)
    setPage(1)
  }

  const hasActiveFilters =
    filters.search.trim().length > 0 ||
    filters.foodTypes.length > 0 ||
    filters.storageConditions.length > 0 ||
    filters.expiresToday

  const emptyMessage = hasActiveFilters
    ? ngoBrowseContent.empty
    : ngoBrowseContent.emptyAvailable

  return (
    <div className="flex w-full flex-col gap-6">
      <header>
        <h1 className="text-charcoal font-display text-2xl font-bold sm:text-3xl">
          {ngoBrowseContent.pageTitle}
        </h1>
        <p className="text-body mt-2 text-sm sm:text-base">
          {ngoBrowseContent.pageSubtitle}
        </p>
      </header>

      <div className="flex flex-col gap-4">
        <div className="flex justify-end">
          <NgoBrowseViewToggle view={viewMode} onChange={setViewMode} />
        </div>

        <NgoBrowseFilterBar filters={filters} onChange={handleFiltersChange} />
      </div>

      {loadState === 'loading' ? (
        <p className="text-body text-sm">{ngoBrowseContent.loading}</p>
      ) : null}

      {loadState === 'error' ? (
        <p className="text-clay-red text-sm">{ngoBrowseContent.loadError}</p>
      ) : null}

      {loadState === 'ready' ? (
        <>
          {viewMode === 'map' ? (
            filteredListings.length === 0 ? (
              <p className="text-body text-sm">{emptyMessage}</p>
            ) : (
              <Suspense
                fallback={
                  <p className="text-body text-sm">
                    {ngoBrowseContent.map.loading}
                  </p>
                }
              >
                <NgoBrowseMapPanelLazy
                  listings={filteredListings}
                  ngoCoordinates={ngoCoordinates}
                  requestedListingIds={requestedListingIds}
                />
              </Suspense>
            )
          ) : filteredListings.length === 0 ? (
            <p className="text-body text-sm">{emptyMessage}</p>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                {pagination.items.map((listing) => (
                  <NgoListingCard
                    key={listing._id}
                    listing={listing}
                    ngoCoordinates={ngoCoordinates}
                    hasRequested={requestedListingIds.has(listing._id)}
                  />
                ))}
              </div>

              <ListingsPager
                page={page}
                totalPages={pagination.totalPages}
                onPageChange={setPage}
                className="mt-2"
                navAriaLabel={ngoBrowseContent.pager.navAriaLabel}
                previousLabel={ngoBrowseContent.pager.previous}
                nextLabel={ngoBrowseContent.pager.next}
                pageLabel={ngoBrowseContent.pager.page}
              />
            </>
          )}

          <p className="text-body text-center text-xs sm:text-sm">
            {ngoBrowseContent.footnote}
          </p>
        </>
      ) : null}
    </div>
  )
}
