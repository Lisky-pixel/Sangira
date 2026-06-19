import type { Server } from 'socket.io'
import { ADMIN_ROOM, VERIFICATION_SOCKET } from '../constants/admin-verification.js'
import type { Role, VerificationStatus } from '../constants/enums.js'

export type VerificationQueueListItem = {
  id: string
  organisationName: string
  role: Role
  sectorLabel: string
  submittedAt: string
  waitingSince: string
  status: VerificationStatus
  review?: {
    reviewedBy?: string
    reviewedAt?: string
    action: 'approved' | 'rejected'
  }
}

export type VerificationUpdatedPayload = {
  id: string
  newStatus: VerificationStatus
  reviewedBy?: string
  reviewedByName?: string
  reviewedAt?: string
  pendingCount: number
}

export type VerificationNewPayload = {
  item: VerificationQueueListItem
  pendingCount: number
}

let io: Server | null = null

export function setVerificationSocketServer(server: Server) {
  io = server
}

export function adminRoomName() {
  return ADMIN_ROOM
}

export function emitVerificationUpdated(payload: VerificationUpdatedPayload) {
  io?.to(ADMIN_ROOM).emit(VERIFICATION_SOCKET.EVENT_UPDATED, payload)
}

export function emitVerificationNew(payload: VerificationNewPayload) {
  io?.to(ADMIN_ROOM).emit(VERIFICATION_SOCKET.EVENT_NEW, payload)
}
