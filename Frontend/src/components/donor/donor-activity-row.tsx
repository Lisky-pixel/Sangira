import { formatDonorActivityEvent } from '../../lib/format-donor-activity'
import { formatActivityTimestamp } from '../../lib/relative-time'
import type { DonorActivityEvent } from '../../types/donor-impact'

type DonorActivityRowProps = {
  event: DonorActivityEvent
}

export function DonorActivityRow({ event }: DonorActivityRowProps) {
  const formatted = formatDonorActivityEvent(event)

  return (
    <li className="flex items-start justify-between gap-3 py-3 first:pt-0 last:pb-0 sm:gap-4">
      <div className="min-w-0">
        <p className="text-primary text-sm font-medium">{formatted.title}</p>
        <p className="text-body mt-1 text-sm">{formatted.description}</p>
      </div>
      <time
        dateTime={event.timestamp}
        className="text-body shrink-0 text-xs whitespace-nowrap"
      >
        {formatActivityTimestamp(event.timestamp)}
      </time>
    </li>
  )
}
