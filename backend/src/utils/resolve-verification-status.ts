import { ROLES, VERIFICATION_STATUS } from '../constants/enums.js'

type UserWithVerification = {
  role?: string
  verification?: { status?: string }
}

export function resolveVerificationStatusForUser(
  user: UserWithVerification,
): string {
  if (user.role === ROLES.ADMIN) {
    return VERIFICATION_STATUS.APPROVED
  }

  return user.verification?.status ?? VERIFICATION_STATUS.PENDING
}
