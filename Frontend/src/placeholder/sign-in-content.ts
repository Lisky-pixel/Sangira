import { ROUTES } from '../routes/paths'

export const signInContent = {
  heading: 'Sign in',
  subcopy: 'Access your Sangira account to manage food redistribution.',
  fields: {
    email: {
      label: 'Email',
      placeholder: 'you@organisation.rw',
    },
    password: {
      label: 'Password',
      placeholder: 'Your password',
    },
  },
  submitLabel: 'Sign in',
  newHerePrefix: 'New here?',
  getStartedLabel: 'Get started',
  validation: {
    emailInvalid: 'Enter a valid email address',
    passwordRequired: 'Password is required',
  },
  errors: {
    invalidCredentials: 'Invalid email or password',
    accountBlocked:
      'This account has been suspended or revoked. Contact support if you believe this is a mistake.',
  },
  toast: {
    success: 'Signed in successfully',
  },
} as const

export const registrationConflictContent = {
  emailExists: 'An account with this email already exists. Please sign in.',
  signInActionLabel: 'Sign in',
  signInPath: ROUTES.SIGN_IN,
} as const
