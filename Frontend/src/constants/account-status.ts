export const ACCOUNT_STATUS = {
  ACTIVE: 'active',
  FLAGGED: 'flagged',
  SUSPENDED: 'suspended',
} as const

export type AccountStatus =
  (typeof ACCOUNT_STATUS)[keyof typeof ACCOUNT_STATUS]
