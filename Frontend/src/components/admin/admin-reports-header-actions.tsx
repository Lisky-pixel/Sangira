import { FileSpreadsheet, FileText } from 'lucide-react'
import {
  adminReportsEmptyMessage,
  hasAdminReportsExportData,
} from '../../lib/export/export-format'
import { exportAdminReportsCsv } from '../../lib/export/admin-reports-csv-export'
import { adminReportsContent } from '../../placeholder/admin-reports-content'
import { exportContent } from '../../placeholder/export-content'
import type { AdminReportsData } from '../../types/admin-reports'
import { toast } from '../../lib/toast'
import { Button } from '../ui/button'

type AdminReportsHeaderActionsProps = {
  reports: AdminReportsData | null
}

export function AdminReportsHeaderActions({
  reports,
}: AdminReportsHeaderActionsProps) {
  const canExport = reports ? hasAdminReportsExportData(reports) : false

  const handleCsvExport = () => {
    if (!reports) {
      return
    }

    if (!canExport) {
      toast.info(adminReportsEmptyMessage())
      return
    }

    void toast.promise(
      Promise.resolve().then(() => exportAdminReportsCsv(reports)),
      {
        loading: exportContent.toast.adminCsv.loading,
        success: exportContent.toast.adminCsv.success,
        error: exportContent.toast.adminCsv.error,
      },
    )
  }

  const handlePdfExport = () => {
    if (!reports) {
      return
    }

    if (!canExport) {
      toast.info(adminReportsEmptyMessage())
      return
    }

    void toast.promise(
      import('../../lib/export/admin-reports-pdf-export').then((module) =>
        module.exportAdminReportsPdf(reports),
      ),
      {
        loading: exportContent.toast.adminPdf.loading,
        success: exportContent.toast.adminPdf.success,
        error: exportContent.toast.adminPdf.error,
      },
    )
  }

  return (
    <div className="flex flex-wrap items-center justify-end gap-2 sm:gap-3">
      <span className="bg-sand text-body rounded-full px-4 py-2 text-sm font-medium">
        {adminReportsContent.allTimeLabel}
      </span>
      <Button
        type="button"
        variant="outline"
        className="gap-2"
        aria-label={adminReportsContent.exports.csvAria}
        disabled={!reports || !canExport}
        onClick={handleCsvExport}
      >
        <FileSpreadsheet aria-hidden="true" className="size-4" />
        {adminReportsContent.exports.csv}
      </Button>
      <Button
        type="button"
        variant="outline"
        className="gap-2"
        aria-label={adminReportsContent.exports.pdfAria}
        disabled={!reports || !canExport}
        onClick={handlePdfExport}
      >
        <FileText aria-hidden="true" className="size-4" />
        {adminReportsContent.exports.pdf}
      </Button>
    </div>
  )
}
