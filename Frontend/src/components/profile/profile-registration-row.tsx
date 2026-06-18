import type { AuthUser } from '../../auth/types'
import { VerifiedBadge } from '../ui/verified-badge'
import { resolveProfileRegistrationDisplay } from '../../lib/profile-registration-display'
import { profileRegistrationContent } from '../../placeholder/profile-registration-content'
import { ProfileReadOnlyRow } from './profile-readonly-row'

type ProfileRegistrationRowProps = {
  user: AuthUser
}

export function ProfileRegistrationRow({ user }: ProfileRegistrationRowProps) {
  const display = resolveProfileRegistrationDisplay(user)

  if (display.mode === 'number') {
    return (
      <ProfileReadOnlyRow
        label={profileRegistrationContent.label}
        value={display.value}
        note={profileRegistrationContent.numberReadOnlyNote}
      />
    )
  }

  return (
    <div className="border-border flex flex-col gap-1 border-t py-4 first:border-t-0 first:pt-0 last:pb-0 sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0 flex-1">
        <p className="text-body text-xs font-medium tracking-wide uppercase">
          {profileRegistrationContent.label}
        </p>
        <div className="mt-1">
          <VerifiedBadge label={profileRegistrationContent.onFileVerified} />
        </div>
      </div>
    </div>
  )
}
