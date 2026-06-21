import autoTable from 'jspdf-autotable'

import type { AdminReportsData } from '../../types/admin-reports'
import { exportContent } from '../../placeholder/export-content'
import {
  formatExportDateStamp,
  formatExportNumber,
  formatExportPercent,
} from './export-format'
import {
  createBrandedPdf,
  drawPdfFooter,
  drawPdfHeader,
  drawPdfSectionTitle,
  drawPdfStatGrid,
  PAGE_MARGIN_X,
  PAGE_WIDTH,
} from './pdf-branding'
import { getLastAutoTableFinalY, toTableRow } from './pdf-autotable'

export async function exportAdminReportsPdf(
  reports: AdminReportsData,
): Promise<void> {
  const generatedAt = new Date()
  const doc = createBrandedPdf()
  const { stats } = reports

  let y = drawPdfHeader({
    doc,
    documentTitle: exportContent.adminPdf.documentTitle,
    subtitleLines: [exportContent.allTime],
    generatedAt,
  })

  y = drawPdfStatGrid(doc, y, [
    {
      label: exportContent.adminPdf.stats.meals,
      value: formatExportNumber(stats.mealsRedistributed.total),
      detail: `${exportContent.adminPdf.stats.mealsMom}: ${formatExportPercent(stats.mealsRedistributed.monthOverMonthChangePercent)}`,
    },
    {
      label: exportContent.adminPdf.stats.waste,
      value: `${formatExportNumber(stats.wastePreventedKg)} kg`,
    },
    {
      label: exportContent.adminPdf.stats.transfers,
      value: formatExportNumber(stats.completedTransfers),
    },
    {
      label: exportContent.adminPdf.stats.avgMatchTime(
        stats.averageMatchTimeRollingDays,
      ),
      value:
        stats.averageMatchTimeMinutes === null
          ? exportContent.nullLabel
          : `${formatExportNumber(stats.averageMatchTimeMinutes)} min`,
    },
  ])

  const halfWidth = (PAGE_WIDTH - PAGE_MARGIN_X * 2 - 4) / 2
  const rightStart = PAGE_MARGIN_X + halfWidth + 4

  y = drawPdfSectionTitle(doc, y + 2, exportContent.adminPdf.tables.mealsByDay.title)

  autoTable(doc, {
    startY: y,
    head: [toTableRow(exportContent.adminPdf.tables.mealsByDay.headers)],
    body: reports.mealsByDayOfWeek.map((row) => [
      row.day,
      formatExportNumber(row.meals),
    ]),
    margin: { left: PAGE_MARGIN_X, right: PAGE_WIDTH - PAGE_MARGIN_X - halfWidth },
    tableWidth: halfWidth,
    theme: 'grid',
    styles: { fontSize: 8, cellPadding: 2 },
    headStyles: {
      fillColor: [27, 94, 60],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
    },
  })

  const mealsTableEnd = getLastAutoTableFinalY(doc)

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(10)
  doc.setTextColor(26, 26, 26)
  doc.text(
    exportContent.adminPdf.tables.foodType.title,
    rightStart,
    y,
  )

  autoTable(doc, {
    startY: y + 4,
    head: [toTableRow(exportContent.adminPdf.tables.foodType.headers)],
    body:
      reports.listingsByFoodType.length > 0
        ? reports.listingsByFoodType.map((row) => [
            row.label,
            formatExportNumber(row.count),
          ])
        : [[exportContent.adminPdf.tables.foodType.empty, exportContent.nullLabel]],
    margin: { left: rightStart, right: PAGE_MARGIN_X },
    tableWidth: halfWidth,
    theme: 'grid',
    styles: { fontSize: 8, cellPadding: 2 },
    headStyles: {
      fillColor: [27, 94, 60],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
    },
  })

  y = Math.max(mealsTableEnd, getLastAutoTableFinalY(doc)) + 6

  y = drawPdfSectionTitle(doc, y, exportContent.adminPdf.tables.topDonors.title)

  autoTable(doc, {
    startY: y,
    head: [toTableRow(exportContent.adminPdf.tables.topDonors.headers)],
    body:
      reports.topDonors.length > 0
        ? reports.topDonors.map((row) => [
            row.organisationName,
            formatExportNumber(row.transfers ?? null),
          ])
        : [[exportContent.adminPdf.tables.topDonors.empty, exportContent.nullLabel]],
    margin: { left: PAGE_MARGIN_X, right: PAGE_WIDTH - PAGE_MARGIN_X - halfWidth },
    tableWidth: halfWidth,
    theme: 'grid',
    styles: { fontSize: 8, cellPadding: 2 },
    headStyles: {
      fillColor: [27, 94, 60],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
    },
  })

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(10)
  doc.setTextColor(26, 26, 26)
  doc.text(exportContent.adminPdf.tables.topNgos.title, rightStart, y)

  autoTable(doc, {
    startY: y + 4,
    head: [toTableRow(exportContent.adminPdf.tables.topNgos.headers)],
    body:
      reports.mostServedNgos.length > 0
        ? reports.mostServedNgos.map((row) => [
            row.organisationName,
            formatExportNumber(row.pickups ?? null),
          ])
        : [[exportContent.adminPdf.tables.topNgos.empty, exportContent.nullLabel]],
    margin: { left: rightStart, right: PAGE_MARGIN_X },
    tableWidth: halfWidth,
    theme: 'grid',
    styles: { fontSize: 8, cellPadding: 2 },
    headStyles: {
      fillColor: [27, 94, 60],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
    },
  })

  drawPdfFooter(doc, generatedAt)

  doc.save(
    exportContent.filenames.adminReportsPdf(formatExportDateStamp(generatedAt)),
  )
}
