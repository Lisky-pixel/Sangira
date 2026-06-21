import type { AuthUser } from '../auth/types'
import { toLngLat, type LngLat } from './distance'

type ServiceLocationLike = {
  address?: string
  coordinates?: unknown
}

function readServiceLocation(user: AuthUser): ServiceLocationLike | null {
  const serviceLocation = user.serviceLocation

  if (serviceLocation === null || serviceLocation === undefined) {
    return null
  }

  if (typeof serviceLocation !== 'object') {
    return null
  }

  return serviceLocation as ServiceLocationLike
}

export function getNgoServiceAddress(user: AuthUser): string {
  return readServiceLocation(user)?.address?.trim() ?? ''
}

export function getNgoServiceCoordinates(user: AuthUser): LngLat | null {
  const coords = readServiceLocation(user)?.coordinates
  return toLngLat(coords)
}

/** True only when serviceLocation has a valid [lng, lat] pair — not address text alone */
export function hasNgoServiceCoordinates(user: AuthUser): boolean {
  return getNgoServiceCoordinates(user) !== null
}
