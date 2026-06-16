const VERIFICATION_CELEBRATION_SEEN_KEY = 'sangira_verification_celebration_seen'

export function hasSeenVerificationCelebration(): boolean {
  try {
    return sessionStorage.getItem(VERIFICATION_CELEBRATION_SEEN_KEY) === '1'
  } catch {
    return false
  }
}

export function markVerificationCelebrationSeen(): void {
  try {
    sessionStorage.setItem(VERIFICATION_CELEBRATION_SEEN_KEY, '1')
  } catch {
    // Ignore storage failures — user can revisit the celebration screen.
  }
}
