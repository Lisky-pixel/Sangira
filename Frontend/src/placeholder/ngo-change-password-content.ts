import { ROUTES } from '../routes/paths'

export const ngoChangePasswordContent = {
  pageTitle: 'Change password',
  fields: {
    currentPassword: {
      label: 'Current password',
      placeholder: 'Enter your current password',
    },
    newPassword: {
      label: 'New password',
      placeholder: 'Create a new password',
    },
    confirmNewPassword: {
      label: 'Confirm new password',
      placeholder: 'Re-enter your new password',
    },
  },
  submitLabel: 'Update password',
  cancelLabel: 'Cancel',
  validation: {
    currentRequired: 'Current password is required',
    newMin: 'Password must be at least 8 characters',
    newStrength: 'Password must be moderate strength or stronger',
    confirmRequired: 'Confirm your new password',
    confirmMismatch: 'Passwords do not match',
    wrongCurrent: 'Current password is incorrect',
    sameAsCurrent:
      'Your new password must be different from your current password.',
  },
  toast: {
    success: 'Password updated — please sign in with your new password.',
    error: 'Could not update password',
  },
  routes: {
    profile: ROUTES.NGO_PROFILE,
    signIn: ROUTES.SIGN_IN,
  },
} as const
