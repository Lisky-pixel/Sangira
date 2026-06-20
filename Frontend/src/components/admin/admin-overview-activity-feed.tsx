import { adminOverviewContent } from '../../placeholder/admin-overview-content'
import type { AdminOverviewActivityEvent } from '../../types/admin-overview'
import { AdminOverviewActivityRow } from './admin-overview-activity-row'

type AdminOverviewActivityFeedProps = {
  events: AdminOverviewActivityEvent[]
  maxItems?: number
  emptyMessage?: string
  listClassName?: string
  emptyClassName?: string
}

export function AdminOverviewActivityFeed({
  events,
  maxItems,
  emptyMessage = adminOverviewContent.activity.empty,
  listClassName = 'divide-border divide-y px-5 sm:px-6',
  emptyClassName = 'text-body px-5 py-6 text-sm sm:px-6',
}: AdminOverviewActivityFeedProps) {
  const visibleEvents =
    maxItems != null ? events.slice(0, maxItems) : events

  if (visibleEvents.length === 0) {
    return <p className={emptyClassName}>{emptyMessage}</p>
  }

  return (
    <ul className={listClassName}>
      {visibleEvents.map((event) => (
        <AdminOverviewActivityRow key={event.id} event={event} />
      ))}
    </ul>
  )
}
