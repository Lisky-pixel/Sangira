import { ADMIN_USER_ENFORCEMENT } from '../constants/admin-users'

export const participantEnforcementContent = {
  suspendedTitle: 'Account suspended',
  revokedTitle: 'Verification revoked',
  suspendedMessage: ADMIN_USER_ENFORCEMENT.SUSPENDED_MESSAGE,
  revokedMessage: ADMIN_USER_ENFORCEMENT.REVOKED_MESSAGE,
  editsBlockedNote:
    'Profile and settings cannot be changed while your account is restricted.',
  resubmitLabel: 'Resubmit for verification',
  resubmitWithDocumentLabel: 'Upload new document',
  resubmitLoading: 'Submitting for review…',
  resubmitSuccess:
    'Your application has been resubmitted. An admin will review it shortly.',
  resubmitError: 'Could not resubmit. Please try again.',
} as const
