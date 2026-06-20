import { NOTIFICATION_TYPE } from '../constants/enums.js'

export const ADMIN_NOTIFICATION_TITLE = {
  [NOTIFICATION_TYPE.VERIFICATION_SUBMITTED]: 'New verification submitted',
} as const

export function formatAdminVerificationSubmittedBody(input: {
  organisationName: string
  roleLabel: string
}): string {
  const organisation =
    input.organisationName.trim() || 'An organisation'
  return `${organisation} (${input.roleLabel}) submitted documents for review`
}
