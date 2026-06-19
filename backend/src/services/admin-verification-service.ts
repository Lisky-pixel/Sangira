import { ROLES, VERIFICATION_STATUS } from '../constants/enums.js'
import { User } from '../models/user.js'

export async function countPendingVerifications(): Promise<number> {
  return User.countDocuments({
    role: { $in: [ROLES.DONOR, ROLES.NGO] },
    'verification.status': VERIFICATION_STATUS.PENDING,
  })
}
