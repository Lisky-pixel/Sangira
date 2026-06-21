import type { HandoverCondition } from '../constants/handover-condition'
import type { FoodType, QuantityUnit } from '../constants/listing-form'

export type TransferReceiptParty = {
  organisationName: string
  verified: boolean
}

export type TransferReceiptFood = {
  title: string
  foodType: FoodType
  quantity: number
  quantityUnit: QuantityUnit
}

export type TransferReceiptImpact = {
  mealsRedistributed?: number
  wasteKgPrevented?: number
  itemsRedistributed?: number
}

export type TransferReceiptConditionReport = {
  condition: HandoverCondition
  note?: string
  reportedAt: string
}

export type TransferReceipt = {
  id: string
  food: TransferReceiptFood
  donor: TransferReceiptParty
  ngo: TransferReceiptParty
  completedAt: string
  impact: TransferReceiptImpact
  conditionReport: TransferReceiptConditionReport
  pickupAddress?: string
}

export type GetTransferReceiptResult = {
  receipt: TransferReceipt
}
