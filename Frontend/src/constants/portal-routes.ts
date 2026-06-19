import type { UserRole } from '../constants/registration-roles'
import { ROUTES } from '../routes/paths'

/** Post-login portal landing routes per role */
export const PORTAL_ROUTES = {
  donor: ROUTES.DONOR_DASHBOARD,
  ngo: ROUTES.NGO_DASHBOARD,
} as const satisfies Record<UserRole, string>

export function resolvePortalRoute(role: UserRole): string {
  return PORTAL_ROUTES[role]
}
