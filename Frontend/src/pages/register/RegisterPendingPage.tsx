import { Footer } from '../../components/layout/footer'
import { HeaderMinimal } from '../../components/layout/header-minimal'
import { StatusChip } from '../../components/ui/status-chip'
import { ButtonLink } from '../../components/ui/button'
import {
  SubmittedDocumentFallback,
  SubmittedDocumentRow,
} from '../../components/verification/submitted-document-row'
import { VerificationBanner } from '../../components/verification/verification-banner'
import { SUPPORT } from '../../constants/pending-verification'
import { isUserRole } from '../../constants/registration-roles'
import { useAuth } from '../../auth'
import { useVerificationPoll } from '../../hooks/use-verification-poll'
import { maskPhone } from '../../lib/mask-phone'
import { pendingVerificationContent } from '../../placeholder/pending-verification-content'

function getLatestDocument(user: ReturnType<typeof useAuth>['state']) {
  if (stateIsAuthed(user)) {
    const documents = user.user.verification?.documents

    if (!documents?.length) {
      return null
    }

    return documents[documents.length - 1]
  }

  return null
}

function stateIsAuthed(
  state: ReturnType<typeof useAuth>['state'],
): state is Extract<typeof state, { status: 'authed' }> {
  return state.status === 'authed'
}

export function RegisterPendingPage() {
  const { state, logout } = useAuth()

  useVerificationPoll()

  if (!stateIsAuthed(state)) {
    return null
  }

  const { user } = state
  const maskedPhone = maskPhone(user.phone ?? '')
  const latestDocument = getLatestDocument(state)
  const role = isUserRole(user.role) ? user.role : 'donor'

  return (
    <div className="bg-cream flex min-h-screen flex-col font-sans">
      <HeaderMinimal variant="authed" onSignOut={() => void logout()} />

      <main className="mx-auto flex w-full max-w-lg flex-1 flex-col px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <VerificationBanner className="mb-8" />

        <div className="text-center">
          <h1 className="text-charcoal font-display text-2xl font-bold sm:text-3xl">
            {pendingVerificationContent.heading}
          </h1>
          <p className="text-body mx-auto mt-4 max-w-md text-sm leading-relaxed sm:text-base">
            {pendingVerificationContent.slaLine(maskedPhone)}
          </p>
        </div>

        <div className="border-border mt-8 rounded-2xl border bg-white p-5 shadow-sm sm:p-6">
          <StatusChip status="pending" className="mb-4" />

          {latestDocument ? (
            <SubmittedDocumentRow document={latestDocument} role={role} />
          ) : (
            // TODO: ensure /auth/me returns verification.documents[] (filename, uploadedAt)
            <SubmittedDocumentFallback />
          )}
        </div>

        <ButtonLink
          to={SUPPORT.href}
          variant="outline"
          size="lg"
          className="mt-6 w-full"
        >
          {pendingVerificationContent.contactSupportLabel}
        </ButtonLink>
      </main>

      <Footer />
    </div>
  )
}
