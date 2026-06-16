import type { UserRole } from '../constants/registration-roles'

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
  signInLabel: 'Sign in',
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
  copyByRole: {
    donor: {
      heading: 'Upload your business certificate',
      uploadLabel: null,
      uploadDescription:
        'Sangira verifies every organisation before activation. Upload a clear photo or PDF of your business registration certificate (max 5 MB).',
      dropzonePrompt: 'Click to upload or drag and drop',
      dropzoneHint: (acceptedLabel: string, maxSizeMb: number) =>
        `${acceptedLabel} (max ${maxSizeMb} MB)`,
      slaBannerPosition: 'above-dropzone' as const,
    },
    ngo: {
      heading: 'Verify your organisation',
      uploadLabel: 'Proof of organisational registration',
      uploadDescription:
        'Sangira verifies every organisation before activation. Upload a clear photo or PDF of your registration certificate (max 5 MB).',
      dropzonePrompt: 'Drop file here or click to browse',
      dropzoneHint: 'PNG, JPG, or PDF up to 5MB',
      slaBannerPosition: 'below-submit' as const,
    },
  },
  ngoFields: {
    registrationNumberLabel: 'Organisational registration number',
    dailyCapacityLabel: 'Daily intake capacity',
    transportLabel: 'We have our own transport',
  },
  slaBanner: 'Most reviews are completed within 2 business days.',
  confirmationLabel:
    'I confirm this document is current and belongs to my organisation',
  submitLabel: 'Submit for verification',
  dropzone: {
    ariaLabel: 'Upload verification document',
  },
  uploadedFile: {
    readyLabel: 'Ready to submit',
    replaceLabel: 'Replace',
  },
  validation: {
    invalidType: (acceptedLabel: string) => `File must be ${acceptedLabel}`,
    tooLarge: (maxSizeMb: number) => `File must be under ${maxSizeMb} MB`,
    confirmationRequired: 'Please confirm your document is current',
    registrationNumberRequired:
      'Organisational registration number is required',
    dailyCapacityMin: 'Daily intake capacity must be zero or greater',
  },
  submit: {
    loading: 'Submitting for verification…',
    success: 'Submitted — your organisation is pending review',
    error: 'Something went wrong, please try again.',
  },
} as const

export const numberStepperContent = {
  decreaseLabel: 'Decrease value',
  increaseLabel: 'Increase value',
  ariaLabel: (label: string, value: number, unitLabel: string) =>
    `${label}: ${value} ${unitLabel}`,
} as const

export function getRegisterStep3Copy(role: UserRole) {
  return registerStep3Content.copyByRole[role]
}

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
