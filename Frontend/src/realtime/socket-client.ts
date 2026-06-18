import { io, type Socket } from 'socket.io-client'

const socketUrl = import.meta.env.VITE_API_URL

if (!socketUrl) {
  throw new Error('VITE_API_URL is not defined. Copy .env.example to .env.')
}

let socket: Socket | null = null

export function getSocketClient(): Socket {
  if (!socket) {
    socket = io(socketUrl, {
      withCredentials: true,
      autoConnect: false,
    })
  }

  return socket
}

export function connectSocketClient(): Socket {
  const client = getSocketClient()
  if (!client.connected) {
    client.connect()
  }
  return client
}

export function disconnectSocketClient(): void {
  if (socket?.connected) {
    socket.disconnect()
  }
}
