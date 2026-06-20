import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { useAuth } from '../auth'
import { isAdminRole } from '../constants/portal-roles'
import { adminPortalService } from '../services/admin-portal-service'
import { normalizePendingBadgeCount } from '../lib/admin-pending-badge'
import type {
  VerificationNewPayload,
  VerificationUpdatedPayload,
} from '../types/admin-verification'
import {
  AdminVerificationContext,
  type AdminVerificationContextValue,
} from './admin-verification-context'
import {
  releaseAdminVerificationSocket,
  retainAdminVerificationSocket,
  subscribeAdminSocketReconnect,
  subscribeVerificationNew as subscribeSocketNew,
  subscribeVerificationUpdated as subscribeSocketUpdated,
} from './admin-verification-socket'

type AdminVerificationProviderProps = {
  children: ReactNode
}

export function AdminVerificationProvider({
  children,
}: AdminVerificationProviderProps) {
  const { state } = useAuth()
  const enabled =
    state.status === 'authed' && isAdminRole(state.user.role)

  const [pendingBadgeCount, setPendingBadgeCount] = useState<number | null>(null)
  const [loadState, setLoadState] =
    useState<AdminVerificationContextValue['loadState']>('loading')
  const pendingCountSyncGenerationRef = useRef(0)

  const updatedHandlersRef = useRef(
    new Set<(payload: VerificationUpdatedPayload) => void>(),
  )
  const newHandlersRef = useRef(
    new Set<(payload: VerificationNewPayload) => void>(),
  )

  const syncPendingBadgeCount = useCallback((count: number) => {
    pendingCountSyncGenerationRef.current += 1
    setPendingBadgeCount(normalizePendingBadgeCount(count))
  }, [])

  const refreshPendingBadgeCount = useCallback(async () => {
    if (!enabled) {
      setPendingBadgeCount(null)
      setLoadState('ready')
      return
    }

    setLoadState('loading')
    try {
      const count = await adminPortalService.getPendingVerificationCount()
      setPendingBadgeCount(normalizePendingBadgeCount(count))
      setLoadState('ready')
    } catch {
      setPendingBadgeCount(null)
      setLoadState('error')
    }
  }, [enabled])

  const subscribeVerificationUpdated = useCallback(
    (handler: (payload: VerificationUpdatedPayload) => void) => {
      updatedHandlersRef.current.add(handler)
      return () => {
        updatedHandlersRef.current.delete(handler)
      }
    },
    [],
  )

  const subscribeVerificationNew = useCallback(
    (handler: (payload: VerificationNewPayload) => void) => {
      newHandlersRef.current.add(handler)
      return () => {
        newHandlersRef.current.delete(handler)
      }
    },
    [],
  )

  useEffect(() => {
    let cancelled = false

    const load = async () => {
      if (!enabled) {
        if (!cancelled) {
          setPendingBadgeCount(null)
          setLoadState('ready')
        }
        return
      }

      setLoadState('loading')
      const generationAtStart = pendingCountSyncGenerationRef.current
      try {
        const count = await adminPortalService.getPendingVerificationCount()
        if (
          !cancelled &&
          generationAtStart === pendingCountSyncGenerationRef.current
        ) {
          setPendingBadgeCount(normalizePendingBadgeCount(count))
          setLoadState('ready')
        } else if (!cancelled) {
          setLoadState('ready')
        }
      } catch {
        if (!cancelled) {
          setPendingBadgeCount(null)
          setLoadState('error')
        }
      }
    }

    void load()

    return () => {
      cancelled = true
    }
  }, [enabled])

  useEffect(() => {
    if (!enabled) {
      return
    }

    retainAdminVerificationSocket()

    const handleUpdated = (payload: VerificationUpdatedPayload) => {
      setPendingBadgeCount(normalizePendingBadgeCount(payload.pendingCount))
      updatedHandlersRef.current.forEach((handler) => handler(payload))
    }

    const handleNew = (payload: VerificationNewPayload) => {
      setPendingBadgeCount(normalizePendingBadgeCount(payload.pendingCount))
      newHandlersRef.current.forEach((handler) => handler(payload))
    }

    const unsubscribeUpdated = subscribeSocketUpdated(handleUpdated)
    const unsubscribeNew = subscribeSocketNew(handleNew)
    const unsubscribeReconnect = subscribeAdminSocketReconnect(() => {
      void refreshPendingBadgeCount()
    })

    return () => {
      unsubscribeUpdated()
      unsubscribeNew()
      unsubscribeReconnect()
      releaseAdminVerificationSocket()
    }
  }, [enabled, refreshPendingBadgeCount])

  const value = useMemo(
    () => ({
      pendingBadgeCount,
      loadState,
      refreshPendingBadgeCount,
      syncPendingBadgeCount,
      subscribeVerificationUpdated,
      subscribeVerificationNew,
    }),
    [
      pendingBadgeCount,
      loadState,
      refreshPendingBadgeCount,
      syncPendingBadgeCount,
      subscribeVerificationUpdated,
      subscribeVerificationNew,
    ],
  )

  return (
    <AdminVerificationContext.Provider value={value}>
      {children}
    </AdminVerificationContext.Provider>
  )
}
