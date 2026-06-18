const REQUEST_PLACEHOLDER_DELAY_MS = 600

export type CreateRequestInput = {
  listingId: string
}

export type CreateRequestResult = {
  requestId: string
}

/**
 * PLACEHOLDER — replace with real POST /requests when the Request model ships;
 * creates Request(status=requested), prevents double-request, leaves the listing
 * active/browsable for other NGOs; donor accepting one later flips the listing to
 * awaiting_pickup and declines the rest.
 */
export const requestService = {
  async createRequest(
    input: CreateRequestInput,
  ): Promise<CreateRequestResult> {
    await new Promise((resolve) => {
      window.setTimeout(resolve, REQUEST_PLACEHOLDER_DELAY_MS)
    })

    return {
      requestId: `placeholder-${input.listingId}`,
    }
  },
}
