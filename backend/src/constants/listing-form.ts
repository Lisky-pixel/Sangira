export const FOOD_TYPE = {
  COOKED_MEALS: 'cooked_meals',
  FRESH_PRODUCE: 'fresh_produce',
  BAKERY: 'bakery',
  PACKAGED: 'packaged',
  BEVERAGES: 'beverages',
  OTHER: 'other',
} as const

export type FoodType = (typeof FOOD_TYPE)[keyof typeof FOOD_TYPE]

export const FOOD_TYPE_VALUES = Object.values(FOOD_TYPE) as [
  FoodType,
  ...FoodType[],
]

export const QUANTITY_UNIT = {
  SERVINGS: 'servings',
  KG: 'kg',
  ITEMS: 'items',
} as const

export type QuantityUnit = (typeof QUANTITY_UNIT)[keyof typeof QUANTITY_UNIT]

export const QUANTITY_UNIT_VALUES = Object.values(QUANTITY_UNIT) as [
  QuantityUnit,
  ...QuantityUnit[],
]

export const STORAGE_CONDITION = {
  AMBIENT: 'ambient',
  REFRIGERATED: 'refrigerated',
  HOT_HELD: 'hot_held',
} as const

export type StorageCondition =
  (typeof STORAGE_CONDITION)[keyof typeof STORAGE_CONDITION]

export const STORAGE_CONDITION_VALUES = Object.values(STORAGE_CONDITION) as [
  StorageCondition,
  ...StorageCondition[],
]

export const FOOD_LABEL = {
  CONTAINS_ALLERGENS: 'contains_allergens',
  HALAL: 'halal',
  VEGETARIAN: 'vegetarian',
  REQUIRES_REHEATING: 'requires_reheating',
} as const

export type FoodLabel = (typeof FOOD_LABEL)[keyof typeof FOOD_LABEL]

export const FOOD_LABEL_VALUES = Object.values(FOOD_LABEL) as [
  FoodLabel,
  ...FoodLabel[],
]

export const FOOD_TYPE_LABELS: Record<FoodType, string> = {
  [FOOD_TYPE.COOKED_MEALS]: 'Cooked meals',
  [FOOD_TYPE.FRESH_PRODUCE]: 'Fresh produce',
  [FOOD_TYPE.BAKERY]: 'Bakery',
  [FOOD_TYPE.PACKAGED]: 'Packaged',
  [FOOD_TYPE.BEVERAGES]: 'Beverages',
  [FOOD_TYPE.OTHER]: 'Other',
}

export const QUANTITY_UNIT_LABELS: Record<QuantityUnit, string> = {
  [QUANTITY_UNIT.SERVINGS]: 'servings',
  [QUANTITY_UNIT.KG]: 'kg',
  [QUANTITY_UNIT.ITEMS]: 'items',
}
