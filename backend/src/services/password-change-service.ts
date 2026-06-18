import { User } from '../models/user.js'
import { PASSWORD_CHANGE } from '../constants/password-change.js'
import { revokeAllUserRefreshTokens } from './session-revocation.js'
import { badRequest, unauthorized } from '../utils/app-error.js'
import type { ChangePasswordInput } from '../validators/password-change.js'

export async function changePasswordForUser(
  userId: string,
  input: ChangePasswordInput,
) {
  const user = await User.findById(userId).select('+passwordHash')
  if (!user) {
    throw unauthorized('Authentication required', 'UNAUTHORIZED')
  }

  const currentValid = await user.comparePassword(input.currentPassword)
  if (!currentValid) {
    throw unauthorized(
      'Current password is incorrect',
      PASSWORD_CHANGE.ERROR_CODES.INVALID_CURRENT_PASSWORD,
    )
  }

  const reusesCurrent = await user.comparePassword(input.newPassword)
  if (reusesCurrent) {
    throw badRequest(
      'Your new password must be different from your current password.',
      PASSWORD_CHANGE.ERROR_CODES.PASSWORD_REUSE,
    )
  }

  user.passwordHash = input.newPassword
  user.passwordChangedAt = new Date()
  await user.save()

  await revokeAllUserRefreshTokens(user._id.toString())
}
