import type { UserRole } from '../constants/registration-roles'
import { ROUTES } from '../routes/paths'

/** TEMPORARY — portal landing routes until NGO dashboard slice ships */
export const PORTAL_ROUTES = {
  donor: ROUTES.DONOR_DASHBOARD,
  ngo: ROUTES.NGO_BROWSE,
} as const satisfies Record<UserRole, string>

export function resolvePortalRoute(role: UserRole): string {
  return PORTAL_ROUTES[role]
}
