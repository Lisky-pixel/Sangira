import { useNavigate } from 'react-router'
import { useAuth } from '../auth'
import {
  canNavigateBackInSession,
  resolveSmartBackFallback,
} from '../lib/smart-back-navigation'

export function useSmartBack() {
  const navigate = useNavigate()
  const { state } = useAuth()
  const role = state.status === 'authed' ? state.user.role : null

  return () => {
    if (canNavigateBackInSession()) {
      navigate(-1)
      return
    }

    navigate(resolveSmartBackFallback(role), { replace: true })
  }
}
