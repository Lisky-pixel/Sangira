import { lazy } from 'react'

export const NgoBrowseMapPanelLazy = lazy(() =>
  import('./ngo-browse-map-panel').then((module) => ({
    default: module.NgoBrowseMapPanel,
  })),
)
