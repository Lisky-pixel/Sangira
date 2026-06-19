import { useCallback, useEffect, useRef, useState } from 'react'
import { ngoDashboardService } from '../services/ngo-dashboard-service'
import type { NgoDashboardData } from '../types/ngo-dashboard'

export type NgoDashboardLoadState = 'loading' | 'ready' | 'error'

export function useNgoDashboard() {
  const [dashboard, setDashboard] = useState<NgoDashboardData | null>(null)
  const [loadState, setLoadState] = useState<NgoDashboardLoadState>('loading')
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
      const { dashboard: data } = await ngoDashboardService.getNgoDashboard()
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
