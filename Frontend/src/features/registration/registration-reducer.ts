import type { UserRole } from '../../constants/registration-roles'

export type RegistrationDocument = {
  id: string
  name: string
}

export type RegistrationState = {
  role: UserRole | null
  organisationName: string
  contactName: string
  phone: string
  email: string
  password: string
  documents: RegistrationDocument[]
}

export const initialRegistrationState: RegistrationState = {
  role: null,
  organisationName: '',
  contactName: '',
  phone: '',
  email: '',
  password: '',
  documents: [],
}

export type RegistrationDetailsPayload = Pick<
  RegistrationState,
  'organisationName' | 'contactName' | 'phone' | 'email' | 'password'
>

export type RegistrationAction =
  | { type: 'SET_ROLE'; role: UserRole }
  | { type: 'SET_DETAILS'; payload: RegistrationDetailsPayload }
  | { type: 'SET_DOCUMENTS'; documents: RegistrationDocument[] }
  | { type: 'RESET' }

export function registrationReducer(
  state: RegistrationState,
  action: RegistrationAction,
): RegistrationState {
  switch (action.type) {
    case 'SET_ROLE':
      return { ...state, role: action.role }
    case 'SET_DETAILS':
      return { ...state, ...action.payload }
    case 'SET_DOCUMENTS':
      return { ...state, documents: action.documents }
    case 'RESET':
      return initialRegistrationState
    default:
      return state
  }
}
