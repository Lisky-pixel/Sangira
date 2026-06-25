import type { Server as HttpServer } from 'http'
import { Server } from 'socket.io'
import { config } from '../config/env.js'
import { ROLES } from '../constants/enums.js'
import type { Role } from '../constants/enums.js'
import { HANDOVER_SOCKET } from '../constants/handover.js'
import { authorizeHandoverRoomJoin } from '../services/handover-service.js'
import { AppError } from '../utils/app-error.js'
import { handoverRoomName, setSocketServer } from './handover-events.js'
import { userRoomName } from './notification-events.js'
import {
  adminRoomName,
  setVerificationSocketServer,
} from './verification-events.js'
import { authenticateSocketCookieHeader } from './socket-auth.js'

function parseClientOrigins() {
  const origins = config.CLIENT_URL.split(',')
    .map((origin) => origin.trim())
    .filter(Boolean)

  return origins.length === 1 ? origins[0] : origins
}

export function initSocketServer(httpServer: HttpServer): Server {
  const io = new Server(httpServer, {
    cors: {
      origin: parseClientOrigins(),
      credentials: true,
    },
  })

  setSocketServer(io)
  setVerificationSocketServer(io)

  io.use((socket, next) => {
    const auth = authenticateSocketCookieHeader(socket.handshake.headers.cookie)
    if (!auth) {
      return next(new Error('Unauthorized'))
    }

    socket.data.auth = auth
    return next()
  })

  io.on('connection', (socket) => {
    const auth = socket.data.auth as { userId: string; role: Role }
    void socket.join(userRoomName(auth.userId))

    if (auth.role === ROLES.ADMIN) {
      void socket.join(adminRoomName())
    }

    socket.on(HANDOVER_SOCKET.EVENT_JOIN, async (payload, ack) => {
      const requestId =
        typeof payload === 'object' &&
        payload !== null &&
        'requestId' in payload &&
        typeof payload.requestId === 'string'
          ? payload.requestId
          : null

      if (!requestId) {
        ack?.({ success: false, error: 'requestId is required' })
        return
      }

      try {
        const auth = socket.data.auth as { userId: string; role: Role }
        await authorizeHandoverRoomJoin({
          userId: auth.userId,
          role: auth.role,
          requestId,
        })
        await socket.join(handoverRoomName(requestId))
        ack?.({ success: true, room: handoverRoomName(requestId) })
      } catch (error) {
        const message =
          error instanceof AppError
            ? error.message
            : 'Could not join handover room'
        ack?.({ success: false, error: message })
      }
    })
  })

  return io
}

export function closeSocketServer(io: Server): Promise<void> {
  return new Promise((resolve, reject) => {
    io.close((error) => {
      if (error) {
        reject(error)
        return
      }
      resolve()
    })
  })
}
