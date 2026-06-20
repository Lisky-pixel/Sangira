import { formatRelativeTimeCompact } from './relative-time'
import { formatPickupByTime } from './format-listing-time'
import {
  ADMIN_LISTING_DISPLAY_STATUS,
  type AdminListingDisplayStatus,
} from '../constants/admin-listings'

function isSameCalendarDay(a: Date, b: Date): boolean {
  return (
    a.getDate() === b.getDate() &&
    a.getMonth() === b.getMonth() &&
    a.getFullYear() === b.getFullYear()
  )
}

function isYesterday(then: Date, now: Date): boolean {
  const yesterday = new Date(now)
  yesterday.setDate(yesterday.getDate() - 1)
  return isSameCalendarDay(then, yesterday)
}

/** Short posted label for admin listings table (e.g. "Today 8:02 AM", "Yesterday"). */
export function formatAdminListingPostedAt(iso: string, now = Date.now()): string {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return ''

  const nowDate = new Date(now)

  if (isSameCalendarDay(date, nowDate)) {
    const time = date.toLocaleTimeString(undefined, {
      hour: 'numeric',
      minute: '2-digit',
    })
    return `Today ${time}`
  }

  if (isYesterday(date, nowDate)) {
    return 'Yesterday'
  }

  return formatRelativeTimeCompact(iso, now)
}

export function formatAdminListingExpiresAt(
  iso: string,
  displayStatus: AdminListingDisplayStatus,
  now = Date.now(),
): string | null {
  if (
    displayStatus === ADMIN_LISTING_DISPLAY_STATUS.COMPLETED ||
    displayStatus === ADMIN_LISTING_DISPLAY_STATUS.EXPIRED
  ) {
    return null
  }

  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return null

  const nowDate = new Date(now)
  const time = formatPickupByTime(iso)

  if (isSameCalendarDay(date, nowDate)) {
    return time ? `Today ${time}` : null
  }

  if (isYesterday(date, nowDate)) {
    return time ? `Yesterday ${time}` : 'Yesterday'
  }

  const day = date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  })

  return time ? `${day} ${time}` : day
}
