import { HANDOVER } from '../constants/handover'

/** Display PIN as spaced digit groups (e.g. "482 916"). */
export function formatHandoverPin(pin: string): string {
  const digits = pin.replace(/\D/g, '')
  if (digits.length !== HANDOVER.PICKUP_PIN_LENGTH) {
    return pin
  }

  const midpoint = Math.ceil(digits.length / 2)
  return `${digits.slice(0, midpoint)} ${digits.slice(midpoint)}`
}
