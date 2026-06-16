import { Navigate, useLocation } from 'react-router'
import { ROUTES } from '../../routes/paths'
import { useAuth } from '../use-auth'
import { AuthLoading } from './auth-loading'

type RequireAuthProps = {
  children: React.ReactNode
}

export function RequireAuth({ children }: RequireAuthProps) {
  const { state } = useAuth()
  const location = useLocation()

  if (state.status === 'loading') {
    return <AuthLoading />
  }

  if (state.status === 'guest') {
    return (
      <Navigate
        to={ROUTES.SIGN_IN}
        replace
        state={{ from: location.pathname }}
      />
    )
  }

  return children
}
