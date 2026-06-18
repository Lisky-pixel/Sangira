import { User } from '../models/user.js'
import { PASSWORD_CHANGE } from '../constants/password-change.js'
import { revokeAllUserRefreshTokens } from './session-revocation.js'
import { unauthorized } from '../utils/app-error.js'
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

  user.passwordHash = input.newPassword
  user.passwordChangedAt = new Date()
  await user.save()

  await revokeAllUserRefreshTokens(user._id.toString())
}
