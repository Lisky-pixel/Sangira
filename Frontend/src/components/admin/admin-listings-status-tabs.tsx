import {
  ADMIN_LISTING_STATUS_FILTER,
  ADMIN_LISTING_STATUS_FILTER_ORDER,
  type AdminListingStatusFilter,
} from '../../constants/admin-listings'
import { cn } from '../../lib/utils'
import { adminListingsContent } from '../../placeholder/admin-listings-content'
import type { AdminListingStatusCounts } from '../../types/admin-listings'

type AdminListingsStatusTabsProps = {
  value: AdminListingStatusFilter
  counts: AdminListingStatusCounts
  onChange: (value: AdminListingStatusFilter) => void
}

const TAB_LABELS: Record<AdminListingStatusFilter, string> = {
  [ADMIN_LISTING_STATUS_FILTER.ALL]: adminListingsContent.tabs.all,
  [ADMIN_LISTING_STATUS_FILTER.ACTIVE]: adminListingsContent.tabs.active,
  [ADMIN_LISTING_STATUS_FILTER.AWAITING_PICKUP]:
    adminListingsContent.tabs.awaitingPickup,
  [ADMIN_LISTING_STATUS_FILTER.COMPLETED]: adminListingsContent.tabs.completed,
  [ADMIN_LISTING_STATUS_FILTER.EXPIRED]: adminListingsContent.tabs.expired,
}

function resolveTabCount(
  filter: AdminListingStatusFilter,
  counts: AdminListingStatusCounts,
): number {
  switch (filter) {
    case ADMIN_LISTING_STATUS_FILTER.ACTIVE:
      return counts.active
    case ADMIN_LISTING_STATUS_FILTER.AWAITING_PICKUP:
      return counts.awaiting_pickup
    case ADMIN_LISTING_STATUS_FILTER.COMPLETED:
      return counts.completed
    case ADMIN_LISTING_STATUS_FILTER.EXPIRED:
      return counts.expired
    default:
      return counts.all
  }
}

export function AdminListingsStatusTabs({
  value,
  counts,
  onChange,
}: AdminListingsStatusTabsProps) {
  const { tabs } = adminListingsContent

  return (
    <div
      role="tablist"
      aria-label={tabs.ariaLabel}
      className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1"
    >
      {ADMIN_LISTING_STATUS_FILTER_ORDER.map((filter) => {
        const selected = value === filter
        const label = tabs.label(
          TAB_LABELS[filter],
          resolveTabCount(filter, counts),
        )

        return (
          <button
            key={filter}
            type="button"
            role="tab"
            aria-selected={selected}
            onClick={() => onChange(filter)}
            className={cn(
              'inline-flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors',
              selected
                ? 'border-primary bg-primary text-white'
                : 'border-border text-charcoal bg-white hover:border-primary/40',
            )}
          >
            {selected ? (
              <span
                aria-hidden="true"
                className="size-2 rounded-full bg-white"
              />
            ) : null}
            {label}
          </button>
        )
      })}
    </div>
  )
}
