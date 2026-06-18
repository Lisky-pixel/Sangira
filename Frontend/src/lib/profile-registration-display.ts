import type { AuthUser } from '../auth/types'
import { isUserRole } from '../constants/registration-roles'

export type ProfileRegistrationDisplay =
  | { mode: 'number'; value: string }
  | { mode: 'on-file-verified' }

/** NGO: real registrationNumber when stored; donors always on-file verified (no DB number). */
export function resolveProfileRegistrationDisplay(
  user: AuthUser,
): ProfileRegistrationDisplay {
  if (isUserRole(user.role) && user.role === 'ngo') {
    const registrationNumber =
      typeof user.registrationNumber === 'string'
        ? user.registrationNumber.trim()
        : ''

    if (registrationNumber) {
      return { mode: 'number', value: registrationNumber }
    }
  }

  return { mode: 'on-file-verified' }
}
