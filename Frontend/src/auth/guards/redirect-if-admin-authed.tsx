import { Navigate } from 'react-router'
import { ADMIN_ROLE } from '../../constants/portal-roles'
import { isPortalRole } from '../../constants/portal-roles'
import { ROUTES } from '../../routes/paths'
import { useAuth } from '../use-auth'
import { resolveVerificationRoute } from '../verification-routes'
import { AuthLoading } from './auth-loading'

type RedirectIfAdminAuthedProps = {
  children: React.ReactNode
}

export function RedirectIfAdminAuthed({ children }: RedirectIfAdminAuthedProps) {
  const { state } = useAuth()

  if (state.status === 'loading') {
    return <AuthLoading />
  }

  if (state.status === 'authed') {
    if (state.user.role === ADMIN_ROLE) {
      return <Navigate to={ROUTES.ADMIN_OVERVIEW} replace />
    }

    const portalRole = isPortalRole(state.user.role) ? state.user.role : null
    if (portalRole) {
      return (
        <Navigate
          to={resolveVerificationRoute(state.verificationStatus, {
            role: state.user.role,
          })}
          replace
        />
      )
    }

    return <Navigate to={ROUTES.HOME} replace />
  }

  return children
}
