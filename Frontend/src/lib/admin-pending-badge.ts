import type { ListVerificationsResult } from '../types/admin-verification'

/**
 * Normalizes authoritative pending counts from API/socket payloads.
 * Never use pagination.totalItems here.
 */
export function normalizePendingBadgeCount(count: unknown): number {
  if (typeof count !== 'number' || !Number.isFinite(count) || count < 0) {
    return 0
  }
  return Math.floor(count)
}

/**
 * Resolves the pending-only badge count from an authoritative API field.
 * Never derive from pagination.totalItems or the list items array length.
 */
export function resolvePendingBadgeCountFromList(
  result: Pick<ListVerificationsResult, 'totalPending'>,
): number {
  return normalizePendingBadgeCount(result.totalPending)
}

/**
 * Applies the server-authoritative pending count returned after approve/reject.
 */
export function resolvePendingBadgeCountFromDecision(
  result: Pick<{ pendingCount: number }, 'pendingCount'>,
): number {
  return normalizePendingBadgeCount(result.pendingCount)
}

/**
 * Shared display value for the sidebar badge and queue header "awaiting review".
 * Both read pendingBadgeCount from AdminVerificationProvider context.
 */
export function resolvePendingCountForDisplay(count: number | null): number {
  return typeof count === 'number' ? normalizePendingBadgeCount(count) : 0
}
