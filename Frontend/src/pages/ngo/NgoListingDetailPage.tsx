import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { useAuth } from '../../auth'
import { NgoListingDetailView } from '../../components/ngo/ngo-listing-detail-view'
import { getNgoServiceCoordinates } from '../../lib/ngo-service-location'
import { toast } from '../../lib/toast'
import { ngoListingDetailContent } from '../../placeholder/ngo-listing-detail-content'
import { ApiError } from '../../services/api-error'
import { listingService } from '../../services/listing-service'
import type { NgoBrowseListing } from '../../types/ngo-browse-listing'

export function NgoListingDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { state } = useAuth()
  const ngoCoordinates =
    state.status === 'authed' ? getNgoServiceCoordinates(state.user) : null
  const [listing, setListing] = useState<NgoBrowseListing | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) {
      navigate(ngoListingDetailContent.routes.browse, { replace: true })
      return
    }

    let cancelled = false

    const load = async () => {
      setLoading(true)
      try {
        const data = await listingService.getBrowseListing(id)
        if (!cancelled) {
          setListing(data)
        }
      } catch (error) {
        if (cancelled) return
        if (error instanceof ApiError && error.status === 404) {
          toast.error(ngoListingDetailContent.loadError)
        } else {
          toast.error(ngoListingDetailContent.loadError)
        }
        navigate(ngoListingDetailContent.routes.browse, { replace: true })
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    const timeoutId = window.setTimeout(() => {
      void load()
    }, 0)

    return () => {
      cancelled = true
      window.clearTimeout(timeoutId)
    }
  }, [id, navigate])

  if (loading) {
    return (
      <p className="text-body text-sm">{ngoListingDetailContent.loading}</p>
    )
  }

  if (!listing) {
    return null
  }

  return (
    <NgoListingDetailView listing={listing} ngoCoordinates={ngoCoordinates} />
  )
}
