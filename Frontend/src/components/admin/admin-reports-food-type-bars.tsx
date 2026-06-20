import { adminReportsContent } from '../../placeholder/admin-reports-content'
import type { AdminReportsFoodTypeCount } from '../../types/admin-reports'

type AdminReportsFoodTypeBarsProps = {
  items: AdminReportsFoodTypeCount[]
}

export function AdminReportsFoodTypeBars({
  items,
}: AdminReportsFoodTypeBarsProps) {
  const { listingsByFoodType } = adminReportsContent.charts
  const maxCount = items.reduce((max, item) => Math.max(max, item.count), 0)

  return (
    <article
      aria-label={listingsByFoodType.ariaLabel}
      className="border-border flex min-h-[22rem] flex-col rounded-2xl border bg-white p-5 shadow-sm sm:min-h-[24rem] sm:p-6"
    >
      <h2 className="text-charcoal font-display text-lg font-bold">
        {listingsByFoodType.title}
      </h2>

      {items.length === 0 ? (
        <p className="text-body mt-8 flex flex-1 items-center justify-center text-sm">
          {listingsByFoodType.empty}
        </p>
      ) : (
        <ul className="mt-6 flex flex-1 flex-col gap-4">
          {items.map((item) => {
            const widthPercent =
              maxCount > 0 ? Math.round((item.count / maxCount) * 100) : 0

            return (
              <li key={item.foodType}>
                <div className="mb-2 flex items-center justify-between gap-3 text-sm">
                  <span className="text-charcoal font-medium">{item.label}</span>
                  <span className="text-body tabular-nums">
                    {item.count.toLocaleString()}
                  </span>
                </div>
                <div
                  className="bg-sand h-2.5 overflow-hidden rounded-full"
                  role="presentation"
                >
                  <div
                    className="bg-primary h-full rounded-full transition-[width]"
                    style={{ width: `${widthPercent}%` }}
                  />
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </article>
  )
}
