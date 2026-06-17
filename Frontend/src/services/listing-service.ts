import type { CreateListingPayload } from '../types/create-listing'

const PLACEHOLDER_CREATE_DELAY_MS = 800

export type CreateListingResult = {
  id: string
}

export const listingService = {
  async createListing(payload: CreateListingPayload): Promise<CreateListingResult> {
    // PLACEHOLDER — replace with real POST /listings (multipart) when the Listing
    // backend ships; backend uploads the photo to Cloudinary (public) and geocodes
    // the address.
    await new Promise((resolve) => {
      setTimeout(resolve, PLACEHOLDER_CREATE_DELAY_MS)
    })

    void payload

    return { id: 'placeholder-listing-id' }
  },
}
