import { VERIFICATION_STATUS } from '../constants/enums.js'
import type { HandoverCondition } from '../constants/handover-condition.js'
import type { FoodType, QuantityUnit } from '../constants/listing-form.js'

export type SerializedTransferReceiptParty = {
  organisationName: string
  verified: boolean
}

export type SerializedTransferReceiptFood = {
  title: string
  foodType: FoodType
  quantity: number
  quantityUnit: QuantityUnit
}

export type SerializedTransferReceiptImpact = {
  mealsRedistributed?: number
  wasteKgPrevented?: number
  itemsRedistributed?: number
}

export type SerializedTransferReceiptConditionReport = {
  condition: HandoverCondition
  note?: string
  reportedAt: string
}

export type SerializedTransferReceipt = {
  id: string
  food: SerializedTransferReceiptFood
  donor: SerializedTransferReceiptParty
  ngo: SerializedTransferReceiptParty
  completedAt: string
  impact: SerializedTransferReceiptImpact
  conditionReport: SerializedTransferReceiptConditionReport
  pickupAddress?: string
}

type PartyLike = {
  organisationName?: string | null
  verification?: { status?: string } | null
}

function serializeParty(party: PartyLike): SerializedTransferReceiptParty {
  return {
    organisationName: party.organisationName?.trim() || 'Verified organisation',
    verified: party.verification?.status === VERIFICATION_STATUS.APPROVED,
  }
}

type TransferReceiptInput = {
  request: {
    _id: { toString(): string }
    mealsRedistributed?: number | null
    wasteKgPrevented?: number | null
    itemsRedistributed?: number | null
    confirmation: {
      completedAt: Date
      conditionReport: {
        condition: HandoverCondition
        note?: string | null
        reportedAt: Date
      }
    }
  }
  listing: {
    title: string
    foodType: FoodType
    quantity: number
    quantityUnit: QuantityUnit
    pickupAddress?: string | null
    pickupLocation?: { address?: string | null } | null
  }
  donor: PartyLike
  ngo: PartyLike
}

export function serializeTransferReceipt(
  input: TransferReceiptInput,
): SerializedTransferReceipt {
  const { request, listing, donor, ngo } = input
  const conditionReport = request.confirmation.conditionReport
  const pickupAddress =
    listing.pickupAddress?.trim() ||
    listing.pickupLocation?.address?.trim() ||
    undefined

  const impact: SerializedTransferReceiptImpact = {}

  if (
    typeof request.mealsRedistributed === 'number' &&
    request.mealsRedistributed > 0
  ) {
    impact.mealsRedistributed = request.mealsRedistributed
  }

  if (
    typeof request.wasteKgPrevented === 'number' &&
    request.wasteKgPrevented > 0
  ) {
    impact.wasteKgPrevented = request.wasteKgPrevented
  }

  if (
    typeof request.itemsRedistributed === 'number' &&
    request.itemsRedistributed > 0
  ) {
    impact.itemsRedistributed = request.itemsRedistributed
  }

  return {
    id: request._id.toString(),
    food: {
      title: listing.title,
      foodType: listing.foodType,
      quantity: listing.quantity,
      quantityUnit: listing.quantityUnit,
    },
    donor: serializeParty(donor),
    ngo: serializeParty(ngo),
    completedAt: request.confirmation.completedAt.toISOString(),
    impact,
    conditionReport: {
      condition: conditionReport.condition,
      ...(conditionReport.note?.trim()
        ? { note: conditionReport.note.trim() }
        : {}),
      reportedAt: conditionReport.reportedAt.toISOString(),
    },
    ...(pickupAddress ? { pickupAddress } : {}),
  }
}
