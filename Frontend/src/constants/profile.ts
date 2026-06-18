export const PROFILE_FIELD = {
  ORGANISATION_NAME: 'organisationName',
  CONTACT_NAME: 'contactName',
  PHONE: 'phone',
  ADDRESS: 'address',
} as const

export type ProfileFieldKey =
  (typeof PROFILE_FIELD)[keyof typeof PROFILE_FIELD]
