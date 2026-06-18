import { useAuth } from '../../auth'
import { ProfileAvatar } from '../../components/profile/profile-avatar'
import { ProfileInlineFieldRow } from '../../components/profile/profile-inline-field-row'
import { ProfileReadOnlyRow } from '../../components/profile/profile-readonly-row'
import { ProfileTrackRecordCard } from '../../components/profile/profile-track-record-card'
import { ButtonLink } from '../../components/ui/button'
import { StatusChip } from '../../components/ui/status-chip'
import { VerifiedBadge } from '../../components/ui/verified-badge'
import { PROFILE_FIELD } from '../../constants/profile'
import { getDonorPickupAddress } from '../../lib/donor-pickup-address'
import {
  formatMemberMonthYear,
  formatPasswordLastChanged,
  formatProfileLocation,
  maskPhoneForDisplay,
} from '../../lib/profile-format'
import { donorProfileContent } from '../../placeholder/donor-profile-content'

export function DonorProfilePage() {
  const { state, refreshMe } = useAuth()

  if (state.status !== 'authed') {
    return null
  }

  const user = state.user
  const organisationName = user.organisationName?.trim() || 'Organisation'
  const contactName = user.contactName?.trim() || ''
  const email = user.email
  const phone = user.phone ?? ''
  const address = getDonorPickupAddress(user)
  const registrationNumber =
    typeof user.businessRegistrationNumber === 'string'
      ? user.businessRegistrationNumber.trim()
      : ''
  const locationLabel = formatProfileLocation(address)
  const memberSince = formatMemberMonthYear(user.createdAt)
  const passwordChangedLabel = formatPasswordLastChanged(user.passwordChangedAt)
  const avatarUrl =
    typeof user.profileImageUrl === 'string' ? user.profileImageUrl : undefined

  const sublineParts = [
    locationLabel,
    memberSince
      ? donorProfileContent.subline.memberSince(memberSince)
      : '',
  ].filter(Boolean)

  const handleRefresh = async () => {
    await refreshMe()
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
      <h1 className="text-charcoal font-display text-2xl font-bold sm:text-3xl">
        {donorProfileContent.pageTitle}
      </h1>

      <section className="border-border rounded-2xl border bg-white p-5 sm:p-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:gap-8">
          <ProfileAvatar
            organisationName={organisationName}
            avatarUrl={avatarUrl}
            onAvatarUpdated={handleRefresh}
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
                label={donorProfileContent.verifiedDonorChip}
              />
            </div>

            {sublineParts.length > 0 ? (
              <p className="text-body mt-2 text-sm">
                {sublineParts.join(` ${donorProfileContent.subline.separator} `)}
              </p>
            ) : null}
          </div>
        </div>
      </section>

      <ProfileTrackRecordCard
        donorId={user._id}
        verifiedAt={user.verification?.reviewedAt}
      />

      <section className="border-border rounded-2xl border bg-white p-5 sm:p-6">
        <h2 className="text-body text-xs font-medium tracking-wide uppercase">
          {donorProfileContent.organisationDetails.sectionLabel}
        </h2>

        <div className="mt-4">
          <ProfileInlineFieldRow
            label={
              donorProfileContent.organisationDetails.fields[
                PROFILE_FIELD.ORGANISATION_NAME
              ].label
            }
            fieldName={PROFILE_FIELD.ORGANISATION_NAME}
            displayValue={organisationName}
            defaultValue={organisationName}
            onSaved={handleRefresh}
          />

          <ProfileInlineFieldRow
            label={
              donorProfileContent.organisationDetails.fields[
                PROFILE_FIELD.CONTACT_NAME
              ].label
            }
            fieldName={PROFILE_FIELD.CONTACT_NAME}
            displayValue={contactName}
            defaultValue={contactName}
            onSaved={handleRefresh}
          />

          <ProfileInlineFieldRow
            label={
              donorProfileContent.organisationDetails.fields[PROFILE_FIELD.PHONE]
                .label
            }
            fieldName={PROFILE_FIELD.PHONE}
            displayValue={maskPhoneForDisplay(phone) || phone}
            defaultValue={phone}
            onSaved={handleRefresh}
          />

          <ProfileReadOnlyRow
            label={donorProfileContent.organisationDetails.fields.email.label}
            value={email}
            note={donorProfileContent.organisationDetails.fields.email.readOnlyNote}
          />

          <ProfileReadOnlyRow
            label={
              donorProfileContent.organisationDetails.fields.businessRegistration
                .label
            }
            value={
              registrationNumber ||
              donorProfileContent.organisationDetails.fields.businessRegistration
                .emptyValue!
            }
            note={
              donorProfileContent.organisationDetails.fields.businessRegistration
                .readOnlyNote
            }
          />

          <ProfileInlineFieldRow
            label={
              donorProfileContent.organisationDetails.fields[PROFILE_FIELD.ADDRESS]
                .label
            }
            fieldName={PROFILE_FIELD.ADDRESS}
            displayValue={address}
            defaultValue={address}
            onSaved={handleRefresh}
          />
        </div>
      </section>

      <section className="border-border rounded-2xl border bg-white p-5 sm:p-6">
        <h2 className="text-charcoal text-lg font-semibold">
          {donorProfileContent.security.title}
        </h2>

        <div className="border-border mt-4 flex flex-col gap-4 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-charcoal text-sm font-semibold">
              {donorProfileContent.security.passwordLabel}
            </p>
            {passwordChangedLabel ? (
              <p className="text-body mt-0.5 text-sm">
                {donorProfileContent.security.passwordLastChanged(
                  passwordChangedLabel,
                )}
              </p>
            ) : null}
          </div>

          <ButtonLink
            to={donorProfileContent.routes.changePassword}
            variant="outline"
            className="w-full sm:w-auto"
          >
            {donorProfileContent.security.changePassword}
          </ButtonLink>
        </div>
      </section>
    </div>
  )
}
