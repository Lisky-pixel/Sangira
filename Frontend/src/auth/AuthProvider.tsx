import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { useNavigate } from 'react-router'
import { ACCOUNT_STATUS } from '../constants/account-status'
import { ROUTES } from '../routes/paths'
import {
  authService,
} from '../services/auth-service'
import { ApiError } from '../services/api-error'
import {
  clearCsrfToken,
  ensureCsrfToken,
  setAuthFailureHandler,
} from '../services/api-client'
import { AuthContext, type AuthContextValue } from './auth-context'
import type { AuthSession, AuthState, AuthUser } from './types'
import type { AccountStatus } from '../constants/account-status'
import type { VerificationStatus } from '../constants/verification-status'
import { AuthLoading } from './guards/auth-loading'

type AuthProviderProps = {
  children: ReactNode
}

function toSession(
  user: AuthUser,
  verificationStatus: VerificationStatus,
  accountStatus?: AccountStatus,
): AuthSession {
  return {
    user,
    verificationStatus,
    accountStatus: accountStatus ?? user.accountStatus,
  }
}

export function AuthProvider({ children }: AuthProviderProps) {
  const navigate = useNavigate()
  const [state, setState] = useState<AuthState>({ status: 'loading' })

  const establishSession = useCallback(
    (
      user: AuthUser,
      verificationStatus: VerificationStatus,
      accountStatus?: AccountStatus,
    ) => {
      setState({
        status: 'authed',
        ...toSession(user, verificationStatus, accountStatus),
      })
    },
    [],
  )

  const clearSession = useCallback(() => {
    setState({ status: 'guest' })
  }, [])

  const refreshMe = useCallback(async () => {
    try {
      const data = await authService.getMe()
      const session = toSession(
        data.user,
        data.verificationStatus,
        data.accountStatus,
      )
      setState({ status: 'authed', ...session })
      return session
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        clearSession()
        return null
      }
      throw error
    }
  }, [clearSession])

  const login = useCallback(
    async (identifier: string, password: string) => {
      const data = await authService.login(identifier, password)
      const session = toSession(data.user, data.verificationStatus)

      if (
        session.accountStatus === ACCOUNT_STATUS.SUSPENDED ||
        session.accountStatus === ACCOUNT_STATUS.REVOKED
      ) {
        throw new ApiError(
          'This account has been suspended or revoked',
          'ACCOUNT_BLOCKED',
          { status: 403 },
        )
      }

      setState({ status: 'authed', ...session })
      return session
    },
    [],
  )

  const clearLocalSession = useCallback(() => {
    clearCsrfToken()
    clearSession()
  }, [clearSession])

  const logout = useCallback(async () => {
    try {
      await authService.logout()
    } catch {
      // Clear local session even if the network call fails.
    } finally {
      clearLocalSession()
      navigate(ROUTES.HOME, { replace: true })
    }
  }, [clearLocalSession, navigate])

  useEffect(() => {
    let cancelled = false

    async function bootstrap() {
      try {
        await ensureCsrfToken()
        const data = await authService.getMe()

        if (cancelled) return

        establishSession(
          data.user,
          data.verificationStatus,
          data.accountStatus,
        )
      } catch (error) {
        if (cancelled) return

        if (error instanceof ApiError && error.status === 401) {
          clearSession()
          return
        }

        clearSession()
      }
    }

    void bootstrap()

    return () => {
      cancelled = true
    }
  }, [clearSession, establishSession])

  useEffect(() => {
    setAuthFailureHandler(() => {
      clearLocalSession()
      navigate(ROUTES.SIGN_IN, { replace: true })
    })

    return () => {
      setAuthFailureHandler(null)
    }
  }, [clearLocalSession, navigate])

  const value = useMemo<AuthContextValue>(
    () => ({
      state,
      login,
      logout,
      clearLocalSession,
      refreshMe,
      establishSession,
    }),
    [clearLocalSession, establishSession, login, logout, refreshMe, state],
  )

  if (state.status === 'loading') {
    return <AuthLoading />
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
