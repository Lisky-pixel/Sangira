import { useCallback } from 'react'
import { useNavigate } from 'react-router'
import { useAuth } from '../auth'
import { ROUTES } from '../routes/paths'
import { authService } from '../services/auth-service'

export function useAdminLogout() {
  const { clearLocalSession } = useAuth()
  const navigate = useNavigate()

  return useCallback(async () => {
    try {
      await authService.logout()
    } catch {
      // Clear local session even if the network call fails.
    } finally {
      clearLocalSession()
      navigate(ROUTES.ADMIN_LOGIN, { replace: true })
    }
  }, [clearLocalSession, navigate])
}
