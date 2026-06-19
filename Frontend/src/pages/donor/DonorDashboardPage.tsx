import { ArrowRight, Building2, CircleHelp, Plus } from 'lucide-react'
import { useMemo } from 'react'
import { Link } from 'react-router'
import { DonorActivityFeed, DonorListingCard } from '../../components/donor'
import { ButtonLink } from '../../components/ui/button'
import { StatusChip } from '../../components/ui/status-chip'
import { VerifiedBadge } from '../../components/ui/verified-badge'
import { useAuth } from '../../auth'
import { DONOR_RECENT_ACTIVITY_LIMIT } from '../../constants/donor-activity'
import { DONOR_DASHBOARD_ONGOING_LISTING_LIMIT, NEEDS_ACTION_LIMIT } from '../../constants/donor-dashboard'
import { SUPPORT_MAILTO_HREF } from '../../constants/support'
import { useDonorDashboard } from '../../hooks/use-donor-dashboard'
import { useMyListings } from '../../hooks/use-my-listings'
import { getGreeting } from '../../lib/greeting'
import { filterOngoingListings } from '../../lib/my-listings-filters'
import {
  formatRelativeMinutes,
  minutesAgoFromIso,
} from '../../lib/relative-time'
import { donorDashboardContent } from '../../placeholder/donor-dashboard-content'
import { donorListingManagePath, ROUTES } from '../../routes/paths'

function MonthlyImpactChart({ values }: { values: number[] }) {
  const max = Math.max(...values, 1)

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 80 48"
      className="text-stat h-12 w-20 shrink-0"
    >
      {values.map((value, index) => {
        const barHeight = (value / max) * 40
        const x = index * 12 + 2
        const y = 44 - barHeight
        return (
          <rect
            key={index}
            x={x}
            y={y}
            width={8}
            height={barHeight}
            rx={1}
            fill="currentColor"
            opacity={0.35 + (index / values.length) * 0.65}
          />
        )
      })}
    </svg>
  )
}

export function DonorDashboardPage() {
  const { state } = useAuth()
  const { listings, loadState: listingsStatus } = useMyListings()
  const { dashboard, loadState: dashboardStatus } = useDonorDashboard()

  const activeListings = useMemo(
    () =>
      filterOngoingListings(listings)
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        )
        .slice(0, DONOR_DASHBOARD_ONGOING_LISTING_LIMIT),
    [listings],
  )

  if (state.status !== 'authed') {
    return null
  }

  const organisationName =
    state.user.organisationName?.trim() || donorDashboardContent.topNav.brand

  const monthlyImpact = dashboard?.monthlyImpact
  const chartValues =
    monthlyImpact?.monthlySeries.map((point) => point.meals) ?? []
  const needsAction = dashboard?.needsAction ?? { items: [], total: 0 }
  const pendingRequests = needsAction.items
  const recentActivity = (dashboard?.recentActivity ?? []).slice(
    0,
    DONOR_RECENT_ACTIVITY_LIMIT,
  )

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(18rem,1fr)]">
      <div className="flex flex-col gap-8">
        <section>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-charcoal font-display text-2xl font-bold sm:text-3xl">
              {getGreeting()}, {organisationName}
            </h1>
            <VerifiedBadge label={donorDashboardContent.greeting.verifiedDonor} />
          </div>
        </section>

        <section>
          <ButtonLink
            to={ROUTES.POST_LISTING}
            size="lg"
            className="bg-primary hover:bg-primary-hover flex w-full items-center justify-between rounded-2xl px-5 py-5 text-left text-white shadow-sm"
          >
            <span className="flex items-center gap-4">
              <span className="flex size-10 items-center justify-center rounded-full bg-white/15">
                <Plus aria-hidden="true" className="size-5" />
              </span>
              <span>
                <span className="font-display block text-lg font-semibold">
                  {donorDashboardContent.cta.title}
                </span>
                <span className="text-sm text-white/85">
                  {donorDashboardContent.cta.subtitle}
                </span>
              </span>
            </span>
            <ArrowRight aria-hidden="true" className="size-5 shrink-0" />
          </ButtonLink>
        </section>

        <section>
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-charcoal font-display text-xl font-bold">
              {donorDashboardContent.activeListings.heading}
            </h2>
            <Link
              to={ROUTES.DONOR_LISTINGS}
              className="text-primary text-sm font-medium hover:underline"
            >
              {donorDashboardContent.activeListings.viewAll}
            </Link>
          </div>

          {listingsStatus === 'loading' ? (
            <p className="text-body text-sm">
              {donorDashboardContent.activeListings.loading}
            </p>
          ) : listingsStatus === 'error' ? (
            <p className="text-clay-red text-sm">
              {donorDashboardContent.activeListings.loadError}
            </p>
          ) : activeListings.length === 0 ? (
            <div className="flex flex-col items-start gap-4">
              <p className="text-body text-sm">
                {donorDashboardContent.activeListings.empty}
              </p>
              <ButtonLink to={ROUTES.POST_LISTING}>
                {donorDashboardContent.activeListings.emptyCta}
              </ButtonLink>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
              {activeListings.map((listing) => (
                <DonorListingCard key={listing._id} listing={listing} />
              ))}
            </div>
          )}
        </section>

        <section>
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-charcoal font-display text-xl font-bold">
              {donorDashboardContent.needsAction.heading}
            </h2>
            {needsAction.total > NEEDS_ACTION_LIMIT ? (
              <Link
                to={ROUTES.DONOR_LISTINGS}
                className="text-primary text-sm font-medium hover:underline"
              >
                {donorDashboardContent.needsAction.viewAll(
                  pendingRequests.length,
                  needsAction.total,
                )}
              </Link>
            ) : null}
          </div>

          {dashboardStatus === 'loading' ? (
            <p className="text-body text-sm">
              {donorDashboardContent.needsAction.loading}
            </p>
          ) : dashboardStatus === 'error' ? (
            <p className="text-clay-red text-sm">
              {donorDashboardContent.needsAction.loadError}
            </p>
          ) : pendingRequests.length === 0 ? (
            <p className="text-body text-sm">{donorDashboardContent.needsAction.empty}</p>
          ) : (
            <div className="flex flex-col gap-4">
              {pendingRequests.map((request) => (
                <article
                  key={request.requestId}
                  className="border-border flex flex-col gap-4 rounded-2xl border bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-start gap-3">
                    <span className="bg-mint-card text-verified flex size-10 shrink-0 items-center justify-center rounded-full">
                      <Building2 aria-hidden="true" className="size-5" />
                    </span>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-charcoal text-sm font-medium sm:text-base">
                          {request.ngo.organisationName}
                        </p>
                        {request.ngo.verified ? <VerifiedBadge /> : null}
                      </div>
                      <p className="text-body mt-1 text-sm">
                        {request.listingTitle}
                      </p>
                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        <StatusChip status="requested" />
                        <span className="text-body text-xs">
                          {formatRelativeMinutes(
                            minutesAgoFromIso(request.requestedAt),
                          )}
                        </span>
                      </div>
                    </div>
                  </div>

                  <ButtonLink
                    to={donorListingManagePath(request.listingId)}
                    className="w-full sm:w-auto"
                  >
                    {donorDashboardContent.needsAction.reviewRequest}
                  </ButtonLink>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>

      <aside className="flex flex-col gap-5">
        <section className="bg-sand border-border rounded-2xl border p-5 shadow-sm">
          <p className="text-stat text-xs font-semibold tracking-wide uppercase">
            {donorDashboardContent.monthlyImpact.heading}
          </p>
          {dashboardStatus === 'loading' ? (
            <p className="text-body mt-4 text-sm">
              {donorDashboardContent.monthlyImpact.loading}
            </p>
          ) : dashboardStatus === 'error' || !monthlyImpact ? (
            <p className="text-clay-red mt-4 text-sm">
              {donorDashboardContent.monthlyImpact.loadError}
            </p>
          ) : (
            <div className="mt-4 flex items-end justify-between gap-4">
              <div>
                <p className="text-charcoal font-display text-3xl font-bold">
                  {donorDashboardContent.monthlyImpact.meals(
                    monthlyImpact.thisMonth.meals,
                  )}
                </p>
                <p className="text-body mt-1 text-sm">
                  {donorDashboardContent.monthlyImpact.wastePrevented(
                    monthlyImpact.thisMonth.wasteKg,
                  )}
                </p>
                {monthlyImpact.thisMonth.items > 0 ? (
                  <p className="text-body mt-1 text-sm">
                    {donorDashboardContent.monthlyImpact.items(
                      monthlyImpact.thisMonth.items,
                    )}
                  </p>
                ) : null}
              </div>
              <MonthlyImpactChart values={chartValues} />
            </div>
          )}
        </section>

        <section className="border-border rounded-2xl border bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-charcoal font-display text-lg font-bold">
              {donorDashboardContent.recentActivity.heading}
            </h2>
            {recentActivity.length > 0 ? (
              <Link
                to={ROUTES.DONOR_ACTIVITY}
                className="text-primary text-sm font-medium hover:underline"
              >
                {donorDashboardContent.recentActivity.viewAll}
              </Link>
            ) : null}
          </div>
          {dashboardStatus === 'loading' ? (
            <p className="text-body text-sm">
              {donorDashboardContent.monthlyImpact.loading}
            </p>
          ) : dashboardStatus === 'error' ? (
            <p className="text-clay-red text-sm">
              {donorDashboardContent.monthlyImpact.loadError}
            </p>
          ) : recentActivity.length === 0 ? (
            <p className="text-body text-sm">
              {donorDashboardContent.recentActivity.empty}
            </p>
          ) : (
            <DonorActivityFeed events={recentActivity} />
          )}
        </section>

        <section className="bg-mint-card border-border rounded-2xl border p-5 shadow-sm">
          <div className="flex items-start gap-3">
            <span className="bg-primary/10 text-primary flex size-10 shrink-0 items-center justify-center rounded-full">
              <CircleHelp aria-hidden="true" className="size-5" />
            </span>
            <div className="min-w-0">
              <h2 className="text-charcoal font-display text-lg font-bold">
                <a
                  href={SUPPORT_MAILTO_HREF}
                  className="text-primary hover:underline"
                >
                  {donorDashboardContent.needHelp.heading}
                </a>
              </h2>
              <p className="text-body mt-2 text-sm">
                {donorDashboardContent.needHelp.body}
              </p>
              <ButtonLink
                href={SUPPORT_MAILTO_HREF}
                variant="outline"
                className="mt-4"
              >
                {donorDashboardContent.needHelp.contactSupport}
              </ButtonLink>
            </div>
          </div>
        </section>
      </aside>
    </div>
  )
}
