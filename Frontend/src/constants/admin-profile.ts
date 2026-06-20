export const ADMIN_PROFILE_FIELD = {
  NAME: 'name',
  PHONE: 'phone',
} as const

export type AdminProfileFieldKey =
  (typeof ADMIN_PROFILE_FIELD)[keyof typeof ADMIN_PROFILE_FIELD]

export const ADMIN_PROFILE_FIELD_KEYS = Object.values(
  ADMIN_PROFILE_FIELD,
) as [AdminProfileFieldKey, ...AdminProfileFieldKey[]]
