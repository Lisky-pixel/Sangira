export const headerMinimalContent = {
  brand: 'Sangira',
  needHelpLabel: 'Need help?',
} as const

export const registerWizardContent = {
  backLabel: 'Back',
  stepOfTotal: (step: number, total: number) => `Step ${step} of ${total}`,
} as const

export const registerStep1Content = {
  heading: 'Who are you registering as?',
  continueLabel: 'Continue',
  alreadyRegisteredPrefix: 'Already registered?',
  signInLink: 'Sign in',
  reassurance: [
    {
      icon: 'shield' as const,
      text: 'Secure, encrypted registration for all organisations.',
    },
    {
      icon: 'shield-check' as const,
      text: 'Identity verification ensures dignified distribution.',
    },
  ],
} as const

export const registerStep2Content = {
  heading: 'Tell us about your organisation',
  subcopy: 'Enter the official details for food redistribution.',
  fields: {
    organisationName: {
      label: 'Organisation name',
    },
    contactName: {
      label: 'Contact person',
      placeholder: 'Full name',
    },
    phone: {
      label: 'Phone number',
      placeholder: '788 000 000',
      helper: "We'll send SMS updates to this number",
    },
    email: {
      label: 'Email',
      placeholder: 'organisation@domain.rw',
    },
    password: {
      label: 'Password',
      placeholder: 'Create a strong password',
    },
  },
  continueLabel: 'Continue',
  infoBanner:
    'Your details are reviewed by Sangira administrators before activation.',
  validation: {
    organisationNameMin: 'Organisation name must be at least 2 characters',
    contactNameRequired: 'Contact person is required',
    phoneRequired: 'Phone number is required',
    phoneInvalid:
      'Enter a valid Rwandan mobile number (9 digits starting with 7)',
    emailInvalid: 'Enter a valid email address',
    passwordMin: 'Password must be at least 8 characters',
    passwordStrength: 'Password must be at least moderate strength',
  },
} as const

export const registerStep3Content = {
  heading: 'Document upload',
  subcopy: 'Step 3 — verification documents will be collected here.',
  placeholderNote: 'Coming soon — document upload and final submission.',
} as const

export const passwordStrengthLabels = {
  weak: 'Weak',
  fair: 'Fair',
  moderate: 'Moderate strength',
  strong: 'Strong',
} as const

export const passwordFieldA11y = {
  showPassword: 'Show password',
  hidePassword: 'Hide password',
} as const
