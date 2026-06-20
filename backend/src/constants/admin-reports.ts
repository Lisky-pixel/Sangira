export const ADMIN_REPORTS = {
  TOP_DONORS_LIMIT: 3,
  TOP_NGOS_LIMIT: 3,
  PAGE_SIZE: 20,
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 50,
  ROLLING_MATCH_DAYS: 7,
  MS_PER_MINUTE: 60_000,
} as const

export const ADMIN_REPORTS_WEEKDAY = {
  MON: 'Mon',
  TUE: 'Tue',
  WED: 'Wed',
  THU: 'Thu',
  FRI: 'Fri',
  SAT: 'Sat',
  SUN: 'Sun',
} as const

export type AdminReportsWeekday =
  (typeof ADMIN_REPORTS_WEEKDAY)[keyof typeof ADMIN_REPORTS_WEEKDAY]

/** ISO weekday order for charts — Mon through Sun. */
export const ADMIN_REPORTS_WEEKDAY_ORDER: readonly AdminReportsWeekday[] = [
  ADMIN_REPORTS_WEEKDAY.MON,
  ADMIN_REPORTS_WEEKDAY.TUE,
  ADMIN_REPORTS_WEEKDAY.WED,
  ADMIN_REPORTS_WEEKDAY.THU,
  ADMIN_REPORTS_WEEKDAY.FRI,
  ADMIN_REPORTS_WEEKDAY.SAT,
  ADMIN_REPORTS_WEEKDAY.SUN,
] as const
