import { useCallback, useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { mergeListingsById } from '../lib/merge-listings-by-id'
import { filterVisibleListings } from '../lib/my-listings-filters'
import { subscribeMyListingsInvalidation } from '../lib/my-listings-invalidation'
import {
  getCreatedListingFromLocationState,
  type MyListingsLocationState,
} from '../routes/my-listings-location-state'
import { listingService } from '../services/listing-service'
import type { Listing } from '../types/listing'

export type MyListingsLoadState = 'loading' | 'ready' | 'error'

type FetchOptions = {
  background?: boolean
}

function buildInitialListings(seededListing: Listing | null): Listing[] {
  return seededListing ? [seededListing] : []
}

export function useMyListings() {
  const location = useLocation()
  const navigate = useNavigate()
  const seededListing = getCreatedListingFromLocationState(location.state)
  const clearedNavStateRef = useRef(false)

  const [listings, setListings] = useState<Listing[]>(() =>
    buildInitialListings(seededListing),
  )
  const [loadState, setLoadState] = useState<MyListingsLoadState>(() =>
    seededListing ? 'ready' : 'loading',
  )
  const hasDataRef = useRef(Boolean(seededListing))
  const inFlightRef = useRef(false)

  const fetchListings = useCallback(async (options?: FetchOptions) => {
    if (inFlightRef.current) {
      return
    }

    const background = options?.background ?? hasDataRef.current
    inFlightRef.current = true

    if (!background) {
      setLoadState('loading')
    }

    try {
      const data = filterVisibleListings(await listingService.getMyListings())
      hasDataRef.current = true
      setListings((current) =>
        background ? mergeListingsById(current, data) : data,
      )
      setLoadState('ready')
    } catch {
      if (!hasDataRef.current) {
        setLoadState('error')
      }
    } finally {
      inFlightRef.current = false
    }
  }, [])

  useEffect(() => {
    if (!seededListing || clearedNavStateRef.current) {
      return
    }

    clearedNavStateRef.current = true
    navigate(
      { pathname: location.pathname, search: location.search },
      { replace: true, state: null satisfies MyListingsLocationState | null },
    )
  }, [
    location.pathname,
    location.search,
    navigate,
    seededListing,
  ])

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void fetchListings({ background: hasDataRef.current })
    }, 0)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [fetchListings])

  useEffect(() => {
    const handleFocus = () => {
      void fetchListings({ background: true })
    }

    window.addEventListener('focus', handleFocus)
    return () => window.removeEventListener('focus', handleFocus)
  }, [fetchListings])

  useEffect(() => {
    return subscribeMyListingsInvalidation(() => {
      void fetchListings({ background: true })
    })
  }, [fetchListings])

  return { listings, loadState, refetch: fetchListings }
}
