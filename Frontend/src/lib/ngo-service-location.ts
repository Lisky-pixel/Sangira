import type { AuthUser } from '../auth/types'
import { isValidLngLat, type LngLat } from './distance'

type ServiceLocationLike = {
  address?: string
  coordinates?: unknown
}

export function getNgoServiceAddress(user: AuthUser): string {
  const serviceLocation = user.serviceLocation as ServiceLocationLike | undefined
  return serviceLocation?.address?.trim() ?? ''
}

export function getNgoServiceCoordinates(user: AuthUser): LngLat | null {
  const serviceLocation = user.serviceLocation as ServiceLocationLike | undefined
  const coords = serviceLocation?.coordinates

  return isValidLngLat(coords) ? coords : null
}
