import type { UserRole } from '../constants/registration-roles'
import type { RegistrationDocument } from '../features/registration/registration-reducer'

export type RegistrationNgoPayload = {
  registrationNumber: string
  dailyCapacity: number
  transportAvailable: boolean
  // TODO: sector (orphanage | shelter | community_centre) — unset at registration
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
  success: true
  data: {
    status: 'pending_review'
  }
}

/**
 * PLACEHOLDER — replace with real POST /auth/register (multipart) when the backend
 * slice ships. Backend hashes the password and uploads the document to Cloudinary;
 * do not upload from the client.
 */
export async function submitRegistration(
  payload: RegistrationSubmitPayload,
): Promise<RegistrationSubmitResponse> {
  if (!payload.document || !payload.role) {
    throw new Error('Incomplete registration payload')
  }

  if (payload.role === 'ngo' && !payload.ngo?.registrationNumber) {
    throw new Error('Incomplete NGO registration payload')
  }

  await new Promise((resolve) => {
    setTimeout(resolve, 1200)
  })

  return {
    success: true,
    data: {
      status: 'pending_review',
    },
  }
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

  const payload: RegistrationSubmitPayload = {
    role: state.role,
    organisationName: state.organisationName,
    contactName: state.contactName,
    phone: state.phone,
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
