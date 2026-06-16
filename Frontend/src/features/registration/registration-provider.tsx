import { useMemo, useReducer, type ReactNode } from 'react'
import { RegistrationContext } from './registration-context-value'
import {
  initialRegistrationState,
  registrationReducer,
} from './registration-reducer'

type RegistrationProviderProps = {
  children: ReactNode
}

export function RegistrationProvider({ children }: RegistrationProviderProps) {
  // TODO: optional sessionStorage refresh-resilience upgrade
  const [state, dispatch] = useReducer(
    registrationReducer,
    initialRegistrationState,
  )

  const value = useMemo(
    () => ({
      state,
      dispatch,
    }),
    [state],
  )

  return (
    <RegistrationContext.Provider value={value}>
      {children}
    </RegistrationContext.Provider>
  )
}
