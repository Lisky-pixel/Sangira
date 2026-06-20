import { createContext } from 'react'

export type AdminPlatformSettingsContextValue = {
  verificationSlaTargetHours: number
  setVerificationSlaTargetHours: (hours: number) => void
  loadState: 'loading' | 'ready' | 'error'
}

export const AdminPlatformSettingsContext =
  createContext<AdminPlatformSettingsContextValue | null>(null)
