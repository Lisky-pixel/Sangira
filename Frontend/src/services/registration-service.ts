import type { UserRole } from '../constants/registration-roles'
import type { RegistrationDocument } from '../features/registration/registration-reducer'

export type RegistrationSubmitPayload = {
  role: UserRole
  organisationName: string
  contactName: string
  phone: string
  email: string
  password: string
  document: File
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
}): RegistrationSubmitPayload | null {
  const document = state.documents[0]

  if (!document) {
    return null
  }

  return {
    role: state.role,
    organisationName: state.organisationName,
    contactName: state.contactName,
    phone: state.phone,
    email: state.email,
    password: state.password,
    document: document.file,
  }
}
