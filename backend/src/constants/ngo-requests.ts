/** Declined-request copy shown to NGOs when another org was accepted */
export const NGO_DECLINED_REASON = {
  ANOTHER_ORGANISATION_ACCEPTED: 'Another organisation was accepted',
} as const

/** Expired-request copy when the listing expired before any accept */
export const NGO_EXPIRED_REASON = {
  LISTING_EXPIRED_UNFULFILLED:
    'Listing expired before the donor accepted a request',
} as const
