export function isEmail(value: string): boolean {
  const trimmed = value.trim()
  if (!trimmed) return false
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)
}

/**
 * Best-effort hint. Actual phone validation should use shared phone utilities.
 */
export function looksLikePhone(value: string): boolean {
  const trimmed = value.trim()
  if (!trimmed) return false
  if (isEmail(trimmed)) return false
  return /[0-9]/.test(trimmed)
}

