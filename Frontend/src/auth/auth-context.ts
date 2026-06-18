import { createContext } from 'react'
import type { AccountStatus } from '../constants/account-status'
import type { VerificationStatus } from '../constants/verification-status'
import type { AuthSession, AuthState, AuthUser } from './types'

export type AuthContextValue = {
  state: AuthState
  login: (email: string, password: string) => Promise<AuthSession>
  logout: () => Promise<void>
  clearLocalSession: () => void
  refreshMe: () => Promise<AuthSession | null>
  establishSession: (
    user: AuthUser,
    verificationStatus: VerificationStatus,
    accountStatus?: AccountStatus,
  ) => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)
