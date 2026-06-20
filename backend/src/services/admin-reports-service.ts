import mongoose from 'mongoose'
import {
  ADMIN_REPORTS,
  ADMIN_REPORTS_WEEKDAY_ORDER,
  type AdminReportsWeekday,
} from '../constants/admin-reports.js'
import { MONGO_READ_PREFERENCE_PRIMARY } from '../constants/mongo.js'
import { REQUEST_STATUS, VERIFICATION_STATUS } from '../constants/enums.js'
import {
  FOOD_TYPE_LABELS,
  type FoodType,
} from '../constants/listing-form.js'
import { Listing } from '../models/listing.js'
import { Request as FoodRequest } from '../models/request.js'
import { User } from '../models/user.js'
import {
  computeMonthOverMonthChangePercent,
  getCalendarMonthRange,
} from '../utils/calendar-month.js'

const COMPLETED_REQUEST_FILTER = {
  status: REQUEST_STATUS.COMPLETED,
  'confirmation.completedAt': { $exists: true, $ne: null },
} as const

const READ_PRIMARY = { readPreference: MONGO_READ_PREFERENCE_PRIMARY } as const

type ImpactTotalsRow = {
  mealsRedistributed: number
  wastePreventedKg: number
  completedTransfers: number
}

type MealsMonthRow = {
  meals: number
}

type MealsByWeekdayRow = {
  _id: number
  meals: number
}

type FoodTypeCountRow = {
  _id: FoodType
  count: number
}

type RankedOrgRow = {
  _id: mongoose.Types.ObjectId
  count: number
}

type AverageMatchTimeRow = {
  avgMatchMs: number
  sampleSize: number
}

export type AdminReportsMealsByDayOfWeek = {
  day: AdminReportsWeekday
  meals: number
}

export type AdminReportsFoodTypeCount = {
  foodType: FoodType
  label: string
  count: number
}

export type AdminReportsRankedOrganisation = {
  organisationName: string
  verified: boolean
  transfers?: number
  pickups?: number
}

export type AdminReportsData = {
  stats: {
    mealsRedistributed: {
      total: number
      monthOverMonthChangePercent: number | null
    }
    wastePreventedKg: number
    completedTransfers: number
    averageMatchTimeMinutes: number | null
    averageMatchTimeRollingDays: typeof ADMIN_REPORTS.ROLLING_MATCH_DAYS
  }
  mealsByDayOfWeek: AdminReportsMealsByDayOfWeek[]
  listingsByFoodType: AdminReportsFoodTypeCount[]
  topDonors: AdminReportsRankedOrganisation[]
  mostServedNgos: AdminReportsRankedOrganisation[]
}

function formatOrganisationName(value: string | null | undefined) {
  const trimmed = typeof value === 'string' ? value.trim() : ''
  return trimmed || 'Organisation'
}

async function aggregateAllTimeImpactTotals(): Promise<ImpactTotalsRow> {
  const [row] = await FoodRequest.aggregate<{
    mealsRedistributed: number
    wastePreventedKg: number
    completedTransfers: number
  }>(
    [
      { $match: COMPLETED_REQUEST_FILTER },
      {
        $group: {
          _id: null,
          mealsRedistributed: {
            $sum: { $ifNull: ['$mealsRedistributed', 0] },
          },
          wastePreventedKg: {
            $sum: { $ifNull: ['$wasteKgPrevented', 0] },
          },
          completedTransfers: { $sum: 1 },
        },
      },
    ],
    READ_PRIMARY,
  )

  return {
    mealsRedistributed: row?.mealsRedistributed ?? 0,
    wastePreventedKg: row?.wastePreventedKg ?? 0,
    completedTransfers: row?.completedTransfers ?? 0,
  }
}

async function sumMealsCompletedBetween(
  start: Date,
  end: Date,
): Promise<number> {
  const [row] = await FoodRequest.aggregate<MealsMonthRow>(
    [
      {
        $match: {
          ...COMPLETED_REQUEST_FILTER,
          'confirmation.completedAt': { $gte: start, $lt: end },
        },
      },
      {
        $group: {
          _id: null,
          meals: { $sum: { $ifNull: ['$mealsRedistributed', 0] } },
        },
      },
    ],
    READ_PRIMARY,
  )

  return row?.meals ?? 0
}

async function aggregateMealsByDayOfWeek(): Promise<AdminReportsMealsByDayOfWeek[]> {
  const rows = await FoodRequest.aggregate<MealsByWeekdayRow>(
    [
      { $match: COMPLETED_REQUEST_FILTER },
      {
        $group: {
          _id: { $isoDayOfWeek: '$confirmation.completedAt' },
          meals: { $sum: { $ifNull: ['$mealsRedistributed', 0] } },
        },
      },
    ],
    READ_PRIMARY,
  )

  const mealsByIsoDay = new Map(
    rows.map((row) => [row._id, row.meals]),
  )

  return ADMIN_REPORTS_WEEKDAY_ORDER.map((day, index) => ({
    day,
    meals: mealsByIsoDay.get(index + 1) ?? 0,
  }))
}

async function aggregateListingsByFoodType(): Promise<AdminReportsFoodTypeCount[]> {
  const rows = await Listing.aggregate<FoodTypeCountRow>(
    [
      {
        $group: {
          _id: '$foodType',
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ],
    READ_PRIMARY,
  )

  return rows.map((row) => ({
    foodType: row._id,
    label: FOOD_TYPE_LABELS[row._id],
    count: row.count,
  }))
}

async function aggregateTopDonors(): Promise<AdminReportsRankedOrganisation[]> {
  const rows = await FoodRequest.aggregate<RankedOrgRow>(
    [
      { $match: COMPLETED_REQUEST_FILTER },
      {
        $lookup: {
          from: Listing.collection.name,
          localField: 'listing',
          foreignField: '_id',
          as: 'listingDoc',
        },
      },
      { $unwind: '$listingDoc' },
      {
        $group: {
          _id: '$listingDoc.donor',
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: ADMIN_REPORTS.TOP_DONORS_LIMIT },
    ],
    READ_PRIMARY,
  )

  if (rows.length === 0) {
    return []
  }

  const donors = await User.find({ _id: { $in: rows.map((row) => row._id) } })
    .select('organisationName verification.status')
    .lean<
      {
        _id: mongoose.Types.ObjectId
        organisationName?: string
        verification?: { status?: string }
      }[]
    >()

  const donorById = new Map(
    donors.map((donor) => [donor._id.toString(), donor]),
  )

  return rows.map((row) => {
    const donor = donorById.get(row._id.toString())
    return {
      organisationName: formatOrganisationName(donor?.organisationName),
      verified:
        donor?.verification?.status === VERIFICATION_STATUS.APPROVED,
      transfers: row.count,
    }
  })
}

async function aggregateMostServedNgos(): Promise<AdminReportsRankedOrganisation[]> {
  const rows = await FoodRequest.aggregate<RankedOrgRow>(
    [
      { $match: COMPLETED_REQUEST_FILTER },
      {
        $group: {
          _id: '$ngo',
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: ADMIN_REPORTS.TOP_NGOS_LIMIT },
    ],
    READ_PRIMARY,
  )

  if (rows.length === 0) {
    return []
  }

  const ngos = await User.find({ _id: { $in: rows.map((row) => row._id) } })
    .select('organisationName verification.status')
    .lean<
      {
        _id: mongoose.Types.ObjectId
        organisationName?: string
        verification?: { status?: string }
      }[]
    >()

  const ngoById = new Map(ngos.map((ngo) => [ngo._id.toString(), ngo]))

  return rows.map((row) => {
    const ngo = ngoById.get(row._id.toString())
    return {
      organisationName: formatOrganisationName(ngo?.organisationName),
      verified: ngo?.verification?.status === VERIFICATION_STATUS.APPROVED,
      pickups: row.count,
    }
  })
}

async function aggregateRollingAverageMatchTimeMinutes(
  now: Date,
): Promise<number | null> {
  const since = new Date(
    now.getTime() - ADMIN_REPORTS.ROLLING_MATCH_DAYS * 24 * 60 * 60 * 1000,
  )

  const [row] = await FoodRequest.aggregate<AverageMatchTimeRow>(
    [
      {
        $match: {
          acceptedAt: { $gte: since, $ne: null },
          status: {
            $in: [REQUEST_STATUS.ACCEPTED, REQUEST_STATUS.COMPLETED],
          },
        },
      },
      {
        $lookup: {
          from: Listing.collection.name,
          localField: 'listing',
          foreignField: '_id',
          as: 'listingDoc',
        },
      },
      { $unwind: '$listingDoc' },
      {
        $project: {
          matchMs: {
            $subtract: ['$acceptedAt', '$listingDoc.createdAt'],
          },
        },
      },
      {
        $match: {
          matchMs: { $gte: 0 },
        },
      },
      {
        $group: {
          _id: null,
          avgMatchMs: { $avg: '$matchMs' },
          sampleSize: { $sum: 1 },
        },
      },
    ],
    READ_PRIMARY,
  )

  if (!row || row.sampleSize === 0 || row.avgMatchMs == null) {
    return null
  }

  return Math.round(row.avgMatchMs / ADMIN_REPORTS.MS_PER_MINUTE)
}

export async function getAdminReports(now = new Date()): Promise<AdminReportsData> {
  const thisMonth = getCalendarMonthRange(now, 0)
  const lastMonth = getCalendarMonthRange(now, -1)

  const [
    impactTotals,
    mealsThisMonth,
    mealsLastMonth,
    mealsByDayOfWeek,
    listingsByFoodType,
    topDonors,
    mostServedNgos,
    averageMatchTimeMinutes,
  ] = await Promise.all([
    aggregateAllTimeImpactTotals(),
    sumMealsCompletedBetween(thisMonth.start, thisMonth.end),
    sumMealsCompletedBetween(lastMonth.start, lastMonth.end),
    aggregateMealsByDayOfWeek(),
    aggregateListingsByFoodType(),
    aggregateTopDonors(),
    aggregateMostServedNgos(),
    aggregateRollingAverageMatchTimeMinutes(now),
  ])

  return {
    stats: {
      mealsRedistributed: {
        total: impactTotals.mealsRedistributed,
        monthOverMonthChangePercent: computeMonthOverMonthChangePercent(
          mealsThisMonth,
          mealsLastMonth,
        ),
      },
      wastePreventedKg: impactTotals.wastePreventedKg,
      completedTransfers: impactTotals.completedTransfers,
      averageMatchTimeMinutes,
      averageMatchTimeRollingDays: ADMIN_REPORTS.ROLLING_MATCH_DAYS,
    },
    mealsByDayOfWeek,
    listingsByFoodType,
    topDonors,
    mostServedNgos,
  }
}
