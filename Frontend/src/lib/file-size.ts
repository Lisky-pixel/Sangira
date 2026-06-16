const BYTE_UNITS = ['B', 'KB', 'MB', 'GB'] as const

export function humanReadableSize(bytes: number): string {
  if (bytes === 0) return '0 B'

  const unitIndex = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    BYTE_UNITS.length - 1,
  )
  const value = bytes / 1024 ** unitIndex

  return `${value.toFixed(unitIndex === 0 ? 0 : 1)} ${BYTE_UNITS[unitIndex]}`
}
