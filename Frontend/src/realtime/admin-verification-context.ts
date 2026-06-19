import { createContext, useContext } from 'react'
import type {
  VerificationNewPayload,
  VerificationUpdatedPayload,
} from '../types/admin-verification'

export type AdminVerificationContextValue = {
  pendingCount: number | null
  loadState: 'loading' | 'ready' | 'error'
  refreshPendingCount: () => Promise<void>
  decrementPendingCount: () => void
  subscribeVerificationUpdated: (
    handler: (payload: VerificationUpdatedPayload) => void,
  ) => () => void
  subscribeVerificationNew: (
    handler: (payload: VerificationNewPayload) => void,
  ) => () => void
}

export const AdminVerificationContext =
  createContext<AdminVerificationContextValue | null>(null)

export function useAdminVerification() {
  const context = useContext(AdminVerificationContext)
  if (!context) {
    throw new Error(
      'useAdminVerification must be used within AdminVerificationProvider',
    )
  }
  return context
}
