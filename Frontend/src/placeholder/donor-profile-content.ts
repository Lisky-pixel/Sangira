import { ROUTES } from '../routes/paths'
import { PROFILE_FIELD, type ProfileFieldKey } from '../constants/profile'

export const donorProfileContent = {
  pageTitle: 'Organisation profile',
  avatar: {
    editPhoto: 'Edit photo',
    uploadAria: 'Upload organisation photo',
  },
  verifiedDonorChip: 'Verified donor',
  subline: {
    memberSince: (monthYear: string) => `Member since ${monthYear}`,
    separator: '·',
  },
  trackRecord: {
    sectionLabel: 'Your track record',
    transfersCompletedLabel: 'transfers completed',
    mealsRedistributedLabel: 'meals redistributed',
    verifiedSince: (monthYear: string) => `since ${monthYear}`,
  },
  organisationDetails: {
    sectionLabel: 'Organisation details',
    fields: {
      [PROFILE_FIELD.ORGANISATION_NAME]: {
        label: 'Business name',
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
      businessRegistration: {
        label: 'Business registration',
        readOnlyNote: 'Verified detail — contact support to update',
        emptyValue: '—',
      },
      [PROFILE_FIELD.ADDRESS]: {
        label: 'Address',
      },
    } satisfies Record<string, { label: string; readOnlyNote?: string; emptyValue?: string }>,
  },
  security: {
    title: 'Security',
    passwordLabel: 'Password',
    passwordLastChanged: (relative: string) => `Last changed ${relative}`,
    changePassword: 'Change password',
  },
  inlineEdit: {
    edit: 'Edit',
    save: 'Save',
    cancel: 'Cancel',
  },
  toast: {
    fieldSaved: 'Profile updated',
    fieldError: 'Could not update profile',
    phoneTaken: 'This phone number is already linked to another account',
    avatarUploading: 'Uploading photo…',
    avatarSuccess: 'Profile photo updated',
    avatarError: 'Could not upload photo',
  },
  routes: {
    changePassword: ROUTES.DONOR_CHANGE_PASSWORD,
  },
} as const

export type EditableProfileFieldKey = Extract<
  ProfileFieldKey,
  | typeof PROFILE_FIELD.ORGANISATION_NAME
  | typeof PROFILE_FIELD.CONTACT_NAME
  | typeof PROFILE_FIELD.PHONE
  | typeof PROFILE_FIELD.ADDRESS
>
