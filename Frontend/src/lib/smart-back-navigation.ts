import { resolvePortalRoute } from '../constants/portal-routes'
import { ROUTES } from '../routes/paths'

/** True when the browser history stack has a prior entry in this session. */
export function canNavigateBackInSession(): boolean {
  if (typeof window === 'undefined') {
    return false
  }

  const idx = (window.history.state as { idx?: number } | null)?.idx
  return typeof idx === 'number' && idx > 0
}

export function resolveSmartBackFallback(role: string | null): string {
  if (role) {
    return resolvePortalRoute(role)
  }

  return ROUTES.HOME
}
