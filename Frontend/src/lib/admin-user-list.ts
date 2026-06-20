import { VERIFICATION_STATUS } from '../constants/verification-status'
import type { AdminUserDetail, AdminUserListItem } from '../types/admin-users'

export function adminUserDetailToListItem(
  detail: AdminUserDetail,
): AdminUserListItem {
  return {
    id: detail.id,
    organisationName: detail.organisationName,
    verified: detail.verificationStatus === VERIFICATION_STATUS.APPROVED,
    role: detail.role,
    sectorLabel: detail.sectorLabel,
    transfersCount: detail.transfersCount,
    accountStatus: detail.accountStatus,
    listStatus: detail.listStatus,
  }
}
