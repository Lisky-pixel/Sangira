import { Navigate } from 'react-router'
import type { UserRole } from '../../constants/registration-roles'
import { resolvePortalRoute } from '../../constants/portal-routes'
import { isUserRole } from '../../constants/registration-roles'
import { useAuth } from '../use-auth'
import { AuthLoading } from './auth-loading'

type RequireRoleProps = {
  role: UserRole
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

  const userRole = isUserRole(state.user.role) ? state.user.role : null

  if (userRole !== role) {
    if (userRole) {
      return <Navigate to={resolvePortalRoute(userRole)} replace />
    }
    return <Navigate to="/" replace />
  }

  return children
}
