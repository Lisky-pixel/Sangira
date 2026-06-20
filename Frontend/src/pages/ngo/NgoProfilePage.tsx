import { useAuth } from '../../auth'
import { useParticipantEditBlocked } from '../../hooks/use-participant-edit-blocked'
import { useNgoImpact } from '../../hooks/use-ngo-impact'
import { ProfileAvatar } from '../../components/profile/profile-avatar'
import { ProfileInlineFieldRow } from '../../components/profile/profile-inline-field-row'
import { ProfileReadOnlyRow } from '../../components/profile/profile-readonly-row'
import { ProfileRegistrationRow } from '../../components/profile/profile-registration-row'
import { NgoTrackRecordCard } from '../../components/profile/ngo-track-record-card'
import { ButtonLink } from '../../components/ui/button'
import { StatusChip } from '../../components/ui/status-chip'
import { VerifiedBadge } from '../../components/ui/verified-badge'
import { PROFILE_FIELD } from '../../constants/profile'
import { getNgoServiceAddress } from '../../lib/ngo-service-location'
import {
  formatMemberMonthYear,
  formatPasswordLastChanged,
  formatProfileLocation,
  maskPhoneForDisplay,
} from '../../lib/profile-format'
import { ngoProfileContent } from '../../placeholder/ngo-profile-content'

export function NgoProfilePage() {
  const { state, refreshMe } = useAuth()
  const { blocked: editsBlocked } = useParticipantEditBlocked()
  const { impact, loadState: impactLoadState } = useNgoImpact()

  if (state.status !== 'authed') {
    return null
  }

  const user = state.user
  const organisationName = user.organisationName?.trim() || 'Organisation'
  const contactName = user.contactName?.trim() || ''
  const email = user.email
  const phone = user.phone ?? ''
  const address = getNgoServiceAddress(user)
  const locationLabel = formatProfileLocation(address)
  const memberSince = formatMemberMonthYear(user.createdAt)
  const passwordChangedLabel = formatPasswordLastChanged(user.passwordChangedAt)
  const avatarUrl =
    typeof user.avatarUrl === 'string' ? user.avatarUrl : undefined

  const sublineParts = [
    locationLabel,
    memberSince
      ? ngoProfileContent.subline.memberSince(memberSince)
      : '',
  ].filter(Boolean)

  const handleRefresh = async () => {
    await refreshMe()
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
      <h1 className="text-charcoal font-display text-2xl font-bold sm:text-3xl">
        {ngoProfileContent.pageTitle}
      </h1>

      <section className="border-border rounded-2xl border bg-white p-5 sm:p-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:gap-8">
          <ProfileAvatar
            organisationName={organisationName}
            avatarUrl={avatarUrl}
            onAvatarUpdated={handleRefresh}
            readOnly={editsBlocked}
          />

          <div className="min-w-0 flex-1 text-center lg:text-left">
            <div className="flex flex-col items-center gap-2 lg:flex-row lg:flex-wrap lg:items-center">
              <div className="flex flex-wrap items-center justify-center gap-2 lg:justify-start">
                <h2 className="text-charcoal font-display text-xl font-bold sm:text-2xl">
                  {organisationName}
                </h2>
                <VerifiedBadge />
              </div>
              <StatusChip
                status="verified"
                label={ngoProfileContent.verifiedOrganisationChip}
              />
            </div>

            {sublineParts.length > 0 ? (
              <p className="text-body mt-2 text-sm">
                {sublineParts.join(` ${ngoProfileContent.subline.separator} `)}
              </p>
            ) : null}
          </div>
        </div>
      </section>

      <NgoTrackRecordCard
        pickupsCompleted={impact?.totals.completedPickups ?? 0}
        mealsReceived={impact?.totals.mealsReceived ?? 0}
        verifiedAt={user.verification?.reviewedAt}
        loadState={impactLoadState}
      />

      <section className="border-border rounded-2xl border bg-white p-5 sm:p-6">
        <h2 className="text-body text-xs font-medium tracking-wide uppercase">
          {ngoProfileContent.organisationDetails.sectionLabel}
        </h2>

        <div className="mt-4">
          <ProfileInlineFieldRow
            label={
              ngoProfileContent.organisationDetails.fields[
                PROFILE_FIELD.ORGANISATION_NAME
              ].label
            }
            fieldName={PROFILE_FIELD.ORGANISATION_NAME}
            displayValue={organisationName}
            defaultValue={organisationName}
            onSaved={handleRefresh}
            readOnly={editsBlocked}
          />

          <ProfileInlineFieldRow
            label={
              ngoProfileContent.organisationDetails.fields[
                PROFILE_FIELD.CONTACT_NAME
              ].label
            }
            fieldName={PROFILE_FIELD.CONTACT_NAME}
            displayValue={contactName}
            defaultValue={contactName}
            onSaved={handleRefresh}
            readOnly={editsBlocked}
          />

          <ProfileInlineFieldRow
            label={
              ngoProfileContent.organisationDetails.fields[PROFILE_FIELD.PHONE]
                .label
            }
            fieldName={PROFILE_FIELD.PHONE}
            displayValue={maskPhoneForDisplay(phone) || phone}
            defaultValue={phone}
            onSaved={handleRefresh}
            readOnly={editsBlocked}
          />

          <ProfileReadOnlyRow
            label={ngoProfileContent.organisationDetails.fields.email.label}
            value={email}
            note={ngoProfileContent.organisationDetails.fields.email.readOnlyNote}
          />

          <ProfileRegistrationRow user={user} />

          <ProfileInlineFieldRow
            label={
              ngoProfileContent.organisationDetails.fields[PROFILE_FIELD.ADDRESS]
                .label
            }
            fieldName={PROFILE_FIELD.ADDRESS}
            displayValue={address || '—'}
            defaultValue={address}
            onSaved={handleRefresh}
            readOnly={editsBlocked}
          />
        </div>
      </section>

      <section className="border-border rounded-2xl border bg-white p-5 sm:p-6">
        <h2 className="text-charcoal text-lg font-semibold">
          {ngoProfileContent.security.title}
        </h2>

        <div className="border-border mt-4 flex flex-col gap-4 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-charcoal text-sm font-semibold">
              {ngoProfileContent.security.passwordLabel}
            </p>
            {passwordChangedLabel ? (
              <p className="text-body mt-0.5 text-sm">
                {ngoProfileContent.security.passwordLastChanged(
                  passwordChangedLabel,
                )}
              </p>
            ) : null}
          </div>

          <ButtonLink
            to={ngoProfileContent.routes.changePassword}
            variant="outline"
            className="w-full sm:w-auto"
          >
            {ngoProfileContent.security.changePassword}
          </ButtonLink>
        </div>
      </section>
    </div>
  )
}
