export type CalendarMonthRange = {
  start: Date
  end: Date
}

/** Inclusive start, exclusive end — calendar month relative to `reference`. */
export function getCalendarMonthRange(
  reference: Date,
  monthOffset = 0,
): CalendarMonthRange {
  const start = new Date(
    reference.getFullYear(),
    reference.getMonth() + monthOffset,
    1,
  )
  const end = new Date(
    reference.getFullYear(),
    reference.getMonth() + monthOffset + 1,
    1,
  )
  return { start, end }
}

export function computeMonthOverMonthChangePercent(
  current: number,
  previous: number,
): number | null {
  if (previous === 0) {
    return null
  }

  return Math.round(((current - previous) / previous) * 100)
}
