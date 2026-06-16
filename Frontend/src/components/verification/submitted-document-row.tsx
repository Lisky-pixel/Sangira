import { Eye, FileText } from 'lucide-react'
import type { UserRole } from '../../constants/registration-roles'
import {
  displayFilename,
  type VerificationDocumentLike,
} from '../../lib/display-filename'
import { formatUploadedDate } from '../../lib/format-uploaded-date'
import { pendingVerificationContent } from '../../placeholder/pending-verification-content'
import { cn } from '../../lib/utils'

type SubmittedDocumentRowProps = {
  document: VerificationDocumentLike
  role: UserRole
  uploadedPrefix?: string
  showView?: boolean
  onView?: () => void
  className?: string
}

export function SubmittedDocumentRow({
  document,
  role,
  uploadedPrefix = pendingVerificationContent.uploadedPrefix,
  showView = false,
  onView,
  className,
}: SubmittedDocumentRowProps) {
  const filename = displayFilename(document, role)
  const formattedDate = document.uploadedAt
    ? formatUploadedDate(document.uploadedAt)
    : ''
  const uploadedLabel = formattedDate
    ? `${uploadedPrefix} ${formattedDate}`
    : null

  return (
    <div
      className={cn(
        'bg-sand flex items-center justify-between gap-3 rounded-lg px-4 py-3',
        className,
      )}
    >
      <div className="flex min-w-0 items-start gap-3">
        <FileText
          aria-hidden="true"
          className="text-stat mt-0.5 size-5 shrink-0"
        />
        <div className="min-w-0">
          <p className="text-charcoal truncate text-sm font-medium">{filename}</p>
          {uploadedLabel ? (
            <p className="text-body text-xs">{uploadedLabel}</p>
          ) : null}
        </div>
      </div>

      {showView && onView ? (
        <button
          type="button"
          onClick={onView}
          className="text-body hover:text-primary flex size-11 shrink-0 items-center justify-center rounded-md transition-colors"
          aria-label="View document"
        >
          <Eye aria-hidden="true" className="size-5" />
        </button>
      ) : null}
    </div>
  )
}

type SubmittedDocumentFallbackProps = {
  message?: string
}

export function SubmittedDocumentFallback({
  message = pendingVerificationContent.documentSubmittedFallback,
}: SubmittedDocumentFallbackProps) {
  return (
    <div className="bg-sand flex items-start gap-3 rounded-lg px-4 py-3">
      <FileText
        aria-hidden="true"
        className="text-stat mt-0.5 size-5 shrink-0"
      />
      <p className="text-charcoal text-sm font-medium">{message}</p>
    </div>
  )
}
