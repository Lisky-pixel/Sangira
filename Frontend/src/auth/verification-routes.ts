import {
  VERIFICATION_STATUS,
  type VerificationStatus,
} from '../constants/verification-status'
import { ROUTES } from '../routes/paths'

export function resolveVerificationRoute(status: VerificationStatus): string {
  switch (status) {
    case VERIFICATION_STATUS.PENDING:
      return ROUTES.REGISTER_PENDING
    case VERIFICATION_STATUS.REJECTED:
      return ROUTES.REGISTER_REJECTED
    case VERIFICATION_STATUS.APPROVED:
      return ROUTES.HOME
    default:
      return ROUTES.REGISTER_PENDING
  }
}
