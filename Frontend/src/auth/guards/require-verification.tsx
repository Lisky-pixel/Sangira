import { Navigate } from 'react-router'
import { VERIFICATION_STATUS } from '../../constants/verification-status'
import { useAuth } from '../use-auth'
import { resolveVerificationRoute } from '../verification-routes'
import { AuthLoading } from './auth-loading'

type RequireVerificationProps = {
  children: React.ReactNode
}

const PORTAL_VERIFICATION_STATUSES = [
  VERIFICATION_STATUS.APPROVED,
  VERIFICATION_STATUS.REVOKED,
] as const

/** Portal routes — approved and revoked (read-only) accounts pass through */
export function RequireVerification({ children }: RequireVerificationProps) {
  const { state } = useAuth()

  if (state.status === 'loading') {
    return <AuthLoading />
  }

  if (state.status === 'guest') {
    return null
  }

  if (
    !PORTAL_VERIFICATION_STATUSES.includes(
      state.verificationStatus as (typeof PORTAL_VERIFICATION_STATUSES)[number],
    )
  ) {
    return (
      <Navigate
        to={resolveVerificationRoute(state.verificationStatus, {
          role: state.user.role,
        })}
        replace
      />
    )
  }

  return children
}
