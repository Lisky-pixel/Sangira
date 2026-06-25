import * as Dialog from '@radix-ui/react-dialog'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { REQUEST_STATUS } from '../../constants/request-status'
import { CLOUDINARY_DELIVERY_WIDTH } from '../../constants/cloudinary-delivery'
import { formatRelativeTime } from '../../lib/relative-time'
import { cloudinaryDeliveryUrl } from '../../lib/cloudinary-delivery-url'
import { getOrgInitials } from '../../lib/org-initials'
import { resolveListingTabStatus } from '../../lib/my-listings-filters'
import { listingManageContent } from '../../placeholder/listing-manage-content'
import { donorListingHandoverPath } from '../../routes/paths'
import { requestService } from '../../services/request-service'
import { ApiError } from '../../services/api-error'
import { toast } from '../../lib/toast'
import { LISTING_STATUS } from '../../constants/listing-status'
import type { DonorListingRequest } from '../../types/request'
import type { Listing } from '../../types/listing'
import { VerifiedBadge } from '../ui/verified-badge'
import { Button } from '../ui/button'
import {
  ParticipantActionButton,
  ParticipantActionLink,
} from '../participant/participant-action-control'
import { useParticipantEditBlocked } from '../../hooks/use-participant-edit-blocked'

type ManageListingRequestsProps = {
  listing: Listing
}

type RequestCardProps = {
  request: DonorListingRequest
  listingTitle: string
  onAccepted: () => void
}

function RequestCard({ request, listingTitle, onAccepted }: RequestCardProps) {
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [isAccepting, setIsAccepting] = useState(false)
  const navigate = useNavigate()
  const { blocked: actionsBlocked } = useParticipantEditBlocked()
  const initials = getOrgInitials(request.ngo.organisationName)
  const requestedLabel = formatRelativeTime(request.createdAt)
  const isAccepted = request.status === REQUEST_STATUS.ACCEPTED

  const handleAccept = async () => {
    setIsAccepting(true)
    const acceptPromise = requestService.acceptRequest(request._id)
    const loadingId = toast.loading(
      listingManageContent.requests.acceptToast.loading,
    )

    try {
      const result = await acceptPromise
      toast.success(listingManageContent.requests.acceptToast.success, {
        id: loadingId,
      })
      setConfirmOpen(false)
      onAccepted()
      navigate(donorListingHandoverPath(request.listingId), {
        state: { requestId: result.request._id },
      })
    } catch (error) {
      toast.error(
        error instanceof ApiError
          ? error.message
          : listingManageContent.requests.acceptToast.error,
        { id: loadingId },
      )
      setIsAccepting(false)
    }
  }

  return (
    <>
      <article className="border-border rounded-xl border bg-white p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-charcoal text-sm font-semibold">
                {request.ngo.organisationName}
              </h3>
              <VerifiedBadge />
            </div>

            <p className="text-body mt-2 text-sm">
              {listingManageContent.requests.capacityToday(
                request.ngo.dailyCapacity,
              )}
            </p>

            <p className="text-body mt-1 text-sm">
              {listingManageContent.requests.requestedAgo(requestedLabel)}
            </p>
          </div>

          {request.ngo.avatarUrl ? (
            <img
              src={cloudinaryDeliveryUrl(
                request.ngo.avatarUrl,
                CLOUDINARY_DELIVERY_WIDTH.AVATAR,
              )}
              alt=""
              className="size-12 shrink-0 rounded-xl object-cover"
              loading="lazy"
            />
          ) : (
            <div
              aria-hidden="true"
              className="bg-mint-card text-primary flex size-12 shrink-0 items-center justify-center rounded-xl text-sm font-bold"
            >
              {initials}
            </div>
          )}
        </div>

        {isAccepted ? (
          <ParticipantActionLink
            to={donorListingHandoverPath(request.listingId)}
            state={{ requestId: request._id }}
            variant="primary"
            className="mt-4 w-full"
          >
            {listingManageContent.requests.continueHandover}
          </ParticipantActionLink>
        ) : (
          <ParticipantActionButton
            type="button"
            className="mt-4 w-full"
            onClick={() => setConfirmOpen(true)}
          >
            {listingManageContent.requests.accept}
          </ParticipantActionButton>
        )}
      </article>

      <Dialog.Root open={confirmOpen} onOpenChange={setConfirmOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-40 bg-charcoal/40" />
          <Dialog.Content className="border-border fixed top-1/2 left-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border bg-white p-6 shadow-lg focus:outline-none">
            <Dialog.Title className="text-charcoal text-lg font-semibold">
              {listingManageContent.requests.acceptConfirmTitle}
            </Dialog.Title>
            <Dialog.Description className="text-body mt-2 text-sm">
              {listingManageContent.requests.acceptConfirmDescription(
                request.ngo.organisationName,
                listingTitle,
              )}
            </Dialog.Description>
            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Dialog.Close asChild>
                <Button type="button" variant="outline" disabled={isAccepting}>
                  {listingManageContent.requests.acceptDismiss}
                </Button>
              </Dialog.Close>
              <Button
                type="button"
                disabled={isAccepting || actionsBlocked}
                onClick={() => void handleAccept()}
              >
                {listingManageContent.requests.acceptConfirm}
              </Button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  )
}

export function ManageListingRequests({ listing }: ManageListingRequestsProps) {
  const [requests, setRequests] = useState<DonorListingRequest[]>([])
  const [loadState, setLoadState] = useState<'loading' | 'ready' | 'error'>(
    'loading',
  )

  const displayStatus = resolveListingTabStatus(listing)
  const showRequests =
    displayStatus === LISTING_STATUS.ACTIVE ||
    displayStatus === LISTING_STATUS.REQUESTED ||
    displayStatus === LISTING_STATUS.AWAITING_PICKUP

  useEffect(() => {
    if (!showRequests) {
      return
    }

    let cancelled = false

    async function loadRequests() {
      setLoadState('loading')
      try {
        const data = await requestService.listListingRequests(listing._id)
        if (!cancelled) {
          setRequests(data.requests)
          setLoadState('ready')
        }
      } catch {
        if (!cancelled) {
          setLoadState('error')
          toast.error(listingManageContent.requests.loadError)
        }
      }
    }

    const timeoutId = window.setTimeout(() => {
      void loadRequests()
    }, 0)

    return () => {
      cancelled = true
      window.clearTimeout(timeoutId)
    }
  }, [listing._id, showRequests])

  if (!showRequests) {
    return null
  }

  return (
    <aside className="border-border rounded-2xl border bg-white p-5 sm:p-6">
      <h2 className="text-charcoal text-lg font-semibold">
        {listingManageContent.requests.heading(requests.length)}
      </h2>

      {loadState === 'loading' ? (
        <p className="text-body mt-6 text-sm">
          {listingManageContent.requests.loading}
        </p>
      ) : null}

      {loadState === 'error' ? (
        <p className="text-body mt-6 text-sm">
          {listingManageContent.requests.loadError}
        </p>
      ) : null}

      {loadState === 'ready' && requests.length === 0 ? (
        <p className="text-body mt-6 text-sm">
          {listingManageContent.requests.empty}
        </p>
      ) : null}

      {loadState === 'ready' && requests.length > 0 ? (
        <>
          <ul className="mt-4 flex flex-col gap-4">
            {requests.map((request) => (
              <li key={request._id}>
                <RequestCard
                  request={request}
                  listingTitle={listing.title}
                  onAccepted={() => {
                    setRequests((current) =>
                      current.map((item) =>
                        item._id === request._id
                          ? { ...item, status: REQUEST_STATUS.ACCEPTED }
                          : { ...item, status: REQUEST_STATUS.DECLINED },
                      ),
                    )
                  }}
                />
              </li>
            ))}
          </ul>

          <p className="text-body mt-4 text-xs">
            {listingManageContent.requests.footnote}
          </p>
        </>
      ) : null}
    </aside>
  )
}
