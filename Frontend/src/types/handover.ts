import type { RequestStatus } from '../constants/request-status'
import type { QuantityUnit } from '../constants/listing-form'
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
