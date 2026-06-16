import type { UserRole } from '../constants/registration-roles'
import type { VerificationStatus } from '../constants/verification-status'
import type { AuthUser } from '../auth/types'
import type { RegistrationDocument } from '../features/registration/registration-reducer'
import type { ApiEnvelope } from '../types/api'
import { normalizePhone } from '../constants/phone'
import { apiClient } from './api-client'
import { unwrapApiResponse } from './api-response'

export type RegistrationNgoPayload = {
  registrationNumber: string
  dailyCapacity: number
  transportAvailable: boolean
}

export type RegistrationSubmitPayload = {
  role: UserRole
  organisationName: string
  contactName: string
  phone: string
  email: string
  password: string
  document: File
  ngo?: RegistrationNgoPayload
}

export type RegistrationSubmitResponse = {
  user: AuthUser
  verificationStatus: VerificationStatus
}

function appendRegistrationFields(
  formData: FormData,
  payload: RegistrationSubmitPayload,
) {
  formData.append('role', payload.role)
  formData.append('organisationName', payload.organisationName)
  formData.append('contactName', payload.contactName)
  formData.append('phone', payload.phone)
  formData.append('email', payload.email)
  formData.append('password', payload.password)
  formData.append('document', payload.document)

  if (payload.ngo) {
    formData.append('registrationNumber', payload.ngo.registrationNumber)
    formData.append('dailyCapacity', String(payload.ngo.dailyCapacity))
    formData.append(
      'transportAvailable',
      String(payload.ngo.transportAvailable),
    )
  }
}

export async function submitRegistration(
  payload: RegistrationSubmitPayload,
): Promise<RegistrationSubmitResponse> {
  if (!payload.document || !payload.role) {
    throw new Error('Incomplete registration payload')
  }

  if (payload.role === 'ngo' && !payload.ngo?.registrationNumber) {
    throw new Error('Incomplete NGO registration payload')
  }

  const formData = new FormData()
  appendRegistrationFields(formData, payload)

  const response = await apiClient.post<ApiEnvelope<RegistrationSubmitResponse>>(
    '/auth/register',
    formData,
  )

  return unwrapApiResponse(response)
}

export function buildRegistrationSubmitPayload(state: {
  role: UserRole
  organisationName: string
  contactName: string
  phone: string
  email: string
  password: string
  documents: RegistrationDocument[]
  registrationNumber: string
  dailyCapacity: number
  transportAvailable: boolean
}): RegistrationSubmitPayload | null {
  const document = state.documents[0]

  if (!document) {
    return null
  }

  const normalizedPhone = normalizePhone(state.phone)
  if (!normalizedPhone) {
    return null
  }

  const payload: RegistrationSubmitPayload = {
    role: state.role,
    organisationName: state.organisationName,
    contactName: state.contactName,
    phone: normalizedPhone,
    email: state.email,
    password: state.password,
    document: document.file,
  }

  if (state.role === 'ngo') {
    payload.ngo = {
      registrationNumber: state.registrationNumber,
      dailyCapacity: state.dailyCapacity,
      transportAvailable: state.transportAvailable,
    }
  }

  return payload
}
