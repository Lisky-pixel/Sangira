import { useAuth } from '../auth'
import { ACCOUNT_STATUS } from '../constants/account-status'
import { VERIFICATION_STATUS } from '../constants/verification-status'
import { participantEnforcementContent } from '../placeholder/participant-enforcement-content'

export type ParticipantEditBlockReason = 'suspended' | 'revoked' | null

export function useParticipantEditBlocked() {
  const { state } = useAuth()

  if (state.status !== 'authed') {
    return {
      blocked: false,
      reason: null as ParticipantEditBlockReason,
      message: null as string | null,
    }
  }

  if (state.accountStatus === ACCOUNT_STATUS.SUSPENDED) {
    return {
      blocked: true,
      reason: 'suspended' as const,
      message: participantEnforcementContent.suspendedMessage,
    }
  }

  if (state.verificationStatus === VERIFICATION_STATUS.REVOKED) {
    return {
      blocked: true,
      reason: 'revoked' as const,
      message: participantEnforcementContent.revokedMessage,
    }
  }

  return {
    blocked: false,
    reason: null as ParticipantEditBlockReason,
    message: null as string | null,
  }
}
