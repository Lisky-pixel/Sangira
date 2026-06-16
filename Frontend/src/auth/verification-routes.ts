import {
  VERIFICATION_STATUS,
  type VerificationStatus,
} from '../constants/verification-status'
import { resolvePortalRoute } from '../constants/portal-routes'
import { isUserRole } from '../constants/registration-roles'
import { hasSeenVerificationCelebration } from '../lib/verification-celebration'
import { ROUTES } from '../routes/paths'

type ResolveVerificationRouteOptions = {
  role?: string
  celebrationSeen?: boolean
}

export function resolveVerificationRoute(
  status: VerificationStatus,
  options: ResolveVerificationRouteOptions = {},
): string {
  switch (status) {
    case VERIFICATION_STATUS.PENDING:
      return ROUTES.REGISTER_PENDING
    case VERIFICATION_STATUS.REJECTED:
      return ROUTES.REGISTER_REJECTED
    case VERIFICATION_STATUS.APPROVED: {
      const celebrationSeen =
        options.celebrationSeen ?? hasSeenVerificationCelebration()
      const roleValue = options.role ?? null
      const role = isUserRole(roleValue) ? roleValue : undefined

      if (celebrationSeen && role) {
        return resolvePortalRoute(role)
      }

      return ROUTES.VERIFICATION_APPROVED
    }
    default:
      return ROUTES.REGISTER_PENDING
  }
}

export function resolveVerificationRouteForUser(
  status: VerificationStatus,
  role: string,
): string {
  return resolveVerificationRoute(status, { role })
}

export { resolvePortalRoute }
