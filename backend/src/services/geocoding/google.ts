import type { GeocodeResult } from './types.js'

/** Google Geocoding driver — flip GEOCODER=google when implemented */
export async function geocodeWithGoogle(
  address: string,
): Promise<GeocodeResult> {
  void address
  // TODO: implement Google Geocoding API using config.GOOGLE_MAPS_API_KEY
  return null
}
