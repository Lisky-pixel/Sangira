import { useCallback, useEffect, useRef, useState } from 'react'
import { impactService } from '../services/donor-impact-service'
import type { DonorImpactSummary } from '../types/donor-impact'

export type DonorImpactLoadState = 'loading' | 'ready' | 'error'

export function useDonorImpact() {
  const [impact, setImpact] = useState<DonorImpactSummary | null>(null)
  const [loadState, setLoadState] = useState<DonorImpactLoadState>('loading')
  const inFlightRef = useRef(false)

  const fetchImpact = useCallback(async () => {
    if (inFlightRef.current) {
      return
    }

    inFlightRef.current = true
    setLoadState('loading')

    try {
      const { impact: data } = await impactService.getDonorImpact()
      setImpact(data)
      setLoadState('ready')
    } catch {
      setLoadState('error')
    } finally {
      inFlightRef.current = false
    }
  }, [])

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void fetchImpact()
    }, 0)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [fetchImpact])

  return { impact, loadState, refetch: fetchImpact }
}
