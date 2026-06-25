import L from 'leaflet'

export const LISTING_MARKER_ICON = L.divIcon({
  className: 'ngo-browse-map-marker',
  html: '<span class="ngo-browse-map-marker__dot ngo-browse-map-marker__dot--listing" aria-hidden="true"></span>',
  iconSize: [20, 20],
  iconAnchor: [10, 10],
  popupAnchor: [0, -10],
})

export const NGO_MARKER_ICON = L.divIcon({
  className: 'ngo-browse-map-marker',
  html: '<span class="ngo-browse-map-marker__dot ngo-browse-map-marker__dot--ngo" aria-hidden="true"></span>',
  iconSize: [24, 24],
  iconAnchor: [12, 12],
  popupAnchor: [0, -12],
})
