import { useEffect, useState, type ReactNode } from 'react'
import { VERIFICATION_SLA_TARGET_HOURS } from '../constants/platform-settings'
import { adminSettingsService } from '../services/admin-profile-service'
import { AdminPlatformSettingsContext } from './admin-platform-settings-context'

export function AdminPlatformSettingsProvider({
  children,
}: {
  children: ReactNode
}) {
  const [verificationSlaTargetHours, setVerificationSlaTargetHours] =
    useState<number>(VERIFICATION_SLA_TARGET_HOURS.DEFAULT)
  const [loadState, setLoadState] = useState<'loading' | 'ready' | 'error'>(
    'loading',
  )

  useEffect(() => {
    let cancelled = false

    void (async () => {
      try {
        const settings = await adminSettingsService.getSettings()
        if (!cancelled) {
          setVerificationSlaTargetHours(settings.verificationSlaTargetHours)
          setLoadState('ready')
        }
      } catch {
        if (!cancelled) {
          setLoadState('error')
        }
      }
    })()

    return () => {
      cancelled = true
    }
  }, [])

  return (
    <AdminPlatformSettingsContext.Provider
      value={{
        verificationSlaTargetHours,
        setVerificationSlaTargetHours,
        loadState,
      }}
    >
      {children}
    </AdminPlatformSettingsContext.Provider>
  )
}
