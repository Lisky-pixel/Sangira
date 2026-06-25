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

export type AdminUserListStatusFilter =
  (typeof ADMIN_USER_LIST_STATUS_FILTER)[keyof typeof ADMIN_USER_LIST_STATUS_FILTER]

export const ADMIN_USER_LIST_ROLE_FILTER = {
  ALL: 'all',
  DONOR: 'donor',
  NGO: 'ngo',
} as const

export type AdminUserListRoleFilter =
  (typeof ADMIN_USER_LIST_ROLE_FILTER)[keyof typeof ADMIN_USER_LIST_ROLE_FILTER]

import { SUPPORT_EMAIL } from './support'

export const ADMIN_USER_ENFORCEMENT = {
  SUSPENDED_MESSAGE: `Your account is suspended — you can browse but cannot post or request food. Contact support at ${SUPPORT_EMAIL}.`,
  REVOKED_MESSAGE: `Your verification was revoked — you can browse but cannot post or request food. Contact support at ${SUPPORT_EMAIL} to resubmit.`,
} as const
