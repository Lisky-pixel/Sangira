import { useContext } from 'react'
import { AdminPlatformSettingsContext } from '../realtime/admin-platform-settings-context'

export function useAdminPlatformSettings() {
  const context = useContext(AdminPlatformSettingsContext)
  if (!context) {
    throw new Error(
      'useAdminPlatformSettings must be used within AdminPlatformSettingsProvider',
    )
  }
  return context
}
