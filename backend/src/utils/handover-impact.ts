import { HANDOVER_IMPACT } from '../constants/handover.js'
import { QUANTITY_UNIT, type QuantityUnit } from '../constants/listing-form.js'

export type HandoverImpact = {
  mealsRedistributed: number
  wasteKgPrevented: number
  itemsRedistributed: number
}

/**
 * Impact rule: meals = servings only; kg = kg unit; items = items unit — nothing estimated.
 * - servings → meals = quantity; wasteKg = quantity × SERVINGS_TO_KG_ESTIMATE
 * - kg → meals = 0; wasteKg = quantity
 * - items → meals = 0; wasteKg = 0; items = quantity
 */
export function computeHandoverImpact(
  quantity: number,
  quantityUnit: QuantityUnit,
): HandoverImpact {
  if (quantityUnit === QUANTITY_UNIT.SERVINGS) {
    return {
      mealsRedistributed: quantity,
      wasteKgPrevented: quantity * HANDOVER_IMPACT.SERVINGS_TO_KG_ESTIMATE,
      itemsRedistributed: 0,
    }
  }

  if (quantityUnit === QUANTITY_UNIT.KG) {
    return {
      mealsRedistributed: 0,
      wasteKgPrevented: quantity,
      itemsRedistributed: 0,
    }
  }

  return {
    mealsRedistributed: 0,
    wasteKgPrevented: 0,
    itemsRedistributed: quantity,
  }
}
