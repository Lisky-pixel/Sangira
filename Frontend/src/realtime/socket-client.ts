import { io, type Socket } from 'socket.io-client'

const socketUrl = import.meta.env.VITE_API_URL

if (!socketUrl) {
  throw new Error('VITE_API_URL is not defined. Copy .env.example to .env.')
}

let socket: Socket | null = null
let connectionRefCount = 0

export function getSocketClient(): Socket {
  if (!socket) {
    socket = io(socketUrl, {
      withCredentials: true,
      autoConnect: false,
    })
  }

  return socket
}

/** Retain a shared socket connection; disconnects only when all consumers release. */
export function retainSocketClient(): Socket {
  connectionRefCount += 1
  const client = getSocketClient()
  if (!client.connected) {
    client.connect()
  }
  return client
}

export function releaseSocketClient(): void {
  connectionRefCount = Math.max(0, connectionRefCount - 1)
  if (connectionRefCount === 0 && socket?.connected) {
    socket.disconnect()
  }
}

export function connectSocketClient(): Socket {
  return retainSocketClient()
}

export function disconnectSocketClient(): void {
  releaseSocketClient()
}
