import { FileSpreadsheet, FileText } from 'lucide-react'
import { adminReportsContent } from '../../placeholder/admin-reports-content'
import { toast } from '../../lib/toast'
import { Button } from '../ui/button'

export function AdminReportsHeaderActions() {
  const handleExport = () => {
    toast.info(adminReportsContent.exports.deferredToast)
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
        onClick={handleExport}
      >
        <FileSpreadsheet aria-hidden="true" className="size-4" />
        {adminReportsContent.exports.csv}
      </Button>
      <Button
        type="button"
        variant="outline"
        className="gap-2"
        aria-label={adminReportsContent.exports.pdfAria}
        onClick={handleExport}
      >
        <FileText aria-hidden="true" className="size-4" />
        {adminReportsContent.exports.pdf}
      </Button>
    </div>
  )
}
