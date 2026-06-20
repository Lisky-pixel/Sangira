import { ROUTES } from '../routes/paths'

export const adminProfileContent = {
  pageTitle: 'Admin profile',
  pageSubtitle: 'Your administrator account.',
  loading: 'Loading profile…',
  loadError: 'Could not load your profile. Please try again.',
  roleBadge: 'ADMINISTRATOR',
  memberSince: (monthYear: string) => `Member since ${monthYear}`,
  accountDetails: {
    sectionLabel: 'Account details',
    fields: {
      name: { label: 'Full name' },
      email: {
        label: 'Email',
        readOnlyNote: 'Contact support to change your email.',
      },
      phone: { label: 'Phone' },
    },
  },
  activity: {
    sectionLabel: 'Your activity',
    verificationsReviewed: 'Verifications reviewed',
    statusLabel: 'Status',
    approved: (count: number) =>
      `Approved: ${count.toLocaleString()}`,
    rejected: (count: number) =>
      `Rejected: ${count.toLocaleString()}`,
    activeSince: 'Active since',
  },
  security: {
    title: 'Security',
    passwordLabel: 'Password',
    passwordLastChanged: (when: string) => `Last changed ${when}`,
    changePassword: 'Change password',
  },
  inlineEdit: {
    edit: 'Edit',
    save: 'Save',
    cancel: 'Cancel',
  },
  toast: {
    fieldSaved: 'Profile updated.',
    fieldError: 'Could not update profile. Please try again.',
    phoneTaken: 'That phone number is already in use.',
  },
  routes: {
    changePassword: `${ROUTES.ADMIN_PROFILE}/change-password`,
  },
} as const
