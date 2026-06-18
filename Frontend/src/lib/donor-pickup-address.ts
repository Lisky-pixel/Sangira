import type { AuthUser } from '../auth/types'

type PickupLocationLike = {
  address?: string
}

export function getDonorPickupAddress(user: AuthUser) {
  const pickupAddress =
    typeof user.pickupAddress === 'string' ? user.pickupAddress.trim() : ''
  if (pickupAddress) return pickupAddress

  const pickupLocation = user.pickupLocation as PickupLocationLike | undefined
  const address = pickupLocation?.address?.trim()
  return address ?? ''
}
