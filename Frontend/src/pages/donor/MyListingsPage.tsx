import { useEffect, useMemo, useState } from 'react'
import { DonorListingCard } from '../../components/donor'
import { ListingStatusTabs } from '../../components/donor/listing-status-tabs'
import { ListingsPager } from '../../components/donor/listings-pager'
import { PostNewListingTile } from '../../components/donor/post-new-listing-tile'
import { MY_LISTINGS_TAB, type MyListingsTab } from '../../constants/my-listings'
import { useMyListings } from '../../hooks/use-my-listings'
import {
  countAllTabs,
  filterListingsByTab,
} from '../../lib/my-listings-filters'
import { paginateTabItems } from '../../lib/my-listings-pagination'
import { toast } from '../../lib/toast'
import { myListingsContent } from '../../placeholder/my-listings-content'

export function MyListingsPage() {
  const { listings, loadState } = useMyListings()
  const [activeTab, setActiveTab] = useState<MyListingsTab>(
    MY_LISTINGS_TAB.ACTIVE,
  )
  const [page, setPage] = useState(1)

  const tabCounts = useMemo(() => countAllTabs(listings), [listings])

  const filteredListings = useMemo(
    () => filterListingsByTab(listings, activeTab),
    [listings, activeTab],
  )

  const pagination = useMemo(
    () =>
      paginateTabItems({
        items: filteredListings,
        tab: activeTab,
        page,
      }),
    [filteredListings, activeTab, page],
  )

  const handleTabChange = (tab: MyListingsTab) => {
    setActiveTab(tab)
    setPage(1)
  }

  const showEmptyMessage =
    loadState === 'ready' &&
    filteredListings.length === 0 &&
    !(
      activeTab === MY_LISTINGS_TAB.ACTIVE && pagination.showPostNewListingTile
    )

  useEffect(() => {
    if (loadState === 'error') {
      toast.error(myListingsContent.loadError)
    }
  }, [loadState])

  return (
    <div className="mx-auto w-full max-w-6xl">
      <header className="mb-6">
        <h1 className="text-charcoal font-display text-2xl font-bold sm:text-3xl">
          {myListingsContent.pageTitle}
        </h1>
        <p className="text-body mt-2 text-sm sm:text-base">
          {myListingsContent.pageSubtitle}
        </p>
      </header>

      <ListingStatusTabs
        activeTab={activeTab}
        counts={tabCounts}
        onTabChange={handleTabChange}
      />

      <section
        id={`my-listings-panel-${activeTab}`}
        role="tabpanel"
        aria-labelledby={`my-listings-tab-${activeTab}`}
        className="mt-8"
      >
        {loadState === 'loading' ? (
          <p className="text-body text-sm">{myListingsContent.loading}</p>
        ) : null}

        {loadState === 'error' ? (
          <p className="text-clay-red text-sm">{myListingsContent.loadError}</p>
        ) : null}

        {loadState === 'ready' ? (
          <>
            {showEmptyMessage ? (
              <p className="text-body mb-6 text-sm">
                {myListingsContent.emptyByTab[activeTab]}
              </p>
            ) : null}

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
              {pagination.items.map((listing) => (
                <DonorListingCard key={listing._id} listing={listing} />
              ))}
              {pagination.showPostNewListingTile ? <PostNewListingTile /> : null}
            </div>

            <ListingsPager
              page={page}
              totalPages={pagination.totalPages}
              onPageChange={setPage}
              className="mt-8"
            />
          </>
        ) : null}
      </section>
    </div>
  )
}
