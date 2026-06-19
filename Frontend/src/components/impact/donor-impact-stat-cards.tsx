import { donorImpactContent } from '../../placeholder/donor-impact-content'
import type {
  DonorImpactThisMonth,
  DonorImpactTotals,
} from '../../types/donor-impact'

type DonorImpactStatCardsProps = {
  totals: DonorImpactTotals
  thisMonth: DonorImpactThisMonth
}

function StatCard({
  value,
  delta,
  emphasize = true,
}: {
  value: string
  delta: string
  emphasize?: boolean
}) {
  return (
    <article className="border-border rounded-2xl border bg-white p-5 shadow-sm sm:p-6">
      <p
        className={
          emphasize
            ? 'text-primary font-display text-xl font-bold sm:text-2xl'
            : 'text-charcoal font-display text-xl font-bold sm:text-2xl'
        }
      >
        {value}
      </p>
      <p className="text-body mt-2 text-sm">{delta}</p>
    </article>
  )
}

export function DonorImpactStatCards({
  totals,
  thisMonth,
}: DonorImpactStatCardsProps) {
  const showItems =
    totals.itemsRedistributed > 0 || thisMonth.items > 0

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <div className="flex flex-col gap-2">
        <StatCard
          value={donorImpactContent.stats.meals.value(totals.mealsRedistributed)}
          delta={donorImpactContent.stats.meals.delta(thisMonth.meals)}
        />
        {showItems ? (
          <p className="text-body px-1 text-xs">
            {donorImpactContent.stats.itemsLine(totals.itemsRedistributed)}
            {thisMonth.items > 0
              ? ` · ${donorImpactContent.stats.itemsDelta(thisMonth.items)}`
              : ''}
          </p>
        ) : null}
      </div>

      <StatCard
        value={donorImpactContent.stats.waste.value(totals.wasteKgPrevented)}
        delta={donorImpactContent.stats.waste.delta(thisMonth.wasteKg)}
      />

      <StatCard
        value={donorImpactContent.stats.transfers.value(
          totals.completedTransfers,
        )}
        delta={donorImpactContent.stats.transfers.ngosServed(totals.ngosServed)}
        emphasize={false}
      />
    </div>
  )
}
