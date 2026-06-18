import { useCallback, useEffect, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router'
import {
  DonorHandoverCard,
  DonorHandoverCompletion,
  DonorHandoverWaiting,
} from '../../components/handover'
import { REQUEST_STATUS } from '../../constants/request-status'
import { useHandoverSocket } from '../../hooks/use-handover-socket'
import { donorHandoverContent } from '../../placeholder/donor-handover-content'
import {
  donorListingManagePath,
  ROUTES,
} from '../../routes/paths'
import { ApiError } from '../../services/api-error'
import { handoverService } from '../../services/handover-service'
import { requestService } from '../../services/request-service'
import { toast } from '../../lib/toast'
import type {
  HandoverUpdatedPayload,
  HandoverView,
} from '../../types/handover'

type HandoverLocationState = {
  requestId?: string
}

type HandoverPageView = 'handover' | 'waiting' | 'completed'

function resolvePageView(handover: HandoverView): HandoverPageView {
  if (handover.status === REQUEST_STATUS.COMPLETED) {
    return 'completed'
  }

  if (handover.confirmation.donorConfirmed) {
    return 'waiting'
  }

  return 'handover'
}

function applyHandoverUpdate(
  current: HandoverView,
  payload: HandoverUpdatedPayload,
): HandoverView {
  return {
    ...current,
    status: payload.status,
    confirmation: {
      ...current.confirmation,
      donorConfirmed: payload.donorConfirmed,
      ngoConfirmed: payload.ngoConfirmed,
      ...(payload.completedAt
        ? { completedAt: payload.completedAt }
        : {}),
    },
  }
}

async function resolveAcceptedRequestId(
  listingId: string,
  stateRequestId?: string,
): Promise<string | null> {
  if (stateRequestId) {
    return stateRequestId
  }

  const { requests } = await requestService.listListingRequests(listingId)
  const active = requests.find(
    (request) =>
      request.status === REQUEST_STATUS.ACCEPTED ||
      request.status === REQUEST_STATUS.COMPLETED,
  )

  return active?._id ?? null
}

export function DonorHandoverPage() {
  const { id: listingId } = useParams<{ id: string }>()
  const location = useLocation()
  const navigate = useNavigate()
  const locationState = (location.state ?? {}) as HandoverLocationState

  const [handover, setHandover] = useState<HandoverView | null>(null)
  const [pageView, setPageView] = useState<HandoverPageView>('handover')
  const [loading, setLoading] = useState(true)
  const [foodReady, setFoodReady] = useState(false)
  const [ngoArrived, setNgoArrived] = useState(false)
  const [isConfirming, setIsConfirming] = useState(false)

  useEffect(() => {
    if (!listingId) {
      navigate(ROUTES.DONOR_LISTINGS, { replace: true })
      return
    }

    let cancelled = false

    const load = async () => {
      setLoading(true)

      try {
        const requestId = await resolveAcceptedRequestId(
          listingId,
          locationState.requestId,
        )

        if (!requestId) {
          toast.error(donorHandoverContent.loadError)
          navigate(donorListingManagePath(listingId), { replace: true })
          return
        }

        const { handover: view } = await handoverService.getHandover(requestId)

        if (cancelled) {
          return
        }

        setHandover(view)
        setPageView(resolvePageView(view))
      } catch (error) {
        if (cancelled) {
          return
        }

        if (error instanceof ApiError) {
          toast.error(error.message)
        } else {
          toast.error(donorHandoverContent.loadError)
        }

        navigate(ROUTES.DONOR_LISTINGS, { replace: true })
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    void load()

    return () => {
      cancelled = true
    }
  }, [listingId, locationState.requestId, navigate])

  const handleSocketUpdate = useCallback((payload: HandoverUpdatedPayload) => {
    setHandover((current) => {
      if (!current) {
        return current
      }

      const next = applyHandoverUpdate(current, payload)
      setPageView(resolvePageView(next))
      return next
    })
  }, [])

  const socketEnabled =
    Boolean(handover?.requestId) &&
    pageView === 'waiting' &&
    handover?.status !== REQUEST_STATUS.COMPLETED

  useHandoverSocket(handover?.requestId ?? null, handleSocketUpdate, socketEnabled)

  const handleConfirm = async () => {
    if (!handover?.requestId) {
      return
    }

    setIsConfirming(true)
    const confirmPromise = handoverService.confirmHandover(handover.requestId)
    const loadingId = toast.loading(donorHandoverContent.confirmToast.loading)

    try {
      const { handover: payload } = await confirmPromise
      toast.success(donorHandoverContent.confirmToast.success, { id: loadingId })

      setHandover((current) => {
        if (!current) {
          return current
        }

        const next = applyHandoverUpdate(current, payload)
        setPageView(resolvePageView(next))
        return next
      })
    } catch (error) {
      toast.error(
        error instanceof ApiError
          ? error.message
          : donorHandoverContent.confirmToast.error,
        { id: loadingId },
      )
    } finally {
      setIsConfirming(false)
    }
  }

  if (loading) {
    return (
      <p className="text-body text-center text-sm">
        {donorHandoverContent.loading}
      </p>
    )
  }

  if (!handover || !listingId) {
    return null
  }

  if (pageView === 'completed') {
    return (
      <DonorHandoverCompletion
        otherParty={handover.otherParty}
        listing={handover.listing}
        completedAt={handover.confirmation.completedAt}
      />
    )
  }

  const pickupPin = handover.pickupPin
  const qrToken = handover.qrToken

  if (!pickupPin || !qrToken) {
    return (
      <p className="text-body text-center text-sm">
        {donorHandoverContent.loadError}
      </p>
    )
  }

  return (
    <div className="mx-auto w-full max-w-lg">
      <Link
        to={donorListingManagePath(listingId)}
        className="text-primary mb-4 inline-flex text-sm font-medium hover:underline"
      >
        {donorHandoverContent.backToListing}
      </Link>

      <DonorHandoverCard
        otherParty={handover.otherParty}
        listing={handover.listing}
        pickupPin={pickupPin}
        qrToken={qrToken}
        foodReady={foodReady}
        ngoArrived={ngoArrived}
        onFoodReadyChange={setFoodReady}
        onNgoArrivedChange={setNgoArrived}
        onConfirm={() => void handleConfirm()}
        isConfirming={isConfirming}
        showConfirmControls={pageView === 'handover'}
      />

      {pageView === 'waiting' ? (
        <DonorHandoverWaiting
          ngoName={handover.otherParty.organisationName}
        />
      ) : null}
    </div>
  )
}
