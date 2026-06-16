import { useEffect } from 'react'
import { VERIFICATION_POLL_INTERVAL_MS } from '../constants/pending-verification'
import { useAuth } from '../auth/use-auth'

/** Lightweight poll + focus refresh so verification gates can re-route on approval */
export function useVerificationPoll() {
  const { refreshMe, state } = useAuth()

  useEffect(() => {
    if (state.status !== 'authed') {
      return
    }

    const intervalId = window.setInterval(() => {
      void refreshMe()
    }, VERIFICATION_POLL_INTERVAL_MS)

    const handleFocus = () => {
      void refreshMe()
    }

    window.addEventListener('focus', handleFocus)

    return () => {
      window.clearInterval(intervalId)
      window.removeEventListener('focus', handleFocus)
    }
  }, [refreshMe, state.status])
}
