import { HANDOVER_IMPACT } from '../constants/handover.js'
import { QUANTITY_UNIT, type QuantityUnit } from '../constants/listing-form.js'

export type HandoverImpact = {
  mealsRedistributed: number
  wasteKgPrevented: number
}

/**
 * Impact rule: meals = servings only; kg shown separately.
 * - servings → meals = quantity; wasteKg = quantity × SERVINGS_TO_KG_ESTIMATE
 * - kg → meals = 0; wasteKg = quantity
 * - items → meals = 0; wasteKg = 0
 */
export function computeHandoverImpact(
  quantity: number,
  quantityUnit: QuantityUnit,
): HandoverImpact {
  if (quantityUnit === QUANTITY_UNIT.SERVINGS) {
    return {
      mealsRedistributed: quantity,
      wasteKgPrevented: quantity * HANDOVER_IMPACT.SERVINGS_TO_KG_ESTIMATE,
    }
  }

  if (quantityUnit === QUANTITY_UNIT.KG) {
    return {
      mealsRedistributed: 0,
      wasteKgPrevented: quantity,
    }
  }

  return {
    mealsRedistributed: 0,
    wasteKgPrevented: 0,
  }
}
