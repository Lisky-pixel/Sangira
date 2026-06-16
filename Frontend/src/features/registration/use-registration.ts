import { useContext } from 'react'
import { RegistrationContext } from './registration-context-value'

export function useRegistration() {
  const context = useContext(RegistrationContext)

  if (!context) {
    throw new Error('useRegistration must be used within RegistrationProvider')
  }

  return context
}
