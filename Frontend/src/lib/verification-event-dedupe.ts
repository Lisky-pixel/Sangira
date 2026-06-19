import type {
  VerificationDetail,
  VerificationNewPayload,
  VerificationUpdatedPayload,
} from '../types/admin-verification'

const appliedUpdates = new Map<string, string>()
const seenNewApplicationIds = new Set<string>()

export function buildVerificationUpdateDedupeKey(
  payload: Pick<VerificationUpdatedPayload, 'id' | 'newStatus' | 'reviewedAt'>,
): string {
  return `${payload.id}:${payload.newStatus}:${payload.reviewedAt ?? ''}`
}

export function shouldApplyVerificationUpdate(
  payload: VerificationUpdatedPayload,
): boolean {
  const key = buildVerificationUpdateDedupeKey(payload)
  const previous = appliedUpdates.get(payload.id)
  if (previous === key) {
    return false
  }
  appliedUpdates.set(payload.id, key)
  return true
}

export function markVerificationUpdateApplied(
  payload: Pick<VerificationUpdatedPayload, 'id' | 'newStatus' | 'reviewedAt'>,
): void {
  appliedUpdates.set(payload.id, buildVerificationUpdateDedupeKey(payload))
}

export function markVerificationUpdateAppliedFromDetail(
  detail: VerificationDetail,
): void {
  markVerificationUpdateApplied({
    id: detail.id,
    newStatus: detail.status,
    reviewedAt: detail.review?.reviewedAt,
  })
}

export function shouldApplyVerificationNew(
  payload: VerificationNewPayload,
): boolean {
  const applicationId = payload.item.id
  if (seenNewApplicationIds.has(applicationId)) {
    return false
  }
  seenNewApplicationIds.add(applicationId)
  return true
}

export function resetVerificationEventDedupeForTests() {
  appliedUpdates.clear()
  seenNewApplicationIds.clear()
}
