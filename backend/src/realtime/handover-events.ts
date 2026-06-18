import type { Server } from 'socket.io'
import {
  HANDOVER_ROOM_PREFIX,
  HANDOVER_SOCKET,
} from '../constants/handover.js'
import type { HandoverUpdatedPayload } from '../utils/serialize-handover.js'

let io: Server | null = null

export function setSocketServer(server: Server) {
  io = server
}

export function getSocketServer(): Server | null {
  return io
}

export function handoverRoomName(requestId: string): string {
  return `${HANDOVER_ROOM_PREFIX}${requestId}`
}

export function emitHandoverUpdated(
  requestId: string,
  payload: HandoverUpdatedPayload,
): void {
  io?.to(handoverRoomName(requestId)).emit(HANDOVER_SOCKET.EVENT_UPDATED, payload)
}
