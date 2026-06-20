import { VERIFICATION_STATUS } from './enums.js'

export const ADMIN_USERS_PAGE = {
  PAGE_SIZE: 20,
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 50,
} as const

export const ADMIN_USER_ACTION = {
  FLAG: 'flag',
  UNFLAG: 'unflag',
  SUSPEND: 'suspend',
  REACTIVATE: 'reactivate',
  REVOKE_VERIFICATION: 'revoke_verification',
  RESTORE_VERIFICATION: 'restore_verification',
} as const

export type AdminUserAction =
  (typeof ADMIN_USER_ACTION)[keyof typeof ADMIN_USER_ACTION]

export const ADMIN_USER_LIST_STATUS = {
  ACTIVE: 'active',
  FLAGGED: 'flagged',
  SUSPENDED: 'suspended',
  REVOKED: 'revoked',
} as const

export type AdminUserListStatus =
  (typeof ADMIN_USER_LIST_STATUS)[keyof typeof ADMIN_USER_LIST_STATUS]

export const ADMIN_USER_LIST_STATUS_FILTER = {
  ALL: 'all',
  ACTIVE: 'active',
  FLAGGED: 'flagged',
  SUSPENDED: 'suspended',
  REVOKED: 'revoked',
} as const

export const ADMIN_USER_LIST_ROLE_FILTER = {
  ALL: 'all',
  DONOR: 'donor',
  NGO: 'ngo',
} as const

/** Users list — only orgs that passed verification (approved or later revoked). */
export const ADMIN_USER_LIST_VERIFICATION_STATUSES = [
  VERIFICATION_STATUS.APPROVED,
  VERIFICATION_STATUS.REVOKED,
] as const

export const ADMIN_USER_ENFORCEMENT = {
  SUSPENDED_MESSAGE:
    'Your account is suspended — contact support',
  REVOKED_MESSAGE:
    'Your verification was revoked — contact support',
  SUSPENDED_CODE: 'ACCOUNT_SUSPENDED',
  REVOKED_CODE: 'VERIFICATION_REVOKED',
} as const
