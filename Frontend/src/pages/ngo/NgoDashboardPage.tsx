import { UtensilsCrossed } from 'lucide-react'
import { useMemo } from 'react'
import { Link } from 'react-router'
import { useAuth } from '../../auth'
import { NgoDashboardActiveRequestItem } from '../../components/ngo/ngo-dashboard-active-request-item'
import { NgoListingCard } from '../../components/ngo/ngo-listing-card'
import { VerifiedBadge } from '../../components/ui/verified-badge'
import {
  NGO_ACTIVE_REQUESTS_LIMIT,
  NGO_AVAILABLE_NOW_LIMIT,
} from '../../constants/ngo-dashboard'
import { useNgoDashboard } from '../../hooks/use-ngo-dashboard'
import { getGreeting } from '../../lib/greeting'
import { ngoDashboardContent } from '../../placeholder/ngo-dashboard-content'
import { ngoPortalContent } from '../../placeholder/ngo-browse-content'

export function NgoDashboardPage() {
  const { state } = useAuth()
  const { dashboard, loadState } = useNgoDashboard()

  const requestedListingIds = useMemo(() => {
    if (!dashboard) {
      return new Set<string>()
    }

    return new Set(dashboard.activeRequests.requestedListingIds)
  }, [dashboard])

  if (state.status !== 'authed') {
    return null
  }

  const organisationName =
    state.user.organisationName?.trim() || ngoPortalContent.topNav.brand

  const capacity = dashboard?.capacity
  const availableNow = (dashboard?.availableNow ?? []).slice(
    0,
    NGO_AVAILABLE_NOW_LIMIT,
  )
  const activeRequests = dashboard?.activeRequests ?? {
    requests: [],
    total: 0,
    requestedListingIds: [],
  }
  const activeRequestPreview = activeRequests.requests.slice(
    0,
    NGO_ACTIVE_REQUESTS_LIMIT,
  )
  const dailyCapacity = capacity?.dailyCapacity
  const hasDailyCapacity = typeof dailyCapacity === 'number'

  const capacityHeadline = (() => {
    if (!capacity) {
      return null
    }

    const transportLabel = capacity.transportAvailable
      ? ngoDashboardContent.capacity.transportAvailable
      : ngoDashboardContent.capacity.transportNotAvailable

    if (hasDailyCapacity) {
      return `${ngoDashboardContent.capacity.capacityToday(dailyCapacity)} · ${transportLabel}`
    }

    return `${ngoDashboardContent.capacity.setCapacityPrompt} — ${transportLabel}`
  })()

  return (
    <div className="flex flex-col gap-8">
      <section>
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-charcoal font-display text-2xl font-bold sm:text-3xl">
            {getGreeting()}, {organisationName}
          </h1>
          <VerifiedBadge
            label={ngoDashboardContent.greeting.verifiedOrganisation}
          />
        </div>
      </section>

      <section className="bg-mint-card border-border rounded-2xl border p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex min-w-0 items-start gap-4">
            <span className="bg-primary/10 text-primary flex size-12 shrink-0 items-center justify-center rounded-xl">
              <UtensilsCrossed aria-hidden="true" className="size-6" />
            </span>
            <div className="min-w-0">
              <p className="text-charcoal font-display text-lg font-bold">
                {capacityHeadline ?? ngoDashboardContent.capacity.setCapacityPrompt}
              </p>
              <p className="text-body mt-2 text-sm">
                {ngoDashboardContent.capacity.subcopy}
              </p>
            </div>
          </div>

          <Link
            to={ngoDashboardContent.routes.capacity}
            className="text-primary shrink-0 text-sm font-medium hover:underline"
            aria-label={ngoDashboardContent.capacity.editAria}
          >
            {ngoDashboardContent.capacity.edit}
          </Link>
        </div>
      </section>

      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(18rem,1fr)]">
        <section className="flex flex-col gap-5">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-charcoal font-display text-xl font-bold">
                {ngoDashboardContent.availableNow.heading}
              </h2>
              <p className="text-body mt-1 text-sm">
                {ngoDashboardContent.availableNow.subcopy}
              </p>
            </div>
            <Link
              to={ngoDashboardContent.routes.browse}
              className="text-primary text-sm font-medium hover:underline"
            >
              {ngoDashboardContent.availableNow.browseAll}
            </Link>
          </div>

          {loadState === 'loading' ? (
            <p className="text-body text-sm">
              {ngoDashboardContent.availableNow.loading}
            </p>
          ) : loadState === 'error' ? (
            <p className="text-clay-red text-sm">
              {ngoDashboardContent.availableNow.loadError}
            </p>
          ) : availableNow.length === 0 ? (
            <p className="text-body rounded-2xl border border-dashed border-border bg-white px-5 py-8 text-center text-sm">
              {ngoDashboardContent.availableNow.empty}
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {availableNow.map((listing) => (
                <NgoListingCard
                  key={listing._id}
                  listing={listing}
                  hasRequested={requestedListingIds.has(listing._id)}
                />
              ))}
            </div>
          )}
        </section>

        <aside className="border-border h-fit w-full rounded-2xl border bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-charcoal font-display text-lg font-bold">
              {ngoDashboardContent.activeRequests.heading}
            </h2>
            {loadState === 'ready' ? (
              <span className="bg-sand text-body rounded-full px-2.5 py-1 text-xs font-medium">
                {ngoDashboardContent.activeRequests.totalPill(
                  activeRequests.total,
                )}
              </span>
            ) : null}
          </div>

          {loadState === 'loading' ? (
            <p className="text-body mt-5 text-sm">
              {ngoDashboardContent.activeRequests.loading}
            </p>
          ) : loadState === 'error' ? (
            <p className="text-clay-red mt-5 text-sm">
              {ngoDashboardContent.activeRequests.loadError}
            </p>
          ) : activeRequestPreview.length === 0 ? (
            <p className="text-body mt-5 text-sm">
              {ngoDashboardContent.activeRequests.empty}
            </p>
          ) : (
            <ul className="mt-5 flex flex-col gap-3">
              {activeRequestPreview.map((request) => (
                <li key={request._id}>
                  <NgoDashboardActiveRequestItem request={request} />
                </li>
              ))}
            </ul>
          )}

          <div className="mt-5 text-center">
            <Link
              to={ngoDashboardContent.routes.requests}
              className="text-primary text-sm font-medium hover:underline"
            >
              {ngoDashboardContent.activeRequests.viewAll}
            </Link>
          </div>
        </aside>
      </div>
    </div>
  )
}
