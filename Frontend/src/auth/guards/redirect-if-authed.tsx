import { Navigate } from 'react-router'
import { ADMIN_ROLE } from '../../constants/portal-roles'
import { resolvePortalRoute } from '../../constants/portal-routes'
import { useAuth } from '../use-auth'
import { resolveVerificationRoute } from '../verification-routes'
import { AuthLoading } from './auth-loading'

type RedirectIfAuthedProps = {
  children: React.ReactNode
}

export function RedirectIfAuthed({ children }: RedirectIfAuthedProps) {
  const { state } = useAuth()

  if (state.status === 'loading') {
    return <AuthLoading />
  }

  if (state.status === 'authed') {
    if (state.user.role === ADMIN_ROLE) {
      return <Navigate to={resolvePortalRoute(ADMIN_ROLE)} replace />
    }

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
