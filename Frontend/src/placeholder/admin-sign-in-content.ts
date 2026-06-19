import { ROUTES } from '../routes/paths'

export const adminSignInContent = {
  brand: 'Sangira',
  badge: 'ADMIN',
  heading: 'Admin sign in',
  subcopy: 'Staff access only',
  fields: {
    email: {
      label: 'Email',
      placeholder: 'you@sangira.rw',
    },
    password: {
      label: 'Password',
      placeholder: 'Enter your password',
    },
  },
  forgotPassword: 'Forgot password?',
  submitLabel: 'Sign in',
  restrictedNotice: 'This area is restricted to Sangira administrators.',
  copyright: '© 2026 Sangira Food Redistribution.',
  errors: {
    invalidCredentials: 'Invalid email or password.',
    accountBlocked: 'This account has been suspended or revoked.',
    notAdministrator: 'This area is for administrators only.',
  },
  toast: {
    success: 'Signed in successfully.',
  },
  routes: {
    forgotPassword: ROUTES.FORGOT_PASSWORD,
    overview: ROUTES.ADMIN_OVERVIEW,
  },
} as const
