import { Navigate } from 'react-router'
import { VERIFICATION_STATUS } from '../../constants/verification-status'
import { useAuth } from '../use-auth'
import { resolveVerificationRoute } from '../verification-routes'
import { AuthLoading } from './auth-loading'

type RequireVerificationProps = {
  children: React.ReactNode
}

/** Portal routes — only approved accounts pass through */
export function RequireVerification({ children }: RequireVerificationProps) {
  const { state } = useAuth()

  if (state.status === 'loading') {
    return <AuthLoading />
  }

  if (state.status === 'guest') {
    return null
  }

  if (state.verificationStatus !== VERIFICATION_STATUS.APPROVED) {
    return (
      <Navigate
        to={resolveVerificationRoute(state.verificationStatus)}
        replace
      />
    )
  }

  return children
}
