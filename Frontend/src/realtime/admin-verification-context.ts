import { createContext, useContext } from 'react'
import type {
  VerificationNewPayload,
  VerificationUpdatedPayload,
} from '../types/admin-verification'

export type AdminVerificationContextValue = {
  /**
   * Pending (waiting) applications only — shared by sidebar badge and queue
   * header "awaiting review". Sourced from /pending-count, list totalPending,
   * approve/reject pendingCount, and socket pendingCount — never totalItems.
   */
  pendingBadgeCount: number | null
  loadState: 'loading' | 'ready' | 'error'
  refreshPendingBadgeCount: () => Promise<void>
  syncPendingBadgeCount: (count: number) => void
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
