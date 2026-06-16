import { Navigate } from 'react-router'
import type { VerificationStatus } from '../../constants/verification-status'
import { useAuth } from '../use-auth'
import { resolveVerificationRoute } from '../verification-routes'
import { AuthLoading } from './auth-loading'

type VerificationStatusGateProps = {
  allowed: VerificationStatus[]
  children: React.ReactNode
}

/** TEMPORARY — gates pending/rejected placeholders until S3a / S3b ship */
export function VerificationStatusGate({
  allowed,
  children,
}: VerificationStatusGateProps) {
  const { state } = useAuth()

  if (state.status === 'loading') {
    return <AuthLoading />
  }

  if (state.status === 'guest') {
    return null
  }

  if (!allowed.includes(state.verificationStatus)) {
    return (
      <Navigate
        to={resolveVerificationRoute(state.verificationStatus)}
        replace
      />
    )
  }

  return children
}
