import { useCallback, useEffect, useRef, useState } from 'react'
import { dashboardService } from '../services/donor-impact-service'
import type { DonorDashboardData } from '../types/donor-impact'

export type DonorDashboardLoadState = 'loading' | 'ready' | 'error'

export function useDonorDashboard() {
  const [dashboard, setDashboard] = useState<DonorDashboardData | null>(null)
  const [loadState, setLoadState] = useState<DonorDashboardLoadState>('loading')
  const inFlightRef = useRef(false)

  const fetchDashboard = useCallback(async (background = false) => {
    if (inFlightRef.current) {
      return
    }

    inFlightRef.current = true

    if (!background) {
      setLoadState('loading')
    }

    try {
      const { dashboard: data } = await dashboardService.getDonorDashboard()
      setDashboard(data)
      setLoadState('ready')
    } catch {
      if (!background) {
        setLoadState('error')
      }
    } finally {
      inFlightRef.current = false
    }
  }, [])

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void fetchDashboard()
    }, 0)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [fetchDashboard])

  useEffect(() => {
    const handleFocus = () => {
      void fetchDashboard(true)
    }

    window.addEventListener('focus', handleFocus)
    return () => window.removeEventListener('focus', handleFocus)
  }, [fetchDashboard])

  return { dashboard, loadState, refetch: fetchDashboard }
}
