import { Navigate } from 'react-router'
import type { PortalRole } from '../../constants/portal-roles'
import { isPortalRole } from '../../constants/portal-roles'
import { resolvePortalRoute } from '../../constants/portal-routes'
import { ROUTES } from '../../routes/paths'
import { useAuth } from '../use-auth'
import { AuthLoading } from './auth-loading'

type RequireRoleProps = {
  role: PortalRole
  children: React.ReactNode
}

export function RequireRole({ role, children }: RequireRoleProps) {
  const { state } = useAuth()

  if (state.status === 'loading') {
    return <AuthLoading />
  }

  if (state.status === 'guest') {
    return null
  }

  const userRole = isPortalRole(state.user.role) ? state.user.role : null

  if (userRole !== role) {
    if (userRole) {
      return <Navigate to={resolvePortalRoute(userRole)} replace />
    }
    return <Navigate to={ROUTES.HOME} replace />
  }

  return children
}
