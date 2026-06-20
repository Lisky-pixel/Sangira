import { ROUTES } from '../routes/paths'

export const adminChangePasswordContent = {
  pageTitle: 'Change password',
  fields: {
    currentPassword: {
      label: 'Current password',
      placeholder: 'Enter current password',
    },
    newPassword: {
      label: 'New password',
      placeholder: 'Enter new password',
    },
    confirmNewPassword: {
      label: 'Confirm new password',
      placeholder: 'Re-enter new password',
    },
  },
  submitLabel: 'Update password',
  cancelLabel: 'Back to profile',
  validation: {
    wrongCurrent: 'Current password is incorrect.',
    sameAsCurrent: 'New password must differ from your current password.',
  },
  toast: {
    success: 'Password updated. Please sign in again.',
    error: 'Could not update password. Please try again.',
  },
  routes: {
    profile: ROUTES.ADMIN_PROFILE,
    signIn: ROUTES.ADMIN_LOGIN,
  },
} as const
