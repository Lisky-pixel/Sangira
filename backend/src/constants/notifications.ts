import { NOTIFICATION_TYPE } from './enums.js'
import type { QuantityUnit } from './listing-form.js'
import { QUANTITY_UNIT } from './listing-form.js'

export const NOTIFICATION_LIST = {
  DROPDOWN_LIMIT: 10,
  MAX_LIMIT: 50,
} as const

/** In-app donor notification titles — bodies built at create time */
export const DONOR_NOTIFICATION_TITLE = {
  [NOTIFICATION_TYPE.REQUEST_RECEIVED]: 'New request received',
  [NOTIFICATION_TYPE.REQUEST_ACCEPTED]: 'Request accepted',
  [NOTIFICATION_TYPE.TRANSFER_COMPLETE]: 'Transfer complete',
} as const

const QUANTITY_UNIT_LABEL: Record<QuantityUnit, string> = {
  [QUANTITY_UNIT.SERVINGS]: 'servings',
  [QUANTITY_UNIT.KG]: 'kg',
  [QUANTITY_UNIT.ITEMS]: 'items',
}

export function formatDonorNotificationBody(input: {
  type:
    | typeof NOTIFICATION_TYPE.REQUEST_RECEIVED
    | typeof NOTIFICATION_TYPE.REQUEST_ACCEPTED
    | typeof NOTIFICATION_TYPE.TRANSFER_COMPLETE
  ngoName: string
  listingTitle: string
  quantity?: number
  quantityUnit?: QuantityUnit
}): string {
  const ngo = input.ngoName.trim() || 'An NGO'
  const listing = input.listingTitle.trim() || 'your listing'

  switch (input.type) {
    case NOTIFICATION_TYPE.REQUEST_RECEIVED:
      return `${ngo} requested your ${listing} — review the request`
    case NOTIFICATION_TYPE.REQUEST_ACCEPTED:
      return `You accepted ${ngo} for ${listing} — awaiting pickup`
    case NOTIFICATION_TYPE.TRANSFER_COMPLETE: {
      if (
        typeof input.quantity === 'number' &&
        input.quantityUnit &&
        input.quantity > 0
      ) {
        const unit = QUANTITY_UNIT_LABEL[input.quantityUnit]
        return `${ngo} confirmed receipt of ${listing} — ${input.quantity} ${unit}`
      }
      return `${ngo} confirmed receipt of ${listing}`
    }
    default:
      return listing
  }
}
