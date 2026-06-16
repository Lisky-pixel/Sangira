import { Navigate } from 'react-router'
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
    return (
      <Navigate
        to={resolveVerificationRoute(state.verificationStatus)}
        replace
      />
    )
  }

  return children
}
