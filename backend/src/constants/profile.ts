export const PROFILE_FIELD = {
  ORGANISATION_NAME: 'organisationName',
  CONTACT_NAME: 'contactName',
  PHONE: 'phone',
  ADDRESS: 'address',
} as const

export type ProfileFieldKey =
  (typeof PROFILE_FIELD)[keyof typeof PROFILE_FIELD]

export const PROFILE_PHONE_TAKEN_CODE = 'PHONE_EXISTS'

export const PROFILE_PHONE_TAKEN_MESSAGE =
  'This phone number is already linked to another account'

/** Verification-bound or account-identity fields — not editable via PATCH /me/profile */
export const FORBIDDEN_PROFILE_PATCH_KEYS = [
  'email',
  'businessRegistrationNumber',
  'registrationNumber',
] as const

export const PROFILE_READONLY_FIELD_CODE = 'PROFILE_FIELD_READONLY'
