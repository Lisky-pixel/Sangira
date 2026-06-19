import { VERIFICATION_STATUS, type VerificationStatus } from '../constants/verification-status'
import type {
  VerificationDetail,
  VerificationListItem,
  VerificationUpdatedPayload,
} from '../types/admin-verification'

const STATUS_BUCKET: Record<VerificationStatus, number> = {
  [VERIFICATION_STATUS.PENDING]: 0,
  [VERIFICATION_STATUS.REJECTED]: 1,
  [VERIFICATION_STATUS.APPROVED]: 2,
}

export function sortVerificationQueueItems(
  items: VerificationListItem[],
): VerificationListItem[] {
  return [...items].sort((a, b) => {
    const bucketDiff = STATUS_BUCKET[a.status] - STATUS_BUCKET[b.status]
    if (bucketDiff !== 0) return bucketDiff

    if (a.status === VERIFICATION_STATUS.PENDING) {
      return (
        new Date(a.waitingSince).getTime() - new Date(b.waitingSince).getTime()
      )
    }

    const aReviewed = a.review?.reviewedAt
      ? new Date(a.review.reviewedAt).getTime()
      : 0
    const bReviewed = b.review?.reviewedAt
      ? new Date(b.review.reviewedAt).getTime()
      : 0
    return bReviewed - aReviewed
  })
}

export function verificationDetailToListItem(
  detail: VerificationDetail,
): VerificationListItem {
  return {
    id: detail.id,
    organisationName: detail.organisationName,
    role: detail.role,
    sectorLabel: detail.sectorLabel,
    submittedAt: detail.submittedAt,
    waitingSince: detail.waitingSince,
    status: detail.status,
    review:
      detail.status !== VERIFICATION_STATUS.PENDING && detail.review
        ? {
            reviewedBy: detail.review.reviewedBy,
            reviewedAt: detail.review.reviewedAt,
            action:
              detail.status === VERIFICATION_STATUS.APPROVED
                ? 'approved'
                : 'rejected',
          }
        : undefined,
  }
}

export function insertVerificationNewItem(
  items: VerificationListItem[],
  newItem: VerificationListItem,
): VerificationListItem[] {
  if (items.some((item) => item.id === newItem.id)) {
    return sortVerificationQueueItems(items)
  }

  return sortVerificationQueueItems([...items, newItem])
}

export function applyVerificationUpdateToListItem(
  item: VerificationListItem,
  payload: VerificationUpdatedPayload,
): VerificationListItem {
  if (item.id !== payload.id) {
    return item
  }

  return {
    ...item,
    status: payload.newStatus,
    review: {
      reviewedBy: payload.reviewedBy,
      reviewedAt: payload.reviewedAt,
      action:
        payload.newStatus === VERIFICATION_STATUS.APPROVED
          ? 'approved'
          : 'rejected',
    },
  }
}
