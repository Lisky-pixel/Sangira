import { useCallback, useEffect, useRef, useState } from 'react'
import { ngoImpactService } from '../services/ngo-impact-service'
import type { NgoImpactSummary } from '../types/ngo-impact'

export type NgoImpactLoadState = 'loading' | 'ready' | 'error'

export function useNgoImpact() {
  const [impact, setImpact] = useState<NgoImpactSummary | null>(null)
  const [loadState, setLoadState] = useState<NgoImpactLoadState>('loading')
  const inFlightRef = useRef(false)

  const fetchImpact = useCallback(async () => {
    if (inFlightRef.current) {
      return
    }

    inFlightRef.current = true
    setLoadState('loading')

    try {
      const { impact: data } = await ngoImpactService.getNgoImpact()
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
