import { useAdminVerification } from '../realtime/admin-verification-context'

type UseAdminPendingCountState = {
  count: number | null
  loadState: 'loading' | 'ready' | 'error'
}

export function useAdminPendingCount(): UseAdminPendingCountState {
  const { pendingCount, loadState } = useAdminVerification()
  return { count: pendingCount, loadState }
}
