function maskLocalPart(local: string): string {
  if (!local) return '•••'
  if (local.length === 1) return '•'
  if (local.length === 2) return `${local[0]}•`
  return `${local[0]}•••`
}

export function maskEmail(email: string): string {
  const trimmed = email.trim()
  const atIndex = trimmed.indexOf('@')
  if (atIndex <= 0) return 'a•••@example.com'
  const local = trimmed.slice(0, atIndex)
  const domain = trimmed.slice(atIndex + 1) || 'example.com'
  return `${maskLocalPart(local)}@${domain}`
}

