/** Landing hero stat values — thousands separators when large, plain when small. */
export function formatLandingStatValue(value: number): string {
  return value.toLocaleString()
}
