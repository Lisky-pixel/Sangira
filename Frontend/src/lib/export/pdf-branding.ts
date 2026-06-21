import { jsPDF } from 'jspdf'
import { EXPORT_BRAND } from '../../constants/export-brand'
import { exportContent } from '../../placeholder/export-content'
import { formatExportDate } from './export-format'

const PAGE_MARGIN_X = 14
const PAGE_WIDTH = 210
const PAGE_HEIGHT = 297

export function createBrandedPdf(): jsPDF {
  return new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  })
}

type PdfHeaderInput = {
  doc: jsPDF
  documentTitle: string
  subtitleLines?: string[]
  generatedAt?: Date
}

export function drawPdfHeader({
  doc,
  documentTitle,
  subtitleLines = [],
  generatedAt = new Date(),
}: PdfHeaderInput): number {
  let y = 18

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(20)
  doc.setTextColor(...EXPORT_BRAND.PRIMARY_RGB)
  doc.text(exportContent.brandName, PAGE_MARGIN_X, y)

  y += 8
  doc.setFontSize(14)
  doc.setTextColor(...EXPORT_BRAND.CHARCOAL_RGB)
  doc.text(documentTitle, PAGE_MARGIN_X, y)

  y += 7
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.setTextColor(...EXPORT_BRAND.BODY_RGB)

  for (const line of subtitleLines) {
    y += 5
    doc.text(line, PAGE_MARGIN_X, y)
  }

  y += 5
  doc.text(`Generated ${formatExportDate(generatedAt)}`, PAGE_MARGIN_X, y)

  return y + 6
}

type StatItem = {
  label: string
  value: string
  detail?: string
}

export function drawPdfStatGrid(
  doc: jsPDF,
  startY: number,
  stats: StatItem[],
): number {
  const columnWidth = (PAGE_WIDTH - PAGE_MARGIN_X * 2) / 2
  let y = startY

  doc.setDrawColor(...EXPORT_BRAND.BORDER_RGB)
  doc.setLineWidth(0.2)
  doc.line(PAGE_MARGIN_X, y, PAGE_WIDTH - PAGE_MARGIN_X, y)
  y += 6

  stats.forEach((stat, index) => {
    const column = index % 2
    const row = Math.floor(index / 2)
    const x = PAGE_MARGIN_X + column * columnWidth
    const rowY = y + row * 16

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8)
    doc.setTextColor(...EXPORT_BRAND.BODY_RGB)
    doc.text(stat.label, x, rowY)

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(11)
    doc.setTextColor(...EXPORT_BRAND.CHARCOAL_RGB)
    doc.text(stat.value, x, rowY + 5)

    if (stat.detail) {
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(8)
      doc.setTextColor(...EXPORT_BRAND.PRIMARY_RGB)
      doc.text(stat.detail, x, rowY + 10)
    }
  })

  const rows = Math.ceil(stats.length / 2)
  return y + rows * 16 + 4
}

export function drawPdfSectionTitle(
  doc: jsPDF,
  y: number,
  title: string,
): number {
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(10)
  doc.setTextColor(...EXPORT_BRAND.CHARCOAL_RGB)
  doc.text(title, PAGE_MARGIN_X, y)
  return y + 4
}

export function drawPdfFooter(doc: jsPDF, generatedAt = new Date()): void {
  const footerY = PAGE_HEIGHT - 12

  doc.setDrawColor(...EXPORT_BRAND.BORDER_RGB)
  doc.setLineWidth(0.2)
  doc.line(PAGE_MARGIN_X, footerY - 4, PAGE_WIDTH - PAGE_MARGIN_X, footerY - 4)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8)
  doc.setTextColor(...EXPORT_BRAND.BODY_RGB)
  doc.text(
    exportContent.generatedOnWithEmail(formatExportDate(generatedAt)),
    PAGE_MARGIN_X,
    footerY,
  )
}

export { PAGE_MARGIN_X, PAGE_WIDTH, PAGE_HEIGHT }
