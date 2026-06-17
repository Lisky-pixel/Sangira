export const POST_LISTING_SECTION_ID = {
  WHAT: 'post-listing-what',
  SAFETY: 'post-listing-safety',
  PICKUP: 'post-listing-pickup',
} as const

export type PostListingSectionId =
  (typeof POST_LISTING_SECTION_ID)[keyof typeof POST_LISTING_SECTION_ID]
