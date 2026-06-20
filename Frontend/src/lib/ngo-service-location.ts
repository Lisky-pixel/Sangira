import type { AuthUser } from '../auth/types'

type ServiceLocationLike = {
  address?: string
}

export function getNgoServiceAddress(user: AuthUser): string {
  const serviceLocation = user.serviceLocation as ServiceLocationLike | undefined
  return serviceLocation?.address?.trim() ?? ''
}
