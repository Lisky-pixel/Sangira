import { useEffect, useState } from 'react'
import { adminPortalService } from '../services/admin-portal-service'

type UseAdminPendingCountState = {
  count: number | null
  loadState: 'loading' | 'ready' | 'error'
}

export function useAdminPendingCount(): UseAdminPendingCountState {
  const [count, setCount] = useState<number | null>(null)
  const [loadState, setLoadState] =
    useState<UseAdminPendingCountState['loadState']>('loading')

  useEffect(() => {
    let cancelled = false

    const load = async () => {
      setLoadState('loading')
      try {
        const pendingCount =
          await adminPortalService.getPendingVerificationCount()
        if (!cancelled) {
          setCount(pendingCount)
          setLoadState('ready')
        }
      } catch {
        if (!cancelled) {
          setCount(null)
          setLoadState('error')
        }
      }
    }

    void load()

    return () => {
      cancelled = true
    }
  }, [])

  return { count, loadState }
}
