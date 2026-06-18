import { QUANTITY_UNIT, type QuantityUnit } from '../constants/listing-form'

export type HandoverDisplayImpact = {
  meals: number
  kg: number
  items: number
}

/** Meals = servings only; kg from kg unit; items from items unit — no estimates. */
export function computeHandoverDisplayImpact(
  quantity: number,
  quantityUnit: QuantityUnit,
): HandoverDisplayImpact {
  if (quantityUnit === QUANTITY_UNIT.SERVINGS) {
    return { meals: quantity, kg: 0, items: 0 }
  }

  if (quantityUnit === QUANTITY_UNIT.KG) {
    return { meals: 0, kg: quantity, items: 0 }
  }

  return { meals: 0, kg: 0, items: quantity }
}
