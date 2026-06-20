import { AlertTriangle, Upload } from 'lucide-react'
import { useRef, useState, type ChangeEvent } from 'react'
import { useNavigate } from 'react-router'
import { useAuth } from '../../auth'
import { ACCOUNT_STATUS } from '../../constants/account-status'
import { VERIFICATION_STATUS } from '../../constants/verification-status'
import {
  ACCEPTED_DOCUMENT_LABEL,
  MAX_DOCUMENT_SIZE_MB,
  validateDocumentFile,
} from '../../constants/documents'
import { resolveVerificationRoute } from '../../auth/verification-routes'
import { cn } from '../../lib/utils'
import { toast } from '../../lib/toast'
import { participantEnforcementContent } from '../../placeholder/participant-enforcement-content'
import { resubmitDocument } from '../../services/verification-service'
import { Button } from '../ui/button'

export function AccountEnforcementNotice() {
  const { state, refreshMe } = useAuth()
  const navigate = useNavigate()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (state.status !== 'authed') {
    return null
  }

  const isSuspended = state.accountStatus === ACCOUNT_STATUS.SUSPENDED
  const isRevoked = state.verificationStatus === VERIFICATION_STATUS.REVOKED

  if (!isSuspended && !isRevoked) {
    return null
  }

  const title = isRevoked
    ? participantEnforcementContent.revokedTitle
    : participantEnforcementContent.suspendedTitle
  const message = isRevoked
    ? participantEnforcementContent.revokedMessage
    : participantEnforcementContent.suspendedMessage

  const handleResubmit = async (file?: File) => {
    setIsSubmitting(true)
    try {
      await toast.promise(resubmitDocument(file), {
        loading: participantEnforcementContent.resubmitLoading,
        success: participantEnforcementContent.resubmitSuccess,
        error: participantEnforcementContent.resubmitError,
      })
      await refreshMe()
      navigate(
        resolveVerificationRoute(VERIFICATION_STATUS.PENDING, {
          role: state.user.role,
        }),
        { replace: true },
      )
    } catch {
      // Sonner handles the error toast.
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return

    const validationError = validateDocumentFile(file)
    if (validationError === 'type' || validationError === 'size') {
      toast.error(participantEnforcementContent.resubmitError)
      return
    }

    await handleResubmit(file)
  }

  return (
    <div
      role="status"
      className={cn(
        'mb-6 flex flex-col gap-4 rounded-xl border px-4 py-4',
        isRevoked
          ? 'border-rejection-card-border bg-status-rejected-bg'
          : 'border-status-pending-dot/30 bg-status-pending-bg',
      )}
    >
      <div className="flex items-start gap-3">
        <AlertTriangle
          aria-hidden="true"
          className={cn(
            'mt-0.5 size-4 shrink-0',
            isRevoked ? 'text-status-rejected-text' : 'text-status-pending-text',
          )}
        />
        <div className="min-w-0 flex-1">
          <p
            className={cn(
              'text-sm font-semibold',
              isRevoked
                ? 'text-status-rejected-text'
                : 'text-status-pending-text',
            )}
          >
            {title}
          </p>
          <p className="text-body mt-1 text-sm leading-relaxed">{message}</p>
          <p className="text-body mt-2 text-sm leading-relaxed">
            {participantEnforcementContent.editsBlockedNote}
          </p>
        </div>
      </div>

      {isRevoked ? (
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <Button
            type="button"
            disabled={isSubmitting}
            onClick={() => void handleResubmit()}
            className="w-full sm:w-auto"
          >
            {participantEnforcementContent.resubmitLabel}
          </Button>
          <Button
            type="button"
            variant="outline"
            disabled={isSubmitting}
            onClick={() => fileInputRef.current?.click()}
            className="w-full sm:w-auto"
          >
            <span className="inline-flex items-center gap-2">
              <Upload aria-hidden="true" className="size-4" />
              {participantEnforcementContent.resubmitWithDocumentLabel}
            </span>
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf,image/jpeg,image/png,image/webp"
            className="sr-only"
            aria-label={participantEnforcementContent.resubmitWithDocumentLabel}
            onChange={(event) => void handleFileChange(event)}
          />
          <p className="text-body text-xs sm:ml-2">
            {ACCEPTED_DOCUMENT_LABEL} · max {MAX_DOCUMENT_SIZE_MB} MB
          </p>
        </div>
      ) : null}
    </div>
  )
}
