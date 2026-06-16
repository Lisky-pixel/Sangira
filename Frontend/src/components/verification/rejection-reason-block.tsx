import { AlertTriangle } from 'lucide-react'
import { rejectedVerificationContent } from '../../placeholder/rejected-verification-content'

type RejectionReasonBlockProps = {
  reason?: string
}

export function RejectionReasonBlock({ reason }: RejectionReasonBlockProps) {
  const displayReason =
    reason?.trim() || rejectedVerificationContent.reasonFallback

  return (
    <div className="border-rejection-card-border bg-status-rejected-bg/40 flex gap-3 rounded-lg border px-4 py-3">
      <AlertTriangle
        aria-hidden="true"
        className="text-clay-red mt-0.5 size-5 shrink-0"
      />
      <div className="min-w-0">
        <p className="text-charcoal text-sm font-semibold">
          {rejectedVerificationContent.reasonLabel}
        </p>
        <p className="text-body mt-1 text-sm leading-relaxed">{displayReason}</p>
      </div>
    </div>
  )
}
