import {
  FOOD_TYPE_LABELS,
  QUANTITY_UNIT_LABELS,
  type FoodType,
  type QuantityUnit,
} from '../constants/listing-form.js'

export function deriveListingTitle(input: {
  quantity: number
  quantityUnit: QuantityUnit
  foodType: FoodType
}) {
  const unitLabel = QUANTITY_UNIT_LABELS[input.quantityUnit]
  const foodLabel = FOOD_TYPE_LABELS[input.foodType]
  return `${input.quantity} ${unitLabel} ${foodLabel}`
}
