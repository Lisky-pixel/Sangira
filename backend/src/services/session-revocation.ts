import { RefreshToken } from '../models/refresh-token.js'

/** Revokes every refresh-token row for the user (all families / devices). */
export async function revokeAllUserRefreshTokens(userId: string) {
  await RefreshToken.updateMany({ user: userId }, { revoked: true })
}
