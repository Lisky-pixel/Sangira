import type { UserRole } from '../../constants/registration-roles'

export type RegistrationDocument = {
  file: File
  filename: string
  size: number
}

export type RegistrationState = {
  role: UserRole | null
  organisationName: string
  contactName: string
  phone: string
  email: string
  password: string
  documents: RegistrationDocument[]
  registrationNumber: string
  dailyCapacity: number
  transportAvailable: boolean
  // TODO: NGO sector (orphanage | shelter | community_centre) — unset at registration
}

export const initialRegistrationState: RegistrationState = {
  role: null,
  organisationName: '',
  contactName: '',
  phone: '',
  email: '',
  password: '',
  documents: [],
  registrationNumber: '',
  dailyCapacity: 0,
  transportAvailable: false,
}

export type RegistrationDetailsPayload = Pick<
  RegistrationState,
  'organisationName' | 'contactName' | 'phone' | 'email' | 'password'
>

export type RegistrationNgoFieldsPayload = Pick<
  RegistrationState,
  'registrationNumber' | 'dailyCapacity' | 'transportAvailable'
>

export type RegistrationAction =
  | { type: 'SET_ROLE'; role: UserRole }
  | { type: 'SET_DETAILS'; payload: RegistrationDetailsPayload }
  | { type: 'SET_DOCUMENT'; document: RegistrationDocument | null }
  | { type: 'SET_NGO_FIELDS'; payload: RegistrationNgoFieldsPayload }
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
    case 'SET_DOCUMENT':
      return {
        ...state,
        documents: action.document ? [action.document] : [],
      }
    case 'SET_NGO_FIELDS':
      return { ...state, ...action.payload }
    case 'RESET':
      return initialRegistrationState
    default:
      return state
  }
}
