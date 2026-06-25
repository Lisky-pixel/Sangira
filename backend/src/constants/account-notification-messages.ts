import { SUPPORT_EMAIL } from './support.js'

export const ACCOUNT_FLAGGED_NOTIFICATION = {
  TITLE: 'Account flagged for review',
  BODY: `Your account has been flagged for review. You can still use Sangira normally; contact ${SUPPORT_EMAIL} with questions.`,
} as const

export const ACCOUNT_UNFLAGGED_NOTIFICATION = {
  TITLE: 'Account flag cleared',
  BODY: 'Your account flag has been cleared. Your account is in good standing.',
} as const
