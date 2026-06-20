import { useAdminVerification } from '../realtime/admin-verification-context'
import { resolvePendingCountForDisplay } from '../lib/admin-pending-badge'

type UseAdminPendingCountState = {
  /** Raw pending count from context — null while loading or on error */
  count: number | null
  /** Normalized count for sidebar badge and queue header "awaiting review" */
  displayCount: number
  loadState: 'loading' | 'ready' | 'error'
}

/** Sidebar badge + queue header — pending (waiting) applications only */
export function useAdminPendingCount(): UseAdminPendingCountState {
  const { pendingBadgeCount, loadState } = useAdminVerification()
  return {
    count: pendingBadgeCount,
    displayCount: resolvePendingCountForDisplay(pendingBadgeCount),
    loadState,
  }
}
