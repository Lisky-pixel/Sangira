import { ROUTES } from '../routes/paths'

export const signInContent = {
  heading: 'Welcome back',
  subcopy: 'Please enter your details to sign in.',
  fields: {
    identifier: {
      label: 'Phone or email',
      placeholder: 'e.g. +250 or name@gmail.com',
    },
    password: {
      label: 'Password',
      placeholder: 'Your password',
    },
  },
  submitLabel: 'Sign in',
  forgotPasswordLabel: 'Forgot password?',
  forgotPasswordSubcopy: "We'll send a reset code by Email",
  orLabel: 'OR',
  registerLabel: 'Register your organisation',
  links: {
    privacy: 'Privacy Policy',
    help: 'Need help?',
    contact: 'Contact us',
  },
  validation: {
    identifierInvalid: 'Enter a valid email or Rwanda mobile number',
    identifierRequired: 'Phone or email is required',
    passwordRequired: 'Password is required',
  },
  errors: {
    invalidCredentials: 'Invalid email/phone or password',
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
