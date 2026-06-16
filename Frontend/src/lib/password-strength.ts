import { passwordStrengthLabels } from '../placeholder/register-content'

export type PasswordStrengthScore = 0 | 1 | 2 | 3 | 4

export type PasswordStrength = {
  score: PasswordStrengthScore
  label: string
}

const STRENGTH_LABELS: Record<PasswordStrengthScore, string> = {
  0: passwordStrengthLabels.weak,
  1: passwordStrengthLabels.weak,
  2: passwordStrengthLabels.fair,
  3: passwordStrengthLabels.moderate,
  4: passwordStrengthLabels.strong,
}

/** Transparent heuristic — // TODO: optional upgrade to zxcvbn for real entropy scoring */
export function estimatePasswordStrength(password: string): PasswordStrength {
  if (!password) {
    return { score: 0, label: STRENGTH_LABELS[0] }
  }

  let points = 0

  if (password.length >= 8) points += 1
  if (password.length >= 12) points += 1
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) points += 1
  if (/\d/.test(password)) points += 1
  if (/[^a-zA-Z0-9]/.test(password)) points += 1

  const score = Math.min(4, Math.max(1, points)) as PasswordStrengthScore

  return {
    score,
    label: STRENGTH_LABELS[score],
  }
}

export const MODERATE_PASSWORD_MIN_SCORE = 3
