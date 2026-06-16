export const REGISTRATION_TOTAL_STEPS = 3

export const REGISTRATION_STEP_PATHS = {
  ROLE: '',
  DETAILS: 'details',
  DOCUMENTS: 'documents',
} as const

export function getRegistrationStepFromPathname(pathname: string): number {
  if (pathname.includes('/register/documents')) return 3
  if (pathname.includes('/register/details')) return 2
  return 1
}

export function getPreviousRegistrationStepPath(currentStep: number): string {
  if (currentStep === 3) return REGISTRATION_STEP_PATHS.DETAILS
  if (currentStep === 2) return REGISTRATION_STEP_PATHS.ROLE
  return REGISTRATION_STEP_PATHS.ROLE
}
