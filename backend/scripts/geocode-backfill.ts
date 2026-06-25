/**
 * One-off backfill: re-geocode listings and users that have address text but no coordinates.
 * Uses the active GEOCODER from backend/.env (set GEOCODER=google + GOOGLE_MAPS_API_KEY).
 *
 * Run: npm run geocode:backfill
 */
import mongoose from 'mongoose'
import {
  GEOCODER_PROVIDER,
  GOOGLE_GEOCODE_BACKFILL_DELAY_MS,
} from '../src/constants/geocoder.js'
import { config } from '../src/config/env.js'
import { Listing } from '../src/models/listing.js'
import { Donor, Ngo } from '../src/models/user.js'
import { geocodeAddress } from '../src/services/geocoding/geocode-address.js'

const missingCoordinatesFilter = {
  $or: [
    { pickupLocation: { $exists: false } },
    { 'pickupLocation.coordinates': { $exists: false } },
    { 'pickupLocation.coordinates': { $size: 0 } },
  ],
} as const

function sleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

async function backfillListingCoordinates(): Promise<number> {
  const listings = await Listing.find({
    pickupAddress: { $exists: true, $nin: [null, ''] },
    ...missingCoordinatesFilter,
  })
    .select('_id pickupAddress pickupLocation')
    .lean()

  let fixed = 0

  for (const listing of listings) {
    const address = listing.pickupAddress?.trim()
    if (!address) {
      continue
    }

    const geocoded = await geocodeAddress(address)
    if (!geocoded) {
      await sleep(GOOGLE_GEOCODE_BACKFILL_DELAY_MS)
      continue
    }

    const result = await Listing.updateOne(
      { _id: listing._id },
      {
        $set: {
          pickupLocation: {
            type: 'Point',
            coordinates: [geocoded.lng, geocoded.lat],
            address,
          },
        },
      },
    )

    if (result.modifiedCount > 0) {
      fixed += 1
    }

    await sleep(GOOGLE_GEOCODE_BACKFILL_DELAY_MS)
  }

  return fixed
}

async function backfillDonorCoordinates(): Promise<number> {
  const donors = await Donor.find({
    pickupAddress: { $exists: true, $nin: [null, ''] },
    ...missingCoordinatesFilter,
  })
    .select('_id pickupAddress pickupLocation')
    .lean()

  let fixed = 0

  for (const donor of donors) {
    const address = donor.pickupAddress?.trim()
    if (!address) {
      continue
    }

    const geocoded = await geocodeAddress(address)
    if (!geocoded) {
      await sleep(GOOGLE_GEOCODE_BACKFILL_DELAY_MS)
      continue
    }

    const result = await Donor.updateOne(
      { _id: donor._id },
      {
        $set: {
          pickupLocation: {
            type: 'Point',
            coordinates: [geocoded.lng, geocoded.lat],
            address,
          },
        },
      },
    )

    if (result.modifiedCount > 0) {
      fixed += 1
    }

    await sleep(GOOGLE_GEOCODE_BACKFILL_DELAY_MS)
  }

  return fixed
}

async function backfillNgoCoordinates(): Promise<number> {
  const ngos = await Ngo.find({
    'serviceLocation.address': { $exists: true, $nin: [null, ''] },
    $or: [
      { 'serviceLocation.coordinates': { $exists: false } },
      { 'serviceLocation.coordinates': { $size: 0 } },
    ],
  })
    .select('_id serviceLocation')
    .lean()

  let fixed = 0

  for (const ngo of ngos) {
    const address = ngo.serviceLocation?.address?.trim()
    if (!address) {
      continue
    }

    const geocoded = await geocodeAddress(address)
    if (!geocoded) {
      await sleep(GOOGLE_GEOCODE_BACKFILL_DELAY_MS)
      continue
    }

    const result = await Ngo.updateOne(
      { _id: ngo._id },
      {
        $set: {
          serviceLocation: {
            type: 'Point',
            coordinates: [geocoded.lng, geocoded.lat],
            address,
          },
        },
      },
    )

    if (result.modifiedCount > 0) {
      fixed += 1
    }

    await sleep(GOOGLE_GEOCODE_BACKFILL_DELAY_MS)
  }

  return fixed
}

async function runGeocodeBackfill(): Promise<void> {
  if (config.GEOCODER !== GEOCODER_PROVIDER.GOOGLE) {
    console.warn(
      `GEOCODER is "${config.GEOCODER}" — backfill uses the active geocoder. Set GEOCODER=google for Google resolution.`,
    )
  }

  await mongoose.connect(config.MONGODB_URI)

  const listingsFixed = await backfillListingCoordinates()
  const donorsFixed = await backfillDonorCoordinates()
  const ngosFixed = await backfillNgoCoordinates()

  const totalFixed = listingsFixed + donorsFixed + ngosFixed

  console.log(
    `Geocode backfill complete (${config.GEOCODER}): ${totalFixed} record(s) updated — listings: ${listingsFixed}, donors: ${donorsFixed}, NGOs: ${ngosFixed}.`,
  )

  await mongoose.disconnect()
}

runGeocodeBackfill().catch((error: unknown) => {
  console.error('Geocode backfill failed:', error)
  void mongoose.disconnect()
  process.exit(1)
})
