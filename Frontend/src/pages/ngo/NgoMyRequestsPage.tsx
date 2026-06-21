import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router'
import { ListingsPager } from '../../components/donor/listings-pager'
import { NgoAcceptedRequestCard } from '../../components/ngo/ngo-accepted-request-card'
import {
  NgoCompactRequestRow,
  NgoPendingRequestCard,
} from '../../components/ngo/ngo-pending-request-card'
import { NgoRequestTabs } from '../../components/ngo/ngo-request-tabs'
import {
  NGO_REQUESTS_PAGE_SIZE,
  NGO_REQUESTS_TAB,
  type NgoRequestsTab,
} from '../../constants/ngo-requests'
import {
  filterNgoRequestsByTab,
  getEarlierHistoryRequests,
} from '../../lib/ngo-my-requests-filters'
import { paginateItems } from '../../lib/paginate-items'
import { toast } from '../../lib/toast'
import { ngoMyRequestsContent } from '../../placeholder/ngo-my-requests-content'
import { requestService } from '../../services/request-service'
import type { NgoMyRequest } from '../../types/ngo-my-request'

function parseTabParam(value: string | null): NgoRequestsTab {
  if (
    value === NGO_REQUESTS_TAB.PENDING ||
    value === NGO_REQUESTS_TAB.ACCEPTED ||
    value === NGO_REQUESTS_TAB.COMPLETED ||
    value === NGO_REQUESTS_TAB.DECLINED ||
    value === NGO_REQUESTS_TAB.EXPIRED
  ) {
    return value
  }

  return NGO_REQUESTS_TAB.ACCEPTED
}

export function NgoMyRequestsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [requests, setRequests] = useState<NgoMyRequest[]>([])
  const [counts, setCounts] = useState({
    pending: 0,
    accepted: 0,
    completed: 0,
    declined: 0,
    expired: 0,
  })
  const [loadState, setLoadState] = useState<'loading' | 'ready' | 'error'>(
    'loading',
  )
  const activeTab = parseTabParam(searchParams.get('tab'))
  const [page, setPage] = useState(1)

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoadState('loading')
      try {
        const data = await requestService.listMyRequests()
        if (!cancelled) {
          setRequests(data.requests)
          setCounts(data.counts)
          setLoadState('ready')
        }
      } catch {
        if (!cancelled) {
          setLoadState('error')
          toast.error(ngoMyRequestsContent.loadError)
        }
      }
    }

    void load()

    return () => {
      cancelled = true
    }
  }, [])

  const filteredRequests = useMemo(
    () => filterNgoRequestsByTab(requests, activeTab),
    [requests, activeTab],
  )

  const pagination = useMemo(
    () => paginateItems(filteredRequests, page, NGO_REQUESTS_PAGE_SIZE),
    [filteredRequests, page],
  )

  const earlierHistory = useMemo(
    () =>
      activeTab === NGO_REQUESTS_TAB.ACCEPTED
        ? getEarlierHistoryRequests(requests)
        : [],
    [activeTab, requests],
  )

  const handleTabChange = (tab: NgoRequestsTab) => {
    setPage(1)
    setSearchParams({ tab }, { replace: true })
  }

  const emptyMessage = ngoMyRequestsContent.empty[activeTab]

  return (
    <div className="mx-auto w-full max-w-4xl">
      <header className="mb-6">
        <h1 className="text-charcoal font-display text-2xl font-bold sm:text-3xl">
          {ngoMyRequestsContent.pageTitle}
        </h1>
        <p className="text-body mt-2 text-sm sm:text-base">
          {ngoMyRequestsContent.pageSubtitle}
        </p>
      </header>

      <NgoRequestTabs
        activeTab={activeTab}
        counts={counts}
        onTabChange={handleTabChange}
      />

      <section
        id={`ngo-requests-panel-${activeTab}`}
        role="tabpanel"
        aria-labelledby={`ngo-requests-tab-${activeTab}`}
        className="mt-8 flex flex-col gap-4"
      >
        {loadState === 'loading' ? (
          <p className="text-body text-sm">{ngoMyRequestsContent.loading}</p>
        ) : null}

        {loadState === 'error' ? (
          <p className="text-clay-red text-sm">{ngoMyRequestsContent.loadError}</p>
        ) : null}

        {loadState === 'ready' && filteredRequests.length === 0 ? (
          <p className="text-body text-sm">{emptyMessage}</p>
        ) : null}

        {loadState === 'ready' && filteredRequests.length > 0 ? (
          <>
            {pagination.items.map((request) => {
              if (activeTab === NGO_REQUESTS_TAB.ACCEPTED) {
                return (
                  <NgoAcceptedRequestCard key={request._id} request={request} />
                )
              }

              if (activeTab === NGO_REQUESTS_TAB.PENDING) {
                return (
                  <NgoPendingRequestCard key={request._id} request={request} />
                )
              }

              return (
                <NgoCompactRequestRow key={request._id} request={request} />
              )
            })}

            <ListingsPager
              page={page}
              totalPages={pagination.totalPages}
              onPageChange={setPage}
              navAriaLabel={ngoMyRequestsContent.pager.navAriaLabel}
              previousLabel={ngoMyRequestsContent.pager.previous}
              nextLabel={ngoMyRequestsContent.pager.next}
              pageLabel={ngoMyRequestsContent.pager.page}
            />
          </>
        ) : null}

        {loadState === 'ready' && earlierHistory.length > 0 ? (
          <section className="mt-6">
            <h2 className="text-charcoal mb-3 text-sm font-semibold">
              {ngoMyRequestsContent.earlierHeading}
            </h2>
            <div className="flex flex-col gap-3">
              {earlierHistory.map((request) => (
                <NgoCompactRequestRow key={request._id} request={request} />
              ))}
            </div>
          </section>
        ) : null}
      </section>
    </div>
  )
}
