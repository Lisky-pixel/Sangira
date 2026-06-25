import { lazy } from 'react'

export const NgoPickupMiniMapLazy = lazy(() =>
  import('./ngo-pickup-mini-map').then((module) => ({
    default: module.NgoPickupMiniMap,
  })),
)
