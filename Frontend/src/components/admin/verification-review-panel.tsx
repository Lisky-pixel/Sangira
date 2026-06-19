import * as Dialog from '@radix-ui/react-dialog'
import { AlertTriangle, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import {
  VERIFICATION_ERROR_CODES,
  VERIFICATION_WAITING_URGENT_HOURS,
} from '../../constants/admin-verification'
import { VERIFICATION_STATUS } from '../../constants/verification-status'
import { formatSubmittedDateTime } from '../../lib/format-verification-date'
import { maskPhoneForDisplay } from '../../lib/profile-format'
import {
  formatRelativeTimeCompact,
  getWaitingHours,
} from '../../lib/relative-time'
import { toast } from '../../lib/toast'
import { cn } from '../../lib/utils'
import { adminVerificationContent } from '../../placeholder/admin-verification-content'
import { adminPortalContent } from '../../placeholder/admin-portal-content'
import { ApiError } from '../../services/api-error'
import { adminPortalService } from '../../services/admin-portal-service'
import type {
  DuplicateCheckResult,
  VerificationDetail,
} from '../../types/admin-verification'
import { Button } from '../ui/button'
import { InfoBanner } from '../ui/info-banner'
import { VerificationDocumentViewer } from './verification-document-viewer'
import { VerificationRejectModal } from './verification-reject-modal'
import { VerificationRoleChip } from './verification-role-chip'

type VerificationReviewPanelProps = {
  applicationId: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onDecision: (detail: VerificationDetail) => void
}

function resolveDuplicateBannerMessage(
  duplicateCheck: DuplicateCheckResult,
): { variant: 'info' | 'warning'; message: string } {
  const { duplicateCheck: copy } = adminVerificationContent.reviewPanel

  if (!duplicateCheck.hasDuplicates) {
    return { variant: 'info', message: copy.none }
  }

  const phone = duplicateCheck.phoneClash?.organisationName
  const reg = duplicateCheck.registrationNumberClash?.organisationName

  if (phone && reg) {
    return {
      variant: 'warning',
      message: copy.bothClash(phone, reg),
    }
  }

  if (phone) {
    return { variant: 'warning', message: copy.phoneClash(phone) }
  }

  if (reg) {
    return { variant: 'warning', message: copy.registrationClash(reg) }
  }

  return { variant: 'info', message: copy.none }
}

function DuplicateCheckBanner({
  duplicateCheck,
}: {
  duplicateCheck: DuplicateCheckResult
}) {
  const { variant, message } = resolveDuplicateBannerMessage(duplicateCheck)

  if (variant === 'warning') {
    return (
      <div className="bg-status-pending-bg flex items-start gap-3 rounded-lg p-4">
        <AlertTriangle
          aria-hidden="true"
          className="text-status-pending-text mt-0.5 size-4 shrink-0"
        />
        <p className="text-status-pending-text text-sm leading-relaxed">
          {message}
        </p>
      </div>
    )
  }

  return <InfoBanner variant="info">{message}</InfoBanner>
}

export function VerificationReviewPanel({
  applicationId,
  open,
  onOpenChange,
  onDecision,
}: VerificationReviewPanelProps) {
  const [detail, setDetail] = useState<VerificationDetail | null>(null)
  const [loadState, setLoadState] = useState<'idle' | 'loading' | 'ready' | 'error'>(
    'idle',
  )
  const [approveConfirmOpen, setApproveConfirmOpen] = useState(false)
  const [rejectOpen, setRejectOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!open || !applicationId) {
      return
    }

    let cancelled = false

    const load = async () => {
      setLoadState('loading')
      try {
        const application = await adminPortalService.getVerificationDetail(
          applicationId,
        )
        if (cancelled) return
        setDetail(application)
        setLoadState('ready')
      } catch {
        if (!cancelled) {
          setDetail(null)
          setLoadState('error')
        }
      }
    }

    void load()

    return () => {
      cancelled = true
    }
  }, [open, applicationId])

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      setDetail(null)
      setLoadState('idle')
      setApproveConfirmOpen(false)
      setRejectOpen(false)
    }
    onOpenChange(nextOpen)
  }

  const resolveReadOnlyDecisionMessage = (application: VerificationDetail) => {
    const { reviewPanel } = adminVerificationContent
    const reviewer =
      application.review?.reviewedByName?.trim() ||
      adminPortalContent.identity.roleLabel
    const reviewedAt = application.review?.reviewedAt
      ? formatSubmittedDateTime(application.review.reviewedAt)
      : '—'

    if (application.status === VERIFICATION_STATUS.APPROVED) {
      return reviewPanel.readOnlyApproved(reviewer, reviewedAt)
    }

    return reviewPanel.readOnlyRejected(
      reviewer,
      reviewedAt,
      application.review?.reason,
    )
  }

  const handleConflict = (error: unknown) => {
    if (
      error instanceof ApiError &&
      error.code === VERIFICATION_ERROR_CODES.ALREADY_HANDLED
    ) {
      toast.error(adminVerificationContent.toast.conflict(error.message))
      if (applicationId && open) {
        void adminPortalService.getVerificationDetail(applicationId).then(
          (application) => {
            setDetail(application)
            setLoadState('ready')
          },
          () => {
            setLoadState('error')
          },
        )
      }
      return true
    }
    return false
  }

  const handleApprove = async () => {
    if (!applicationId || !detail) return

    setSubmitting(true)
    try {
      const application =
        await adminPortalService.approveVerification(applicationId)
      toast.success(
        adminVerificationContent.toast.approved(detail.organisationName),
      )
      onDecision(application)
      onOpenChange(false)
    } catch (error) {
      if (!handleConflict(error)) {
        toast.error(adminVerificationContent.toast.approveError)
      }
    } finally {
      setSubmitting(false)
      setApproveConfirmOpen(false)
    }
  }

  const handleReject = async (payload: {
    reasonCode: import('../../constants/verification-reject-reasons').VerificationRejectReasonCode
    details?: string
  }) => {
    if (!applicationId || !detail) return

    setSubmitting(true)
    try {
      const application = await adminPortalService.rejectVerification(
        applicationId,
        payload,
      )
      toast.success(
        adminVerificationContent.toast.rejected(detail.organisationName),
      )
      onDecision(application)
      onOpenChange(false)
      setRejectOpen(false)
    } catch (error) {
      if (!handleConflict(error)) {
        toast.error(adminVerificationContent.toast.rejectError)
      }
    } finally {
      setSubmitting(false)
    }
  }

  const { reviewPanel } = adminVerificationContent
  const isPending = detail?.status === VERIFICATION_STATUS.PENDING
  const canAct = isPending && loadState === 'ready'
  const waitingLabel = detail
    ? formatRelativeTimeCompact(detail.waitingSince)
    : ''
  const isUrgent = detail
    ? getWaitingHours(detail.waitingSince) >= VERIFICATION_WAITING_URGENT_HOURS
    : false
  const reviewedAtLabel = detail?.review?.reviewedAt
    ? formatSubmittedDateTime(detail.review.reviewedAt)
    : null

  return (
    <>
      <Dialog.Root open={open} onOpenChange={handleOpenChange}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-40 bg-charcoal/30" />
          <Dialog.Content className="border-border fixed inset-y-0 right-0 z-50 flex w-full max-w-xl flex-col border-l bg-white shadow-xl focus:outline-none sm:max-w-2xl">
            <div className="flex items-start justify-between gap-4 border-b px-5 py-5">
              <div className="min-w-0">
                {detail ? (
                  <div className="flex flex-wrap items-center gap-2">
                    <Dialog.Title className="text-charcoal truncate text-lg font-semibold">
                      {detail.organisationName}
                    </Dialog.Title>
                    <VerificationRoleChip role={detail.role} />
                  </div>
                ) : (
                  <Dialog.Title className="text-charcoal text-lg font-semibold">
                    {reviewPanel.loadError}
                  </Dialog.Title>
                )}
                {detail ? (
                  <p className="text-body mt-1 text-sm">
                    Submitted {formatSubmittedDateTime(detail.submittedAt)}
                    {isPending ? (
                      <>
                        {' · '}
                        <span
                          className={cn(
                            isUrgent && 'text-clay-red font-medium',
                          )}
                        >
                          waiting {waitingLabel}
                        </span>
                      </>
                    ) : reviewedAtLabel ? (
                      <> · {reviewPanel.reviewedHeader(reviewedAtLabel)}</>
                    ) : null}
                  </p>
                ) : null}
              </div>
              <Dialog.Close asChild>
                <button
                  type="button"
                  aria-label={reviewPanel.closeAria}
                  className="text-body hover:text-charcoal shrink-0 rounded-md p-1"
                >
                  <X aria-hidden="true" className="size-5" />
                </button>
              </Dialog.Close>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-5">
              {loadState === 'loading' ? (
                <p className="text-body text-sm">{adminVerificationContent.loading}</p>
              ) : loadState === 'error' ? (
                <p className="text-clay-red text-sm">{reviewPanel.loadError}</p>
              ) : detail ? (
                <div className="flex flex-col gap-6">
                  <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <dt className="text-body text-xs font-semibold tracking-wide uppercase">
                        {reviewPanel.fields.contactPerson}
                      </dt>
                      <dd className="text-charcoal mt-1 text-sm">
                        {detail.contactName}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-body text-xs font-semibold tracking-wide uppercase">
                        {reviewPanel.fields.phone}
                      </dt>
                      <dd className="text-charcoal mt-1 text-sm">
                        {maskPhoneForDisplay(detail.phone) || detail.phone}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-body text-xs font-semibold tracking-wide uppercase">
                        {reviewPanel.fields.email}
                      </dt>
                      <dd className="text-charcoal mt-1 text-sm">
                        <a
                          href={`mailto:${detail.email}`}
                          className="text-primary hover:underline"
                        >
                          {detail.email}
                        </a>
                      </dd>
                    </div>
                    {detail.registrationNumber ? (
                      <div>
                        <dt className="text-body text-xs font-semibold tracking-wide uppercase">
                          {reviewPanel.fields.registrationNumber}
                        </dt>
                        <dd className="text-charcoal mt-1 text-sm">
                          {detail.registrationNumber}
                        </dd>
                      </div>
                    ) : null}
                    {typeof detail.dailyCapacity === 'number' ? (
                      <div>
                        <dt className="text-body text-xs font-semibold tracking-wide uppercase">
                          {reviewPanel.fields.dailyCapacity}
                        </dt>
                        <dd className="text-charcoal mt-1 text-sm">
                          {reviewPanel.dailyCapacityValue(detail.dailyCapacity)}
                        </dd>
                      </div>
                    ) : null}
                    {detail.transportLabel ? (
                      <div>
                        <dt className="text-body text-xs font-semibold tracking-wide uppercase">
                          {reviewPanel.fields.transport}
                        </dt>
                        <dd className="text-charcoal mt-1 text-sm">
                          {detail.transportLabel}
                        </dd>
                      </div>
                    ) : null}
                  </dl>

                  <VerificationDocumentViewer
                    applicationId={detail.id}
                    document={detail.document}
                  />

                  <DuplicateCheckBanner duplicateCheck={detail.duplicateCheck} />

                  {!isPending ? (
                    <InfoBanner variant="neutral">
                      {resolveReadOnlyDecisionMessage(detail)}
                    </InfoBanner>
                  ) : null}
                </div>
              ) : null}
            </div>

            <div className="border-border border-t px-5 py-5">
              {!isPending && detail ? (
                <p className="text-body text-center text-sm">
                  {resolveReadOnlyDecisionMessage(detail)}
                </p>
              ) : approveConfirmOpen ? (
                <div className="flex flex-col gap-3">
                  <p className="text-charcoal text-sm font-medium">
                    {reviewPanel.approveConfirm.title}
                  </p>
                  <p className="text-body text-sm">
                    {detail
                      ? reviewPanel.approveConfirm.description(
                          detail.organisationName,
                        )
                      : null}
                  </p>
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <Button
                      type="button"
                      disabled={submitting}
                      onClick={() => void handleApprove()}
                      className="flex-1"
                    >
                      {reviewPanel.approveConfirm.confirm}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      disabled={submitting}
                      onClick={() => setApproveConfirmOpen(false)}
                      className="flex-1"
                    >
                      {reviewPanel.approveConfirm.cancel}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <Button
                    type="button"
                    disabled={!canAct || submitting}
                    onClick={() => setApproveConfirmOpen(true)}
                    className="w-full"
                  >
                    {reviewPanel.approve}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    disabled={!canAct || submitting}
                    onClick={() => setRejectOpen(true)}
                    className="border-clay-red text-clay-red hover:bg-clay-red/5 w-full"
                  >
                    {reviewPanel.reject}
                  </Button>
                  <p className="text-body text-center text-xs">
                    {reviewPanel.footerMicrocopy}
                  </p>
                </div>
              )}
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {detail ? (
        <VerificationRejectModal
          open={rejectOpen}
          onOpenChange={setRejectOpen}
          organisationName={detail.organisationName}
          submitting={submitting}
          onSubmit={(payload) => void handleReject(payload)}
        />
      ) : null}
    </>
  )
}
