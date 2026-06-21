import { EXPORT_NULL_LABEL } from '../../constants/export-brand'
import { exportContent } from '../../placeholder/export-content'

export function formatExportDate(date = new Date()): string {
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function formatExportDateStamp(date = new Date()): string {
  return date.toISOString().slice(0, 10)
}

export function formatExportMonthStamp(date = new Date()): string {
  return date.toISOString().slice(0, 7)
}

export function slugifyForFilename(value: string): string {
  const slug = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

  return slug || 'organisation'
}

export function formatExportNumber(
  value: number | null | undefined,
  nullLabel: string = EXPORT_NULL_LABEL,
): string {
  if (value === null || value === undefined) {
    return nullLabel
  }

  return value.toLocaleString()
}

export function formatExportPercent(
  value: number | null | undefined,
  nullLabel: string = EXPORT_NULL_LABEL,
): string {
  if (value === null || value === undefined) {
    return nullLabel
  }

  const sign = value > 0 ? '+' : ''
  return `${sign}${value}%`
}

export function formatExportSignedDelta(
  value: number,
  suffix: string,
): string {
  const sign = value >= 0 ? '+' : ''
  return `${sign}${value.toLocaleString()} ${suffix}`
}

export function hasAdminReportsExportData(
  reports: {
    stats: {
      mealsRedistributed: { total: number }
      wastePreventedKg: number
      completedTransfers: number
    }
    mealsByDayOfWeek: { meals: number }[]
    listingsByFoodType: { count: number }[]
    topDonors: unknown[]
    mostServedNgos: unknown[]
  },
): boolean {
  if (reports.stats.completedTransfers > 0) {
    return true
  }

  if (reports.stats.mealsRedistributed.total > 0) {
    return true
  }

  if (reports.stats.wastePreventedKg > 0) {
    return true
  }

  if (reports.mealsByDayOfWeek.some((row) => row.meals > 0)) {
    return true
  }

  if (reports.listingsByFoodType.some((row) => row.count > 0)) {
    return true
  }

  if (reports.topDonors.length > 0 || reports.mostServedNgos.length > 0) {
    return true
  }

  return false
}

export function adminReportsEmptyMessage(): string {
  return exportContent.disabledNoData
}
