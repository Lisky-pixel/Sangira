export function isPastListingExpiry(expiresAt: string, now = Date.now()): boolean {
  const expires = new Date(expiresAt).getTime()
  return !Number.isNaN(expires) && expires <= now
}
