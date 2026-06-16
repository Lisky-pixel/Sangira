import { useNavigate } from 'react-router'
import { Footer } from '../../components/layout/footer'
import { HeaderMinimal } from '../../components/layout/header-minimal'
import { Button } from '../../components/ui/button'
import { StatusChip } from '../../components/ui/status-chip'
import { VerificationBanner } from '../../components/verification/verification-banner'
import { WhatsNextList } from '../../components/verification/whats-next-list'
import { resolvePortalRoute } from '../../constants/portal-routes'
import { isUserRole } from '../../constants/registration-roles'
import { useAuth } from '../../auth'
import { formatVerifiedDate } from '../../lib/format-verified-date'
import { markVerificationCelebrationSeen } from '../../lib/verification-celebration'
import {
  getVerificationReviewedAt,
  stateIsAuthed,
} from '../../lib/verification-user'
import {
  approvedVerificationContent,
  getApprovedWelcomeMessage,
  getWhatsNextItems,
} from '../../placeholder/approved-verification-content'

export function VerificationApprovedPage() {
  const navigate = useNavigate()
  const { state } = useAuth()

  if (!stateIsAuthed(state)) {
    return null
  }

  const { user } = state
  const role = isUserRole(user.role) ? user.role : 'donor'
  const organisationName = user.organisationName?.trim() || 'your organisation'
  const reviewedAt = getVerificationReviewedAt(user)
  const formattedReviewDate = reviewedAt
    ? formatVerifiedDate(reviewedAt)
    : ''
  const verifiedLabel = formattedReviewDate
    ? approvedVerificationContent.verifiedOn(formattedReviewDate)
    : approvedVerificationContent.verifiedFallback

  const handleGoToDashboard = () => {
    markVerificationCelebrationSeen()
    navigate(resolvePortalRoute(role), { replace: true })
  }

  return (
    <div className="bg-mint-card flex min-h-screen flex-col font-sans">
      <HeaderMinimal
        variant="help-only"
        className="border-border/60 bg-mint-card"
      />

      <main className="mx-auto flex w-full max-w-lg flex-1 flex-col px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <div className="border-border overflow-hidden rounded-2xl border bg-white shadow-sm">
          <VerificationBanner
            variant="verified"
            className="border-0 border-b"
          />

          <div className="flex flex-col p-6 sm:p-8">
            <div className="text-center">
              <StatusChip status="verified" className="mb-4" />

              <h1 className="text-charcoal font-display text-2xl font-bold sm:text-3xl">
                {approvedVerificationContent.heading}
              </h1>

              <p className="text-body mx-auto mt-4 max-w-md text-sm leading-relaxed sm:text-base">
                {getApprovedWelcomeMessage(role, organisationName)}
              </p>
            </div>

            <hr className="border-border my-8" />

            <WhatsNextList items={getWhatsNextItems(role)} />

            <p className="text-body mt-8 text-center text-sm">{verifiedLabel}</p>

            <Button
              type="button"
              size="lg"
              className="mt-6 w-full"
              onClick={handleGoToDashboard}
            >
              {approvedVerificationContent.goToDashboardLabel}
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
