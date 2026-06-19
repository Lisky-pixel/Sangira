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

/**
 * Formats an ISO timestamp into a human-friendly relative label.
 * Rolls up: minutes → hours → days → short date.
 */
export function formatRelativeTime(iso: string, now = Date.now()): string {
  const thenMs = new Date(iso).getTime()
  if (Number.isNaN(thenMs)) return ''

  const diffMs = Math.max(0, now - thenMs)
  const minutes = Math.floor(diffMs / (60 * 1000))

  if (minutes < 1) return 'Just now'

  if (minutes < 60) {
    return minutes === 1 ? '1 min ago' : `${minutes} mins ago`
  }

  const hours = Math.floor(minutes / 60)
  if (hours < 24) {
    return hours === 1 ? '1 hour ago' : `${hours} hours ago`
  }

  const thenDate = new Date(thenMs)
  const nowDate = new Date(now)

  if (isYesterday(thenDate, nowDate)) return 'Yesterday'

  const days = Math.floor(hours / 24)
  if (days < 7) {
    return days === 1 ? '1 day ago' : `${days} days ago`
  }

  return thenDate.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  })
}
