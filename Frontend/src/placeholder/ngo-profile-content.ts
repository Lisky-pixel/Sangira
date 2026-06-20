import { ROUTES } from '../routes/paths'
import { PROFILE_FIELD, type ProfileFieldKey } from '../constants/profile'

export const ngoProfileContent = {
  pageTitle: 'Organisation profile',
  verifiedOrganisationChip: 'Verified organisation',
  subline: {
    memberSince: (monthYear: string) => `Member since ${monthYear}`,
    separator: '·',
  },
  trackRecord: {
    sectionLabel: 'Your track record',
    pickupsCompletedLabel: 'pickups completed',
    mealsReceivedLabel: 'meals received',
    verifiedSince: (monthYear: string) => `since ${monthYear}`,
    verifiedLabel: 'Verified',
    loading: 'Loading track record…',
    loadError: 'Could not load track record.',
  },
  organisationDetails: {
    sectionLabel: 'Organisation details',
    fields: {
      [PROFILE_FIELD.ORGANISATION_NAME]: {
        label: 'Organisation name',
      },
      [PROFILE_FIELD.CONTACT_NAME]: {
        label: 'Contact person',
      },
      [PROFILE_FIELD.PHONE]: {
        label: 'Phone',
      },
      email: {
        label: 'Email',
        readOnlyNote: 'Contact support to change your email',
      },
      [PROFILE_FIELD.ADDRESS]: {
        label: 'Address',
      },
    } satisfies Record<string, { label: string; readOnlyNote?: string }>,
  },
  security: {
    title: 'Security',
    passwordLabel: 'Password',
    passwordLastChanged: (relative: string) => `Last changed ${relative}`,
    changePassword: 'Change password',
  },
  routes: {
    changePassword: ROUTES.NGO_CHANGE_PASSWORD,
  },
} as const

export type NgoEditableProfileFieldKey = Extract<
  ProfileFieldKey,
  | typeof PROFILE_FIELD.ORGANISATION_NAME
  | typeof PROFILE_FIELD.CONTACT_NAME
  | typeof PROFILE_FIELD.PHONE
  | typeof PROFILE_FIELD.ADDRESS
>
