/** How often the server sweeps listings past expiresAt into status expired */
export const EXPIRY_SWEEP_INTERVAL_MS = 2 * 60 * 1000

/** Stored statuses eligible for automatic expiry (awaiting_pickup/completed excluded) */
export const EXPIRY_SWEEP_STATUSES = ['active'] as const

// TODO: requested listings share the active stored status today — revisit when the
// Request flow assigns a distinct status; accepted/awaiting_pickup (matched) must
// never be auto-expired.
