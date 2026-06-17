import type { AuthUser } from '../auth/types'

type PickupLocationLike = {
  address?: string
}

export function getDonorPickupAddress(user: AuthUser) {
  const pickupLocation = user.pickupLocation as PickupLocationLike | undefined
  const address = pickupLocation?.address?.trim()
  return address ?? ''
}
