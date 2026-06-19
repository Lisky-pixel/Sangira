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

  const [pendingCount, setPendingCount] = useState<number | null>(null)
  const [loadState, setLoadState] =
    useState<AdminVerificationContextValue['loadState']>('loading')

  const updatedHandlersRef = useRef(
    new Set<(payload: VerificationUpdatedPayload) => void>(),
  )
  const newHandlersRef = useRef(
    new Set<(payload: VerificationNewPayload) => void>(),
  )

  const refreshPendingCount = useCallback(async () => {
    if (!enabled) {
      setPendingCount(null)
      setLoadState('ready')
      return
    }

    setLoadState('loading')
    try {
      const count = await adminPortalService.getPendingVerificationCount()
      setPendingCount(count)
      setLoadState('ready')
    } catch {
      setPendingCount(null)
      setLoadState('error')
    }
  }, [enabled])

  const decrementPendingCount = useCallback(() => {
    setPendingCount((current) =>
      typeof current === 'number' ? Math.max(0, current - 1) : current,
    )
  }, [])

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
          setPendingCount(null)
          setLoadState('ready')
        }
        return
      }

      setLoadState('loading')
      try {
        const count = await adminPortalService.getPendingVerificationCount()
        if (!cancelled) {
          setPendingCount(count)
          setLoadState('ready')
        }
      } catch {
        if (!cancelled) {
          setPendingCount(null)
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
      setPendingCount(payload.pendingCount)
      updatedHandlersRef.current.forEach((handler) => handler(payload))
    }

    const handleNew = (payload: VerificationNewPayload) => {
      setPendingCount(payload.pendingCount)
      newHandlersRef.current.forEach((handler) => handler(payload))
    }

    const unsubscribeUpdated = subscribeSocketUpdated(handleUpdated)
    const unsubscribeNew = subscribeSocketNew(handleNew)
    const unsubscribeReconnect = subscribeAdminSocketReconnect(() => {
      void refreshPendingCount()
    })

    return () => {
      unsubscribeUpdated()
      unsubscribeNew()
      unsubscribeReconnect()
      releaseAdminVerificationSocket()
    }
  }, [enabled, refreshPendingCount])

  const value = useMemo(
    () => ({
      pendingCount,
      loadState,
      refreshPendingCount,
      decrementPendingCount,
      subscribeVerificationUpdated,
      subscribeVerificationNew,
    }),
    [
      pendingCount,
      loadState,
      refreshPendingCount,
      decrementPendingCount,
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
