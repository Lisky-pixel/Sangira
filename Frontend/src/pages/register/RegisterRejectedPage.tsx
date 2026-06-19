import { MessageCircle, Upload } from 'lucide-react'
import { useRef, useState } from 'react'
import { Footer } from '../../components/layout/footer'
import { HeaderMinimal } from '../../components/layout/header-minimal'
import { StatusChip } from '../../components/ui/status-chip'
import { Button, ButtonLink } from '../../components/ui/button'
import { FileDropzone } from '../../components/ui/file-dropzone'
import { RejectionReasonBlock } from '../../components/verification/rejection-reason-block'
import {
  SubmittedDocumentFallback,
  SubmittedDocumentRow,
} from '../../components/verification/submitted-document-row'
import { VerificationBanner } from '../../components/verification/verification-banner'
import { ENABLE_DOCUMENT_VIEW } from '../../constants/rejected-verification'
import { SUPPORT } from '../../constants/pending-verification'
import {
  ACCEPTED_DOCUMENT_LABEL,
  MAX_DOCUMENT_SIZE_MB,
  validateDocumentFile,
} from '../../constants/documents'
import { isUserRole } from '../../constants/registration-roles'
import { useAuth } from '../../auth'
import {
  getLatestVerificationDocument,
  getVerificationReason,
  stateIsAuthed,
} from '../../lib/verification-user'
import { rejectedVerificationContent } from '../../placeholder/rejected-verification-content'
import { toast } from '../../lib/toast'
import {
  resubmitDocument,
  viewVerificationDocument,
} from '../../services/verification-service'

export function RegisterRejectedPage() {
  const { state, logout, refreshMe } = useAuth()
  const [showDropzone, setShowDropzone] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  if (!stateIsAuthed(state)) {
    return null
  }

  const { user } = state
  const role = isUserRole(user.role) ? user.role : 'donor'
  const latestDocument = getLatestVerificationDocument(user)
  const rejectionReason = getVerificationReason(user)

  const handleViewDocument = () => {
    void viewVerificationDocument().catch(() => {
      toast.error(rejectedVerificationContent.viewDocumentError)
    })
  }

  const handleFileAccepted = async (file: File) => {
    const validationError = validateDocumentFile(file)

    if (validationError === 'type') {
      toast.error(
        rejectedVerificationContent.validation.invalidType(
          ACCEPTED_DOCUMENT_LABEL,
        ),
      )
      return
    }

    if (validationError === 'size') {
      toast.error(
        rejectedVerificationContent.validation.tooLarge(MAX_DOCUMENT_SIZE_MB),
      )
      return
    }

    setIsSubmitting(true)

    try {
      await toast.promise(resubmitDocument(file), {
        loading: rejectedVerificationContent.resubmit.loading,
        success: rejectedVerificationContent.resubmit.success,
        error: rejectedVerificationContent.resubmit.error,
      })

      setShowDropzone(false)
      await refreshMe()
    } catch {
      // Sonner handles the error toast.
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-cream flex min-h-screen flex-col font-sans">
      <HeaderMinimal variant="authed" onSignOut={() => void logout()} />

      <main className="mx-auto flex w-full max-w-lg flex-1 flex-col px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <VerificationBanner variant="rejected" className="mb-8" />

        <div className="text-center">
          <h1 className="text-charcoal font-display text-2xl font-bold sm:text-3xl">
            {rejectedVerificationContent.heading}
          </h1>
          <p className="text-body mx-auto mt-4 max-w-md text-sm leading-relaxed sm:text-base">
            {rejectedVerificationContent.subcopy}
          </p>
        </div>

        <div className="border-rejection-card-border mt-8 rounded-2xl border bg-white p-5 shadow-sm sm:p-6">
          <StatusChip status="rejected" className="mb-4" />

          <RejectionReasonBlock reason={rejectionReason} />

          <div className="mt-4">
            {latestDocument ? (
              <SubmittedDocumentRow
                document={latestDocument}
                role={role}
                uploadedPrefix={rejectedVerificationContent.uploadedPrefix}
                showView={ENABLE_DOCUMENT_VIEW}
                onView={handleViewDocument}
              />
            ) : (
              <SubmittedDocumentFallback
                message={rejectedVerificationContent.documentSubmittedFallback}
              />
            )}
          </div>

          <Button
            type="button"
            size="lg"
            className="mt-6 w-full"
            disabled={isSubmitting}
            onClick={() => setShowDropzone(true)}
          >
            <span className="inline-flex items-center gap-2">
              <Upload aria-hidden="true" className="size-4" />
              {rejectedVerificationContent.resubmitLabel}
            </span>
          </Button>

          {showDropzone ? (
            <FileDropzone
              inputRef={fileInputRef}
              className="mt-4"
              onFileAccepted={(file) => void handleFileAccepted(file)}
              promptText={rejectedVerificationContent.dropzone.prompt}
              hintText={rejectedVerificationContent.dropzone.hint(
                ACCEPTED_DOCUMENT_LABEL,
                MAX_DOCUMENT_SIZE_MB,
              )}
            />
          ) : null}
        </div>

        <ButtonLink
          href={SUPPORT.href}
          variant="outline"
          size="lg"
          className="mt-6 w-full"
        >
          <span className="inline-flex items-center gap-2">
            <MessageCircle aria-hidden="true" className="size-4" />
            {rejectedVerificationContent.contactSupportLabel}
          </span>
        </ButtonLink>
      </main>

      <Footer />
    </div>
  )
}
