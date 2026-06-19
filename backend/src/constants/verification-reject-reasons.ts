export const VERIFICATION_REJECT_REASON = {
  ILLEGIBLE_DOCUMENT: 'illegible_document',
  INVALID_REGISTRATION: 'invalid_registration',
  INCOMPLETE_INFORMATION: 'incomplete_information',
  DUPLICATE_APPLICATION: 'duplicate_application',
  OTHER: 'other',
} as const

export type VerificationRejectReasonCode =
  (typeof VERIFICATION_REJECT_REASON)[keyof typeof VERIFICATION_REJECT_REASON]

export const VERIFICATION_REJECT_REASON_VALUES = Object.values(
  VERIFICATION_REJECT_REASON,
)

export const VERIFICATION_REJECT_REASON_LABELS: Record<
  VerificationRejectReasonCode,
  string
> = {
  [VERIFICATION_REJECT_REASON.ILLEGIBLE_DOCUMENT]: 'Illegible document',
  [VERIFICATION_REJECT_REASON.INVALID_REGISTRATION]: 'Invalid registration',
  [VERIFICATION_REJECT_REASON.INCOMPLETE_INFORMATION]: 'Incomplete information',
  [VERIFICATION_REJECT_REASON.DUPLICATE_APPLICATION]: 'Duplicate application',
  [VERIFICATION_REJECT_REASON.OTHER]: 'Other',
}
