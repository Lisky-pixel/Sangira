import type { UserRole } from './registration-roles'
import { ADMIN_ROLE, isPortalRole } from './portal-roles'
import { ROUTES } from '../routes/paths'

/** Post-login portal landing routes per role */
export const PORTAL_ROUTES = {
  donor: ROUTES.DONOR_DASHBOARD,
  ngo: ROUTES.NGO_DASHBOARD,
  [ADMIN_ROLE]: ROUTES.ADMIN_OVERVIEW,
} as const satisfies Record<UserRole | typeof ADMIN_ROLE, string>

export function resolvePortalRoute(role: string): string {
  if (role === ADMIN_ROLE) {
    return ROUTES.ADMIN_OVERVIEW
  }

  if (isPortalRole(role) && role !== ADMIN_ROLE) {
    return PORTAL_ROUTES[role]
  }

  return ROUTES.HOME
}
