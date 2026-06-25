import 'leaflet/dist/leaflet.css'
import './ngo-browse-map.css'

import { useMemo } from 'react'
import { Link } from 'react-router'
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import {
  KIGALI_DEFAULT_CENTER,
  MAP_DEFAULT_CITY_ZOOM,
  NGO_BROWSE_MAP_HEIGHT_PX,
  OSM_TILE_ATTRIBUTION,
  OSM_TILE_URL,
} from '../../constants/map-leaflet'
import {
  formatDistanceAway,
  getDistanceForListing,
  getListingCoordinates,
  toLeafletLatLng,
  type LngLat,
} from '../../lib/distance'
import { ngoBrowseContent } from '../../placeholder/ngo-browse-content'
import { postListingContent } from '../../placeholder/post-listing-content'
import { ngoListingDetailPath } from '../../routes/paths'
import type { NgoBrowseListing } from '../../types/ngo-browse-listing'
import { VerifiedBadge } from '../ui/verified-badge'
import { LISTING_MARKER_ICON, NGO_MARKER_ICON } from './ngo-leaflet-markers'

type NgoBrowseMapPanelProps = {
  listings: NgoBrowseListing[]
  ngoCoordinates: LngLat | null
  requestedListingIds: ReadonlySet<string>
}

type MappableListing = {
  listing: NgoBrowseListing
  coordinates: LngLat
}

function getMappableListings(listings: NgoBrowseListing[]): MappableListing[] {
  return listings.flatMap((listing) => {
    const coordinates = getListingCoordinates(listing)

    if (!coordinates) {
      return []
    }

    return [{ listing, coordinates }]
  })
}

function ListingMapPopup({
  listing,
  ngoCoordinates,
  hasRequested,
}: {
  listing: NgoBrowseListing
  ngoCoordinates: LngLat | null
  hasRequested: boolean
}) {
  const unitLabel = postListingContent.quantityUnitLabels[listing.quantityUnit]
  const distanceKm = getDistanceForListing(ngoCoordinates, listing)
  const distanceAway =
    distanceKm !== null ? formatDistanceAway(distanceKm) : null

  return (
    <div className="ngo-browse-map-popup min-w-[12rem] space-y-2">
      <p className="text-charcoal font-display text-sm font-semibold">
        {listing.title}
      </p>

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-charcoal text-xs font-medium">
          {listing.donor.organisationName}
        </span>
        <VerifiedBadge label={ngoBrowseContent.map.popup.verifiedDonor} />
      </div>

      <p className="text-body text-xs">
        {ngoBrowseContent.map.popup.quantityLine(listing.quantity, unitLabel)}
      </p>

      {distanceAway ? (
        <p className="text-body text-xs">{distanceAway}</p>
      ) : null}

      <Link
        to={ngoListingDetailPath(listing._id)}
        className="text-primary inline-flex text-xs font-medium hover:underline"
      >
        {hasRequested
          ? ngoBrowseContent.map.popup.requested
          : ngoBrowseContent.map.popup.viewListing}
      </Link>
    </div>
  )
}

export function NgoBrowseMapPanel({
  listings,
  ngoCoordinates,
  requestedListingIds,
}: NgoBrowseMapPanelProps) {
  const mappableListings = useMemo(
    () => getMappableListings(listings),
    [listings],
  )

  const mapCenter = useMemo(
    () => toLeafletLatLng(ngoCoordinates ?? KIGALI_DEFAULT_CENTER),
    [ngoCoordinates],
  )

  const showEmptyOverlay = mappableListings.length === 0

  return (
    <div
      className="ngo-browse-map border-border relative overflow-hidden rounded-2xl border bg-white shadow-sm"
      style={{ height: NGO_BROWSE_MAP_HEIGHT_PX }}
    >
      <MapContainer
        center={mapCenter}
        zoom={MAP_DEFAULT_CITY_ZOOM}
        scrollWheelZoom
        className="size-full"
        aria-label={ngoBrowseContent.viewToggle.map}
      >
        <TileLayer url={OSM_TILE_URL} attribution={OSM_TILE_ATTRIBUTION} />

        {ngoCoordinates ? (
          <Marker
            position={toLeafletLatLng(ngoCoordinates)}
            icon={NGO_MARKER_ICON}
          >
            <Popup>{ngoBrowseContent.map.ngoLocationLabel}</Popup>
          </Marker>
        ) : null}

        {mappableListings.map(({ listing, coordinates }) => (
          <Marker
            key={listing._id}
            position={toLeafletLatLng(coordinates)}
            icon={LISTING_MARKER_ICON}
          >
            <Popup>
              <ListingMapPopup
                listing={listing}
                ngoCoordinates={ngoCoordinates}
                hasRequested={requestedListingIds.has(listing._id)}
              />
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {showEmptyOverlay ? (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-white/80 p-6">
          <p className="text-body max-w-md text-center text-sm">
            {ngoBrowseContent.map.emptyMappable}
          </p>
        </div>
      ) : null}
    </div>
  )
}
