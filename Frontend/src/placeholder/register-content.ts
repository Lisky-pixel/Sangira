export const headerMinimalContent = {
  brand: 'Sangira',
  needHelpLabel: 'Need help?',
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
  stepOfTotal: (step: number, total: number) => `Step ${step} of ${total}`,
} as const
