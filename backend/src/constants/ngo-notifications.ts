import { NOTIFICATION_TYPE } from './enums.js'
import type { QuantityUnit } from './listing-form.js'
import { QUANTITY_UNIT } from './listing-form.js'

export const NGO_NOTIFICATION_TITLE = {
  [NOTIFICATION_TYPE.NEW_LISTING]: 'New listing available',
  [NOTIFICATION_TYPE.REQUEST_ACCEPTED]: 'Request accepted',
  [NOTIFICATION_TYPE.TRANSFER_COMPLETE]: 'Transfer complete',
} as const

const QUANTITY_UNIT_LABEL: Record<QuantityUnit, string> = {
  [QUANTITY_UNIT.SERVINGS]: 'servings',
  [QUANTITY_UNIT.KG]: 'kg',
  [QUANTITY_UNIT.ITEMS]: 'items',
}

export function formatNgoNotificationBody(input: {
  type:
    | typeof NOTIFICATION_TYPE.NEW_LISTING
    | typeof NOTIFICATION_TYPE.REQUEST_ACCEPTED
    | typeof NOTIFICATION_TYPE.TRANSFER_COMPLETE
  listingTitle: string
  donorName?: string
  quantity?: number
  quantityUnit?: QuantityUnit
}): string {
  const listing = input.listingTitle.trim() || 'a listing'
  const donor = input.donorName?.trim() || 'A donor'

  switch (input.type) {
    case NOTIFICATION_TYPE.NEW_LISTING: {
      if (
        typeof input.quantity === 'number' &&
        input.quantityUnit &&
        input.quantity > 0
      ) {
        const unit = QUANTITY_UNIT_LABEL[input.quantityUnit]
        return `${donor} posted ${listing} — ${input.quantity} ${unit}`
      }
      return `${donor} posted ${listing}`
    }
    case NOTIFICATION_TYPE.REQUEST_ACCEPTED:
      return `${donor} accepted your request for ${listing} — arrange pickup`
    case NOTIFICATION_TYPE.TRANSFER_COMPLETE: {
      if (
        typeof input.quantity === 'number' &&
        input.quantityUnit &&
        input.quantity > 0
      ) {
        const unit = QUANTITY_UNIT_LABEL[input.quantityUnit]
        return `Pickup of ${listing} confirmed — ${input.quantity} ${unit} received`
      }
      return `Pickup of ${listing} confirmed`
    }
    default:
      return listing
  }
}
