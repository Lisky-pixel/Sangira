import type { AccountStatus } from '../constants/account-status'
import type { NotificationPreferences } from '../constants/notification-preferences'
import type { VerificationStatus } from '../constants/verification-status'
import type { VerificationDocumentLike } from '../lib/display-filename'

export type AuthUser = {
  _id: string
  email: string
  role: string
  accountStatus: AccountStatus
  notificationPrefs?: NotificationPreferences
  organisationName?: string
  contactName?: string
  phone?: string
  avatarUrl?: string
  pickupAddress?: string
  registrationNumber?: string
  passwordChangedAt?: string
  createdAt?: string
  verification?: {
    status?: VerificationStatus
    reason?: string
    reviewedAt?: string | Date
    documents?: VerificationDocumentLike[]
  }
  [key: string]: unknown
}

export type AuthSession = {
  user: AuthUser
  verificationStatus: VerificationStatus
  accountStatus: AccountStatus
}

export type AuthStatus = 'loading' | 'authed' | 'guest'

export type AuthState =
  | { status: 'loading' }
  | { status: 'guest' }
  | ({ status: 'authed' } & AuthSession)
