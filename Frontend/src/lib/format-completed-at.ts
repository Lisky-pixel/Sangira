import {
  formatCompletedLabel,
  formatPickupByTime,
} from './format-listing-time'

export function formatCompletedAt(iso: string, now = Date.now()): string {
  const time = formatPickupByTime(iso)
  if (!time) {
    return ''
  }

  const dayLabel = formatCompletedLabel(iso, now)

  if (dayLabel === 'today') {
    return `Completed today at ${time}`
  }

  if (dayLabel === 'yesterday') {
    return `Completed yesterday at ${time}`
  }

  return `Completed ${dayLabel} at ${time}`
}
