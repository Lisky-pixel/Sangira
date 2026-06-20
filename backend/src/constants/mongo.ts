/** Consistency-critical reads — always use primary to avoid stale replica counts. */
export const MONGO_READ_PREFERENCE_PRIMARY = 'primary' as const
