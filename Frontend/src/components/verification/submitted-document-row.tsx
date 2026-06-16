import { FileText } from 'lucide-react'
import type { UserRole } from '../../constants/registration-roles'
import { displayFilename } from '../../lib/display-filename'
import { formatUploadedDate } from '../../lib/format-uploaded-date'
import { pendingVerificationContent } from '../../placeholder/pending-verification-content'
import type { VerificationDocumentLike } from '../../lib/display-filename'

type SubmittedDocumentRowProps = {
  document: VerificationDocumentLike
  role: UserRole
}

export function SubmittedDocumentRow({
  document,
  role,
}: SubmittedDocumentRowProps) {
  const filename = displayFilename(document, role)
  const formattedDate = document.uploadedAt
    ? formatUploadedDate(document.uploadedAt)
    : ''
  const uploadedLabel = formattedDate
    ? `${pendingVerificationContent.uploadedPrefix} ${formattedDate}`
    : null

  return (
    <div className="bg-sand flex items-start gap-3 rounded-lg px-4 py-3">
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
