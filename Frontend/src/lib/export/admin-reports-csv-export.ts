import type { AdminReportsData } from '../../types/admin-reports'
import { exportContent } from '../../placeholder/export-content'
import {
  formatExportDateStamp,
  formatExportNumber,
  formatExportPercent,
} from './export-format'
import { buildCsvRows, downloadCsv } from './csv-export'

function appendSectionHeader(
  rows: (string | number)[][],
  title: string,
): void {
  rows.push([])
  rows.push([title])
}

export function exportAdminReportsCsv(reports: AdminReportsData): void {
  const rows: (string | number)[][] = []
  const { stats } = reports

  appendSectionHeader(rows, exportContent.adminCsv.sections.stats)
  rows.push([
    exportContent.adminCsv.columns.metric,
    exportContent.adminCsv.columns.value,
  ])
  rows.push([
    exportContent.adminCsv.stats.mealsTotal,
    stats.mealsRedistributed.total,
  ])
  rows.push([
    exportContent.adminCsv.stats.mealsMom,
    formatExportPercent(stats.mealsRedistributed.monthOverMonthChangePercent),
  ])
  rows.push([
    exportContent.adminCsv.stats.wasteKg,
    stats.wastePreventedKg,
  ])
  rows.push([
    exportContent.adminCsv.stats.completedTransfers,
    stats.completedTransfers,
  ])
  rows.push([
    exportContent.adminCsv.stats.avgMatchTime,
    formatExportNumber(stats.averageMatchTimeMinutes),
  ])
  rows.push([
    exportContent.adminCsv.stats.avgMatchTimeWindow,
    stats.averageMatchTimeRollingDays,
  ])

  appendSectionHeader(rows, exportContent.adminCsv.sections.mealsByDay)
  rows.push([
    exportContent.adminCsv.columns.day,
    exportContent.adminCsv.columns.meals,
  ])
  for (const row of reports.mealsByDayOfWeek) {
    rows.push([row.day, row.meals])
  }

  appendSectionHeader(rows, exportContent.adminCsv.sections.foodType)
  rows.push([
    exportContent.adminCsv.columns.foodType,
    exportContent.adminCsv.columns.count,
  ])
  if (reports.listingsByFoodType.length === 0) {
    rows.push([exportContent.adminPdf.tables.foodType.empty, exportContent.nullLabel])
  } else {
    for (const row of reports.listingsByFoodType) {
      rows.push([row.label, row.count])
    }
  }

  appendSectionHeader(rows, exportContent.adminCsv.sections.topDonors)
  rows.push([
    exportContent.adminCsv.columns.organisation,
    exportContent.adminCsv.columns.transfers,
  ])
  if (reports.topDonors.length === 0) {
    rows.push([exportContent.adminPdf.tables.topDonors.empty, exportContent.nullLabel])
  } else {
    for (const row of reports.topDonors) {
      rows.push([
        row.organisationName,
        formatExportNumber(row.transfers ?? null),
      ])
    }
  }

  appendSectionHeader(rows, exportContent.adminCsv.sections.topNgos)
  rows.push([
    exportContent.adminCsv.columns.organisation,
    exportContent.adminCsv.columns.pickups,
  ])
  if (reports.mostServedNgos.length === 0) {
    rows.push([exportContent.adminPdf.tables.topNgos.empty, exportContent.nullLabel])
  } else {
    for (const row of reports.mostServedNgos) {
      rows.push([
        row.organisationName,
        formatExportNumber(row.pickups ?? null),
      ])
    }
  }

  const csv = buildCsvRows(rows)
  const filename = exportContent.filenames.adminReportsCsv(
    formatExportDateStamp(),
  )
  downloadCsv(csv, filename)
}
