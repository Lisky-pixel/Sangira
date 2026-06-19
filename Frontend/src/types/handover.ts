import type { RequestStatus } from '../constants/request-status'
import type { QuantityUnit } from '../constants/listing-form'
import type { HandoverCondition } from '../constants/handover-condition'
import type { RequestConfirmation } from './request'

export type HandoverParty = {
  organisationName: string
  verified: boolean
}

export type HandoverListing = {
  title: string
  quantity: number
  quantityUnit: QuantityUnit
  expiresAt: string
  photos: string[]
}

export type HandoverCompletionImpact = {
  mealsRedistributed: number
  wasteKgPrevented: number
}

export type HandoverView = {
  requestId: string
  status: RequestStatus
  listing: HandoverListing
  otherParty: HandoverParty
  confirmation: RequestConfirmation
  pickupPin?: string
  qrToken?: string
}

export type HandoverUpdatedPayload = {
  requestId: string
  donorConfirmed: boolean
  ngoConfirmed: boolean
  status: RequestStatus
  completedAt?: string
}

export type GetHandoverResult = {
  handover: HandoverView
}

export type ConfirmHandoverResult = {
  handover: HandoverUpdatedPayload
}

export type ConfirmReceiptInput = {
  pin: string
  condition: HandoverCondition
  note?: string
}

export type ConfirmReceiptResult = {
  handover: HandoverUpdatedPayload
  impact?: HandoverCompletionImpact
}
