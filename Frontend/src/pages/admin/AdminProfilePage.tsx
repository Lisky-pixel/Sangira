import { useEffect, useState } from 'react'
import { AdminInlineFieldRow } from '../../components/admin/admin-inline-field-row'
import { ProfileReadOnlyRow } from '../../components/profile/profile-readonly-row'
import { ButtonLink } from '../../components/ui/button'
import { ADMIN_PROFILE_FIELD } from '../../constants/admin-profile'
import {
  formatMemberMonthYear,
  formatPasswordLastChanged,
  formatShortMonthYear,
  maskPhoneForDisplay,
} from '../../lib/profile-format'
import { getOrgInitials } from '../../lib/org-initials'
import { adminProfileContent } from '../../placeholder/admin-profile-content'
import { adminProfileService } from '../../services/admin-profile-service'
import type { AdminMeData } from '../../types/admin-profile'

export function AdminProfilePage() {
  const [data, setData] = useState<AdminMeData | null>(null)
  const [loadState, setLoadState] = useState<'loading' | 'ready' | 'error'>(
    'loading',
  )

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoadState('loading')
      try {
        const result = await adminProfileService.getMe()
        if (!cancelled) {
          setData(result)
          setLoadState('ready')
        }
      } catch {
        if (!cancelled) {
          setData(null)
          setLoadState('error')
        }
      }
    }

    void load()

    return () => {
      cancelled = true
    }
  }, [])

  if (loadState === 'loading') {
    return (
      <p className="text-body text-sm">{adminProfileContent.loading}</p>
    )
  }

  if (loadState === 'error' || !data) {
    return (
      <p className="text-clay-red text-sm">{adminProfileContent.loadError}</p>
    )
  }

  const { profile, activity } = data
  const memberSince = formatMemberMonthYear(profile.createdAt)
  const activeSince = formatShortMonthYear(profile.createdAt)
  const passwordChangedLabel = formatPasswordLastChanged(
    profile.passwordChangedAt,
  )
  const phone = profile.phone ?? ''

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
      <header>
        <h1 className="text-charcoal font-display text-2xl font-bold sm:text-3xl">
          {adminProfileContent.pageTitle}
        </h1>
        <p className="text-body mt-2 text-sm">{adminProfileContent.pageSubtitle}</p>
      </header>

      <section className="border-border rounded-2xl border bg-white p-5 sm:p-6">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:gap-8">
          <div
            aria-hidden="true"
            className="bg-sand text-charcoal mx-auto flex size-20 shrink-0 items-center justify-center rounded-full text-2xl font-bold sm:mx-0"
          >
            {getOrgInitials(profile.name)}
          </div>

          <div className="min-w-0 flex-1 text-center sm:text-left">
            <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
              <h2 className="text-charcoal font-display text-xl font-bold sm:text-2xl">
                {profile.name}
              </h2>
              <span className="bg-sand text-body rounded-full px-2.5 py-0.5 text-[10px] font-semibold tracking-wide uppercase">
                {adminProfileContent.roleBadge}
              </span>
            </div>
            {memberSince ? (
              <p className="text-body mt-2 text-sm">
                {adminProfileContent.memberSince(memberSince)}
              </p>
            ) : null}
          </div>
        </div>
      </section>

      <section className="border-border rounded-2xl border bg-white p-5 sm:p-6">
        <h2 className="text-body text-xs font-medium tracking-wide uppercase">
          {adminProfileContent.accountDetails.sectionLabel}
        </h2>

        <div className="mt-4">
          <AdminInlineFieldRow
            label={adminProfileContent.accountDetails.fields.name.label}
            fieldName={ADMIN_PROFILE_FIELD.NAME}
            displayValue={profile.name}
            defaultValue={profile.name}
            onSaved={(updated) =>
              setData((current) =>
                current ? { ...current, profile: updated } : current,
              )
            }
          />

          <ProfileReadOnlyRow
            label={adminProfileContent.accountDetails.fields.email.label}
            value={profile.email}
            note={adminProfileContent.accountDetails.fields.email.readOnlyNote}
          />

          <AdminInlineFieldRow
            label={adminProfileContent.accountDetails.fields.phone.label}
            fieldName={ADMIN_PROFILE_FIELD.PHONE}
            displayValue={maskPhoneForDisplay(phone) || phone || '—'}
            defaultValue={phone}
            onSaved={(updated) =>
              setData((current) =>
                current ? { ...current, profile: updated } : current,
              )
            }
          />
        </div>
      </section>

      <section className="border-border rounded-2xl border bg-white p-5 sm:p-6">
        <h2 className="text-body text-center text-xs font-medium tracking-wide uppercase">
          {adminProfileContent.activity.sectionLabel}
        </h2>

        <div className="mt-5 grid grid-cols-1 gap-6 sm:grid-cols-3 sm:gap-4">
          <div className="text-center sm:border-border sm:border-r sm:px-4">
            <p className="text-stat font-display text-3xl font-bold sm:text-4xl">
              {activity.verificationsReviewed.toLocaleString()}
            </p>
            <p className="text-body mt-2 text-sm">
              {adminProfileContent.activity.verificationsReviewed}
            </p>
          </div>

          <div className="text-center sm:border-border sm:border-r sm:px-4">
            <p className="text-body text-sm font-medium">
              {adminProfileContent.activity.statusLabel}
            </p>
            <div className="text-charcoal mt-2 space-y-1 text-sm font-semibold">
              <p>{adminProfileContent.activity.approved(activity.approved)}</p>
              <p>{adminProfileContent.activity.rejected(activity.rejected)}</p>
            </div>
          </div>

          <div className="text-center sm:px-4">
            <p className="text-body text-sm font-medium">
              {adminProfileContent.activity.activeSince}
            </p>
            <p className="text-charcoal font-display mt-2 text-xl font-bold">
              {activeSince || '—'}
            </p>
          </div>
        </div>
      </section>

      <section className="border-border rounded-2xl border bg-white p-5 sm:p-6">
        <h2 className="text-charcoal text-lg font-semibold">
          {adminProfileContent.security.title}
        </h2>

        <div className="border-border mt-4 flex flex-col gap-4 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-charcoal text-sm font-semibold">
              {adminProfileContent.security.passwordLabel}
            </p>
            {passwordChangedLabel ? (
              <p className="text-body mt-0.5 text-sm">
                {adminProfileContent.security.passwordLastChanged(
                  passwordChangedLabel,
                )}
              </p>
            ) : null}
          </div>

          <ButtonLink
            to={adminProfileContent.routes.changePassword}
            variant="outline"
            className="w-full sm:w-auto"
          >
            {adminProfileContent.security.changePassword}
          </ButtonLink>
        </div>
      </section>
    </div>
  )
}
