export type DatetimePresetId = 'today_6pm' | 'tonight_10pm' | 'tomorrow_noon'

export type DatetimePreset = {
  id: DatetimePresetId
  at: Date
}

function atLocalTime(base: Date, hours: number, minutes = 0) {
  const next = new Date(base)
  next.setHours(hours, minutes, 0, 0)
  return next
}

export function buildDatetimePresets(now = new Date()): DatetimePreset[] {
  const today = new Date(now)
  const tomorrow = new Date(now)
  tomorrow.setDate(tomorrow.getDate() + 1)

  return [
    { id: 'today_6pm', at: atLocalTime(today, 18) },
    { id: 'tonight_10pm', at: atLocalTime(today, 22) },
    { id: 'tomorrow_noon', at: atLocalTime(tomorrow, 12) },
  ]
}

export function getAvailableDatetimePresets(now = new Date()) {
  return buildDatetimePresets(now).filter((preset) => preset.at.getTime() > now.getTime())
}

export function toDatetimeLocalValue(date: Date) {
  const pad = (value: number) => String(value).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}

export function formatListingExpiresAt(isoOrLocal: string) {
  const date = new Date(isoOrLocal)
  if (Number.isNaN(date.getTime())) return ''

  const now = new Date()
  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear()

  const tomorrow = new Date(now)
  tomorrow.setDate(tomorrow.getDate() + 1)
  const isTomorrow =
    date.getDate() === tomorrow.getDate() &&
    date.getMonth() === tomorrow.getMonth() &&
    date.getFullYear() === tomorrow.getFullYear()

  const time = date.toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: '2-digit',
  })

  if (isToday) return `Today, ${time}`
  if (isTomorrow) return `Tomorrow, ${time}`

  return date.toLocaleString(undefined, {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}
