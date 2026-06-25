import { useEffect, useState } from 'react'
import type { PublicPlatformStats } from '../types/public-stats'
import { publicStatsService } from '../services/public-stats-service'

type PublicStatsLoadState = 'loading' | 'ready' | 'error'

export function usePublicPlatformStats() {
  const [loadState, setLoadState] = useState<PublicStatsLoadState>('loading')
  const [stats, setStats] = useState<PublicPlatformStats | null>(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoadState('loading')
      try {
        const result = await publicStatsService.getPublicStats()
        if (!cancelled) {
          setStats(result.stats)
          setLoadState('ready')
        }
      } catch {
        if (!cancelled) {
          setStats(null)
          setLoadState('error')
        }
      }
    }

    void load()

    return () => {
      cancelled = true
    }
  }, [])

  return { loadState, stats }
}
