import { createContext } from 'react'
import type { Dispatch } from 'react'
import type {
  RegistrationAction,
  RegistrationState,
} from './registration-reducer'

export type RegistrationContextValue = {
  state: RegistrationState
  dispatch: Dispatch<RegistrationAction>
}

export const RegistrationContext =
  createContext<RegistrationContextValue | null>(null)
