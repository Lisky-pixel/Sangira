export function formatPickupByTime(iso: string) {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) {
    return ''
  }

  return date.toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: '2-digit',
  })
}

export function formatCompletedLabel(iso: string, now = Date.now()) {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) {
    return ''
  }

  const today = new Date(now)
  const yesterday = new Date(now)
  yesterday.setDate(yesterday.getDate() - 1)

  const isYesterday =
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear()

  if (isYesterday) {
    return 'yesterday'
  }

  const isToday =
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()

  if (isToday) {
    return 'today'
  }

  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  })
}

export function formatPickupDeadline(expiresAt: string, now = Date.now()) {
  const time = formatPickupByTime(expiresAt)
  if (!time) {
    return 'Pickup deadline unavailable.'
  }

  const dayLabel = formatCompletedLabel(expiresAt, now)

  if (dayLabel === 'today') {
    return `Pickup by ${time} today.`
  }

  if (dayLabel === 'yesterday') {
    return `Pickup by ${time} yesterday.`
  }

  return `Pickup by ${time} ${dayLabel}.`
}

export function formatMemberSince(iso: string) {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) {
    return ''
  }

  return date.toLocaleDateString(undefined, {
    month: 'long',
    year: 'numeric',
  })
}
