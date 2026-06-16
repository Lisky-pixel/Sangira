import type { AuthState, AuthUser } from '../auth/types'
import type { VerificationDocumentLike } from './display-filename'

export function stateIsAuthed(
  state: AuthState,
): state is Extract<AuthState, { status: 'authed' }> {
  return state.status === 'authed'
}

export function getLatestVerificationDocument(
  user: AuthUser,
): VerificationDocumentLike | null {
  const documents = user.verification?.documents

  if (!documents?.length) {
    return null
  }

  return documents[documents.length - 1] ?? null
}

export function getVerificationReason(user: AuthUser): string | undefined {
  const reason = user.verification?.reason

  if (typeof reason !== 'string') {
    return undefined
  }

  const trimmed = reason.trim()
  return trimmed || undefined
}

export function getVerificationReviewedAt(
  user: AuthUser,
): string | Date | undefined {
  return user.verification?.reviewedAt
}
