import type { DonorActivityEvent } from '../../types/donor-impact'
import { DonorActivityRow } from './donor-activity-row'

type DonorActivityFeedProps = {
  events: DonorActivityEvent[]
}

export function DonorActivityFeed({ events }: DonorActivityFeedProps) {
  return (
    <ul className="divide-border divide-y">
      {events.map((event) => (
        <DonorActivityRow key={event.id} event={event} />
      ))}
    </ul>
  )
}
