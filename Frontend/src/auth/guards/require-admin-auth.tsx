import { Navigate } from 'react-router'
import { ROUTES } from '../../routes/paths'
import { useAuth } from '../use-auth'
import { AuthLoading } from './auth-loading'

type RequireAdminAuthProps = {
  children: React.ReactNode
}

export function RequireAdminAuth({ children }: RequireAdminAuthProps) {
  const { state } = useAuth()

  if (state.status === 'loading') {
    return <AuthLoading />
  }

  if (state.status === 'guest') {
    return <Navigate to={ROUTES.ADMIN_LOGIN} replace />
  }

  return children
}
