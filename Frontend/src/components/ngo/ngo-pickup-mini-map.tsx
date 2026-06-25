import 'leaflet/dist/leaflet.css'
import './ngo-browse-map.css'

import { useEffect, useMemo } from 'react'
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet'
import {
  NGO_PICKUP_MINI_MAP_HEIGHT_PX,
  NGO_PICKUP_MINI_MAP_ZOOM,
  OSM_TILE_ATTRIBUTION,
  OSM_TILE_URL,
} from '../../constants/map-leaflet'
import { toLeafletLatLng, type LeafletLatLng, type LngLat } from '../../lib/distance'
import { ngoBrowseContent } from '../../placeholder/ngo-browse-content'
import { ngoListingDetailContent } from '../../placeholder/ngo-listing-detail-content'
import { LISTING_MARKER_ICON, NGO_MARKER_ICON } from './ngo-leaflet-markers'

type NgoPickupMiniMapProps = {
  pickupCoordinates: LngLat
  ngoCoordinates?: LngLat | null
}

function FitMapToMarkers({ positions }: { positions: LeafletLatLng[] }) {
  const map = useMap()

  useEffect(() => {
    if (positions.length > 1) {
      map.fitBounds(positions, { padding: [28, 28], maxZoom: 16 })
      return
    }

    if (positions.length === 1) {
      map.setView(positions[0], NGO_PICKUP_MINI_MAP_ZOOM)
    }
  }, [map, positions])

  return null
}

export function NgoPickupMiniMap({
  pickupCoordinates,
  ngoCoordinates = null,
}: NgoPickupMiniMapProps) {
  const pickupPosition = useMemo(
    () => toLeafletLatLng(pickupCoordinates),
    [pickupCoordinates],
  )

  const ngoPosition = useMemo(
    () => (ngoCoordinates ? toLeafletLatLng(ngoCoordinates) : null),
    [ngoCoordinates],
  )

  const markerPositions = useMemo(
    () =>
      ngoPosition ? [pickupPosition, ngoPosition] : [pickupPosition],
    [ngoPosition, pickupPosition],
  )

  return (
    <div
      className="ngo-browse-map border-border mt-4 overflow-hidden rounded-xl border"
      style={{ height: NGO_PICKUP_MINI_MAP_HEIGHT_PX }}
    >
      <MapContainer
        center={pickupPosition}
        zoom={NGO_PICKUP_MINI_MAP_ZOOM}
        scrollWheelZoom
        className="size-full"
        aria-label={ngoListingDetailContent.pickup.miniMapAriaLabel}
      >
        <TileLayer url={OSM_TILE_URL} attribution={OSM_TILE_ATTRIBUTION} />
        <FitMapToMarkers positions={markerPositions} />

        <Marker position={pickupPosition} icon={LISTING_MARKER_ICON}>
          <Popup>{ngoListingDetailContent.pickup.miniMapPickupLabel}</Popup>
        </Marker>

        {ngoPosition ? (
          <Marker position={ngoPosition} icon={NGO_MARKER_ICON}>
            <Popup>{ngoBrowseContent.map.ngoLocationLabel}</Popup>
          </Marker>
        ) : null}
      </MapContainer>
    </div>
  )
}
