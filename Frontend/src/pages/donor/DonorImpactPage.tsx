import { useAuth } from '../../auth'
import {
  DonorImpactMealsChart,
  DonorImpactShareCard,
  DonorImpactStatCards,
} from '../../components/impact'
import { VerifiedBadge } from '../../components/ui/verified-badge'
import { useDonorImpact } from '../../hooks/use-donor-impact'
import { formatMemberMonthYear } from '../../lib/profile-format'
import { donorImpactContent } from '../../placeholder/donor-impact-content'

export function DonorImpactPage() {
  const { state } = useAuth()
  const { impact, loadState } = useDonorImpact()

  if (state.status !== 'authed') {
    return null
  }

  const organisationName =
    state.user.organisationName?.trim() || donorImpactContent.verifiedDonor

  if (loadState === 'loading') {
    return (
      <p className="text-body text-center text-sm">
        {donorImpactContent.loading}
      </p>
    )
  }

  if (loadState === 'error' || !impact) {
    return (
      <p className="text-body text-center text-sm">
        {donorImpactContent.loadError}
      </p>
    )
  }

  const memberSince = formatMemberMonthYear(impact.memberSince)

  return (
    <div className="flex flex-col gap-8">
      <section>
        <h1 className="text-charcoal font-display text-2xl font-bold sm:text-3xl">
          {donorImpactContent.pageTitle}
        </h1>
        <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
          <span className="text-body font-medium">{organisationName}</span>
          {memberSince ? (
            <>
              <span className="text-body" aria-hidden="true">
                ·
              </span>
              <VerifiedBadge
                label={donorImpactContent.verifiedSince(memberSince)}
                className="text-sm"
              />
            </>
          ) : null}
        </div>
      </section>

      <DonorImpactStatCards
        totals={impact.totals}
        thisMonth={impact.thisMonth}
      />

      <section className="grid grid-cols-1 items-stretch gap-5 lg:grid-cols-[minmax(0,2fr)_minmax(18rem,1fr)]">
        <article className="border-border flex min-h-[22rem] flex-col rounded-2xl border bg-white p-5 shadow-sm sm:min-h-[24rem] sm:p-6 lg:min-h-[26rem]">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-charcoal font-display text-lg font-semibold">
              {donorImpactContent.chart.title}
            </h2>
            <div className="text-body flex items-center gap-2 text-xs">
              <span
                aria-hidden="true"
                className="bg-primary size-3 rounded-sm"
              />
              <span>{donorImpactContent.chart.legend}</span>
            </div>
          </div>

          <DonorImpactMealsChart data={impact.monthlySeries} className="min-h-0 flex-1" />
        </article>

        <DonorImpactShareCard />
      </section>
    </div>
  )
}
