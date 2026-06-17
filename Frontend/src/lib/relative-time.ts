export function hoursAgoFromIso(iso: string, now = Date.now()): number {
  const then = new Date(iso).getTime()
  if (Number.isNaN(then)) return 0
  return Math.max(0, Math.floor((now - then) / (60 * 60 * 1000)))
}

export function minutesAgoFromIso(iso: string, now = Date.now()): number {
  const then = new Date(iso).getTime()
  if (Number.isNaN(then)) return 0
  return Math.max(0, Math.floor((now - then) / (60 * 1000)))
}

export function formatRelativeMinutes(minutes: number): string {
  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes} mins ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

export function formatActivityTimestamp(iso: string): string {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return ''

  const now = new Date()
  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear()

  const time = date.toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: '2-digit',
  })

  if (isToday) return `Today, ${time}`

  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}
