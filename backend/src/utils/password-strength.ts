export type PasswordStrengthScore = 0 | 1 | 2 | 3 | 4

export const MODERATE_PASSWORD_MIN_SCORE = 3

/** Transparent heuristic — mirrors frontend; // TODO: optional zxcvbn upgrade */
export function estimatePasswordStrength(password: string): PasswordStrengthScore {
  if (!password) return 0

  let points = 0

  if (password.length >= 8) points += 1
  if (password.length >= 12) points += 1
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) points += 1
  if (/\d/.test(password)) points += 1
  if (/[^a-zA-Z0-9]/.test(password)) points += 1

  return Math.min(4, Math.max(1, points)) as PasswordStrengthScore
}

export function isModerateOrStrongPassword(password: string): boolean {
  return estimatePasswordStrength(password) >= MODERATE_PASSWORD_MIN_SCORE
}
