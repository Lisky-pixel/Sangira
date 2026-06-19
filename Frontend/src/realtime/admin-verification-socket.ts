import { VERIFICATION_SOCKET } from '../constants/admin-verification'
import type {
  VerificationNewPayload,
  VerificationUpdatedPayload,
} from '../types/admin-verification'
import { getSocketClient, releaseSocketClient, retainSocketClient } from './socket-client'

type UpdatedHandler = (payload: VerificationUpdatedPayload) => void
type NewHandler = (payload: VerificationNewPayload) => void
type ReconnectHandler = () => void

let socketRefCount = 0
let listenersBound = false

const updatedHandlers = new Set<UpdatedHandler>()
const newHandlers = new Set<NewHandler>()
const reconnectHandlers = new Set<ReconnectHandler>()

function dispatchUpdated(payload: VerificationUpdatedPayload) {
  updatedHandlers.forEach((handler) => handler(payload))
}

function dispatchNew(payload: VerificationNewPayload) {
  newHandlers.forEach((handler) => handler(payload))
}

function dispatchReconnect() {
  reconnectHandlers.forEach((handler) => handler())
}

function bindAdminVerificationListeners() {
  if (listenersBound) {
    return
  }

  const socket = getSocketClient()
  listenersBound = true

  socket.on(VERIFICATION_SOCKET.EVENT_UPDATED, dispatchUpdated)
  socket.on(VERIFICATION_SOCKET.EVENT_NEW, dispatchNew)
  socket.io.on('reconnect', dispatchReconnect)
}

function unbindAdminVerificationListeners() {
  if (!listenersBound) {
    return
  }

  const socket = getSocketClient()
  socket.off(VERIFICATION_SOCKET.EVENT_UPDATED, dispatchUpdated)
  socket.off(VERIFICATION_SOCKET.EVENT_NEW, dispatchNew)
  socket.io.off('reconnect', dispatchReconnect)
  listenersBound = false
}

export function retainAdminVerificationSocket(): void {
  socketRefCount += 1
  retainSocketClient()
  bindAdminVerificationListeners()
}

export function releaseAdminVerificationSocket(): void {
  socketRefCount = Math.max(0, socketRefCount - 1)
  if (socketRefCount === 0) {
    unbindAdminVerificationListeners()
    releaseSocketClient()
  }
}

export function subscribeVerificationUpdated(handler: UpdatedHandler) {
  updatedHandlers.add(handler)
  return () => {
    updatedHandlers.delete(handler)
  }
}

export function subscribeVerificationNew(handler: NewHandler) {
  newHandlers.add(handler)
  return () => {
    newHandlers.delete(handler)
  }
}

export function subscribeAdminSocketReconnect(handler: ReconnectHandler) {
  reconnectHandlers.add(handler)
  return () => {
    reconnectHandlers.delete(handler)
  }
}
