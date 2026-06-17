import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { ManageListingLayout } from '../../components/listing/manage-listing-details'
import { ApiError } from '../../services/api-error'
import { listingService } from '../../services/listing-service'
import { listingManageContent } from '../../placeholder/listing-manage-content'
import { toast } from '../../lib/toast'
import { ROUTES } from '../../routes/paths'
import type { Listing } from '../../types/listing'

export function ManageListingPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [listing, setListing] = useState<Listing | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) {
      navigate(ROUTES.DONOR_LISTINGS, { replace: true })
      return
    }

    let cancelled = false

    const load = async () => {
      setLoading(true)
      try {
        const data = await listingService.getListing(id)
        if (!cancelled) {
          setListing(data)
        }
      } catch (error) {
        if (cancelled) return
        if (error instanceof ApiError && (error.status === 403 || error.status === 404)) {
          toast.error(listingManageContent.loadError)
        } else {
          toast.error(listingManageContent.loadError)
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
  }, [id, navigate])

  if (loading) {
    return (
      <p className="text-body text-sm">{listingManageContent.loading}</p>
    )
  }

  if (!listing) {
    return null
  }

  return <ManageListingLayout listing={listing} />
}
