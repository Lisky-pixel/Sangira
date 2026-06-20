import mongoose from 'mongoose'
import {
  ADMIN_LISTING_STATUS_FILTER,
  type AdminListingDisplayStatus,
} from '../constants/admin-listings.js'
import { LISTING_STATUS, VERIFICATION_STATUS } from '../constants/enums.js'
import { QUANTITY_UNIT_LABELS, type QuantityUnit } from '../constants/listing-form.js'
import { Listing } from '../models/listing.js'
import { Request as FoodRequest } from '../models/request.js'
import { User } from '../models/user.js'
import { countUnmatchedExpiredListingsThisMonth } from '../utils/count-unmatched-expired-listings.js'
import {
  buildAdminListingStatusMongoFilter,
  resolveAdminListingDisplayStatus,
} from '../utils/resolve-admin-listing-display-status.js'
import type { AdminListingsQuery } from '../validators/admin-listings.js'

type ListingLean = {
  _id: mongoose.Types.ObjectId
  title: string
  quantity: number
  quantityUnit: QuantityUnit
  expiresAt: Date
  status: string
  createdAt: Date
  donor: mongoose.Types.ObjectId
}

type DonorLean = {
  _id: mongoose.Types.ObjectId
  organisationName?: string
  verification?: { status?: string }
}

export type SerializedAdminListingListItem = {
  id: string
  title: string
  donor: {
    organisationName: string
    verified: boolean
  }
  quantity: number
  quantityUnit: QuantityUnit
  quantityLabel: string
  postedAt: string
  expiresAt: string
  displayStatus: AdminListingDisplayStatus
  requestsCount: number
}

export type AdminListingStatusCounts = {
  all: number
  active: number
  awaiting_pickup: number
  completed: number
  expired: number
}

async function countListingsByStatusFilter(
  statusFilter: string,
  now: Date,
): Promise<number> {
  const [result] = await Listing.aggregate<{ count: number }>([
    { $match: buildAdminListingStatusMongoFilter(statusFilter, now) },
    { $count: 'count' },
  ])
  return result?.count ?? 0
}

async function buildStatusCounts(now: Date): Promise<AdminListingStatusCounts> {
  const [all, active, awaiting_pickup, completed, expired] = await Promise.all([
    countListingsByStatusFilter(ADMIN_LISTING_STATUS_FILTER.ALL, now),
    countListingsByStatusFilter(ADMIN_LISTING_STATUS_FILTER.ACTIVE, now),
    countListingsByStatusFilter(
      ADMIN_LISTING_STATUS_FILTER.AWAITING_PICKUP,
      now,
    ),
    countListingsByStatusFilter(ADMIN_LISTING_STATUS_FILTER.COMPLETED, now),
    countListingsByStatusFilter(ADMIN_LISTING_STATUS_FILTER.EXPIRED, now),
  ])

  return { all, active, awaiting_pickup, completed, expired }
}

export async function listAdminListings(query: AdminListingsQuery) {
  const now = new Date()
  const page = query.page
  const pageSize = query.pageSize
  const filter = buildAdminListingStatusMongoFilter(query.status, now)
  const skip = (page - 1) * pageSize

  const [countRows, listings, statusCounts, unmatchedExpiredThisMonth] =
    await Promise.all([
      Listing.aggregate<{ count: number }>([
        { $match: filter },
        { $count: 'count' },
      ]),
      Listing.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(pageSize)
        .select('title quantity quantityUnit expiresAt status createdAt donor')
        .lean<ListingLean[]>(),
      buildStatusCounts(now),
      countUnmatchedExpiredListingsThisMonth(now),
    ])

  const totalItems = countRows[0]?.count ?? 0
  const totalPages = totalItems === 0 ? 1 : Math.ceil(totalItems / pageSize)

  if (listings.length === 0) {
    return {
      listings: [] as SerializedAdminListingListItem[],
      pagination: { page, pageSize, totalItems, totalPages },
      statusCounts,
      insights: { unmatchedExpiredThisMonth },
    }
  }

  const listingIds = listings.map((listing) => listing._id)
  const donorIds = [...new Set(listings.map((listing) => listing.donor.toString()))]

  const [requestCounts, donors] = await Promise.all([
    FoodRequest.aggregate<{ _id: mongoose.Types.ObjectId; count: number }>([
      { $match: { listing: { $in: listingIds } } },
      { $group: { _id: '$listing', count: { $sum: 1 } } },
    ]),
    User.find({ _id: { $in: donorIds } })
      .select('organisationName verification.status')
      .lean<DonorLean[]>(),
  ])

  const requestsByListingId = new Map(
    requestCounts.map((entry) => [entry._id.toString(), entry.count]),
  )

  const donorById = new Map(
    donors.map((donor) => [donor._id.toString(), donor]),
  )

  const items: SerializedAdminListingListItem[] = []

  for (const listing of listings) {
    const displayStatus = resolveAdminListingDisplayStatus(
      listing.status as (typeof LISTING_STATUS)[keyof typeof LISTING_STATUS],
      listing.expiresAt,
      now,
    )

    if (!displayStatus) {
      continue
    }

    const donor = donorById.get(listing.donor.toString())
    const organisationName =
      donor?.organisationName?.trim() || 'Organisation'

    items.push({
      id: listing._id.toString(),
      title: listing.title,
      donor: {
        organisationName,
        verified:
          donor?.verification?.status === VERIFICATION_STATUS.APPROVED,
      },
      quantity: listing.quantity,
      quantityUnit: listing.quantityUnit,
      quantityLabel: `${listing.quantity} ${QUANTITY_UNIT_LABELS[listing.quantityUnit]}`,
      postedAt: listing.createdAt.toISOString(),
      expiresAt: listing.expiresAt.toISOString(),
      displayStatus,
      requestsCount: requestsByListingId.get(listing._id.toString()) ?? 0,
    })
  }

  return {
    listings: items,
    pagination: { page, pageSize, totalItems, totalPages },
    statusCounts,
    insights: { unmatchedExpiredThisMonth },
  }
}
