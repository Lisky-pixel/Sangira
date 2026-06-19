import type { UserRole } from './registration-roles'
import { isUserRole } from './registration-roles'

export const ADMIN_ROLE = 'admin' as const

export type PortalRole = UserRole | typeof ADMIN_ROLE

export function isPortalRole(value: string | null): value is PortalRole {
  return isUserRole(value) || value === ADMIN_ROLE
}

export function isAdminRole(value: string | null | undefined): boolean {
  return value === ADMIN_ROLE
}
