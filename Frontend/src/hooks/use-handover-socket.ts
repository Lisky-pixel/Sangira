import { useEffect } from 'react'
import { HANDOVER_SOCKET } from '../constants/handover'
import {
  connectSocketClient,
  releaseSocketClient,
} from '../realtime/socket-client'
import type { HandoverUpdatedPayload } from '../types/handover'

type HandoverJoinAck = {
  success: boolean
  room?: string
  error?: string
}

export function useHandoverSocket(
  requestId: string | null,
  onUpdated: (payload: HandoverUpdatedPayload) => void,
  enabled: boolean,
) {
  useEffect(() => {
    if (!requestId || !enabled) {
      return
    }

    const socket = connectSocketClient()

    const handleUpdated = (payload: HandoverUpdatedPayload) => {
      if (payload.requestId === requestId) {
        onUpdated(payload)
      }
    }

    socket.on(HANDOVER_SOCKET.EVENT_UPDATED, handleUpdated)
    socket.emit(
      HANDOVER_SOCKET.EVENT_JOIN,
      { requestId },
      (ack: HandoverJoinAck) => {
        if (!ack?.success) {
          console.warn('Handover room join failed:', ack?.error ?? 'unknown')
        }
      },
    )

    return () => {
      socket.off(HANDOVER_SOCKET.EVENT_UPDATED, handleUpdated)
      releaseSocketClient()
    }
  }, [requestId, enabled, onUpdated])
}
