import { z } from 'zod'

export const createRequestSchema = z.object({
  listingId: z.string().trim().min(1, 'Listing id is required'),
})

export type CreateRequestInput = z.infer<typeof createRequestSchema>
