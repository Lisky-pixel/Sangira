import autoTable from 'jspdf-autotable'
import type { DonorImpactSummary } from '../../types/donor-impact'
import { exportContent } from '../../placeholder/export-content'
import { formatMemberMonthYear } from '../profile-format'
import {
  formatExportMonthStamp,
  formatExportNumber,
  slugifyForFilename,
} from './export-format'
import {
  createBrandedPdf,
  drawPdfFooter,
  drawPdfHeader,
  drawPdfSectionTitle,
  drawPdfStatGrid,
  PAGE_MARGIN_X,
} from './pdf-branding'
import { toTableRow } from './pdf-autotable'

type DonorImpactPdfInput = {
  organisationName: string
  impact: DonorImpactSummary
}

export async function exportDonorImpactPdf(
  input: DonorImpactPdfInput,
): Promise<void> {
  const generatedAt = new Date()
  const doc = createBrandedPdf()
  const { impact, organisationName } = input
  const memberSinceLabel = formatMemberMonthYear(impact.memberSince)

  const subtitleLines = [
    organisationName,
    ...(memberSinceLabel
      ? [exportContent.donorPdf.verifiedSince(memberSinceLabel)]
      : []),
  ]

  let y = drawPdfHeader({
    doc,
    documentTitle: exportContent.donorPdf.documentTitle,
    subtitleLines,
    generatedAt,
  })

  y = drawPdfStatGrid(doc, y, [
    {
      label: exportContent.donorPdf.stats.meals,
      value: formatExportNumber(impact.totals.mealsRedistributed),
      detail: exportContent.donorPdf.stats.mealsThisMonth(impact.thisMonth.meals),
    },
    {
      label: exportContent.donorPdf.stats.waste,
      value: `${formatExportNumber(impact.totals.wasteKgPrevented)} kg`,
      detail: exportContent.donorPdf.stats.wasteThisMonth(impact.thisMonth.wasteKg),
    },
    {
      label: exportContent.donorPdf.stats.transfers,
      value: formatExportNumber(impact.totals.completedTransfers),
    },
    {
      label: exportContent.donorPdf.stats.ngosServed,
      value: formatExportNumber(impact.totals.ngosServed),
    },
  ])

  y = drawPdfSectionTitle(doc, y + 2, exportContent.donorPdf.monthlyTable.title)

  const monthlyBody =
    impact.monthlySeries.length > 0
      ? impact.monthlySeries.map((point) => [
          point.monthLabel,
          formatExportNumber(point.meals),
        ])
      : [[exportContent.donorPdf.monthlyTable.empty, exportContent.nullLabel]]

  autoTable(doc, {
    startY: y,
    head: [toTableRow(exportContent.donorPdf.monthlyTable.headers)],
    body: monthlyBody,
    margin: { left: PAGE_MARGIN_X, right: PAGE_MARGIN_X },
    theme: 'grid',
    styles: {
      fontSize: 9,
      cellPadding: 2.5,
      textColor: [26, 26, 26],
    },
    headStyles: {
      fillColor: [27, 94, 60],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
    },
    alternateRowStyles: {
      fillColor: [236, 246, 238],
    },
  })

  drawPdfFooter(doc, generatedAt)

  const filename = exportContent.filenames.donorImpact(
    slugifyForFilename(organisationName),
    formatExportMonthStamp(generatedAt),
  )

  doc.save(filename)
}
