import { Notification } from '../models/notification.js'
import { User } from '../models/user.js'
import { Listing } from '../models/listing.js'
import { Request as FoodRequest } from '../models/request.js'
import { NOTIFICATION_TYPE, ROLES, ACCOUNT_STATUS, VERIFICATION_STATUS } from '../constants/enums.js'
import type { QuantityUnit } from '../constants/listing-form.js'
import { NOTIFICATION_EVENT_KEY } from '../constants/notification-preferences.js'
import { NGO_NOTIFICATION_EVENT_KEY } from '../constants/ngo-notification-preferences.js'
import {
  DONOR_NOTIFICATION_TITLE,
  formatDonorNotificationBody,
  NOTIFICATION_LIST,
} from '../constants/notifications.js'
import {
  NGO_NOTIFICATION_TITLE,
  formatNgoNotificationBody,
} from '../constants/ngo-notifications.js'
import { normalizeNotificationPrefs } from '../utils/normalize-notification-prefs.js'
import { notFound } from '../utils/app-error.js'
import { emitNotificationNew } from '../realtime/notification-events.js'
import type { NotificationType } from '../constants/enums.js'

// TODO: scheduled-notifications slice — pickup reminders, listing expiring soon, impact summary

export type SerializedNotification = {
  id: string
  type: NotificationType
  title: string
  body: string
  read: boolean
  createdAt: string
  relatedListing?: string
  relatedRequest?: string
}

type CreateInAppNotificationInput = {
  userId: string
  type: NotificationType
  title: string
  body: string
  relatedListing?: string
  relatedRequest?: string
}

function serializeNotification(doc: {
  _id: { toString(): string }
  type: NotificationType
  title: string
  body: string
  read: boolean
  createdAt: Date
  relatedListing?: { toString(): string } | null
  relatedRequest?: { toString(): string } | null
}): SerializedNotification {
  return {
    id: doc._id.toString(),
    type: doc.type,
    title: doc.title,
    body: doc.body,
    read: doc.read,
    createdAt: doc.createdAt.toISOString(),
    ...(doc.relatedListing
      ? { relatedListing: doc.relatedListing.toString() }
      : {}),
    ...(doc.relatedRequest
      ? { relatedRequest: doc.relatedRequest.toString() }
      : {}),
  }
}

async function createInAppNotification(
  input: CreateInAppNotificationInput,
): Promise<SerializedNotification> {
  const doc = await Notification.create({
    user: input.userId,
    type: input.type,
    title: input.title,
    body: input.body,
    read: false,
    ...(input.relatedListing ? { relatedListing: input.relatedListing } : {}),
    ...(input.relatedRequest ? { relatedRequest: input.relatedRequest } : {}),
    sentVia: { inApp: true, sms: false },
  })

  const serialized = serializeNotification({
    _id: doc._id,
    type: doc.type,
    title: doc.title,
    body: doc.body,
    read: doc.read,
    createdAt: doc.createdAt,
    relatedListing: doc.relatedListing ?? null,
    relatedRequest: doc.relatedRequest ?? null,
  })

  const unreadCount = await Notification.countDocuments({
    user: input.userId,
    read: false,
  })

  emitNotificationNew(input.userId, {
    notification: serialized,
    unreadCount,
  })

  return serialized
}

async function donorWantsNewRequestNotifications(
  donorId: string,
): Promise<boolean> {
  const donor = await User.findById(donorId).select('notificationPrefs').lean()
  const prefs = normalizeNotificationPrefs(donor?.notificationPrefs)
  return prefs.events[NOTIFICATION_EVENT_KEY.NEW_REQUEST]
}

async function ngoWantsNewListingNotifications(
  notificationPrefs: unknown,
): Promise<boolean> {
  const prefs = normalizeNotificationPrefs(
    notificationPrefs as Parameters<typeof normalizeNotificationPrefs>[0],
  )
  return prefs.ngoEvents?.[NGO_NOTIFICATION_EVENT_KEY.NEW_LISTING_AVAILABLE] ?? false
}

export async function maybeNotifyNgosNewListing(input: {
  listingId: string
  listingTitle: string
  donorId: string
  quantity: number
  quantityUnit: QuantityUnit
}): Promise<void> {
  const donor = await User.findById(input.donorId)
    .select('organisationName verification.status')
    .lean<{
      organisationName?: string | null
      verification?: { status?: string }
    }>()

  if (donor?.verification?.status !== VERIFICATION_STATUS.APPROVED) {
    return
  }

  const donorName = donor.organisationName?.trim() || 'A donor'

  const ngos = await User.find({
    role: ROLES.NGO,
    accountStatus: ACCOUNT_STATUS.ACTIVE,
    'verification.status': VERIFICATION_STATUS.APPROVED,
  })
    .select('_id notificationPrefs')
    .lean()

  await Promise.all(
    ngos.map(async (ngo) => {
      const wantsNewListing = await ngoWantsNewListingNotifications(
        ngo.notificationPrefs,
      )
      if (!wantsNewListing) {
        return
      }

      await createInAppNotification({
        userId: ngo._id.toString(),
        type: NOTIFICATION_TYPE.NEW_LISTING,
        title: NGO_NOTIFICATION_TITLE[NOTIFICATION_TYPE.NEW_LISTING],
        body: formatNgoNotificationBody({
          type: NOTIFICATION_TYPE.NEW_LISTING,
          listingTitle: input.listingTitle,
          donorName,
          quantity: input.quantity,
          quantityUnit: input.quantityUnit,
        }),
        relatedListing: input.listingId,
      })
    }),
  )
}

export async function notifyNgoRequestAccepted(input: {
  ngoId: string
  requestId: string
  listingId: string
  donorName: string
  listingTitle: string
}): Promise<void> {
  await createInAppNotification({
    userId: input.ngoId,
    type: NOTIFICATION_TYPE.REQUEST_ACCEPTED,
    title: NGO_NOTIFICATION_TITLE[NOTIFICATION_TYPE.REQUEST_ACCEPTED],
    body: formatNgoNotificationBody({
      type: NOTIFICATION_TYPE.REQUEST_ACCEPTED,
      listingTitle: input.listingTitle,
      donorName: input.donorName,
    }),
    relatedListing: input.listingId,
    relatedRequest: input.requestId,
  })
}

export async function notifyNgoTransferComplete(input: {
  requestId: string
  listingId: string
}): Promise<void> {
  const request = await FoodRequest.findById(input.requestId)
    .select('ngo listing')
    .lean()

  if (!request) {
    return
  }

  const listing = await Listing.findById(input.listingId)
    .select('donor title quantity quantityUnit')
    .lean()

  if (!listing) {
    return
  }

  const donor = (await User.findById(listing.donor)
    .select('organisationName')
    .lean()) as { organisationName?: string | null } | null

  await createInAppNotification({
    userId: request.ngo.toString(),
    type: NOTIFICATION_TYPE.TRANSFER_COMPLETE,
    title: NGO_NOTIFICATION_TITLE[NOTIFICATION_TYPE.TRANSFER_COMPLETE],
    body: formatNgoNotificationBody({
      type: NOTIFICATION_TYPE.TRANSFER_COMPLETE,
      listingTitle: listing.title,
      donorName: donor?.organisationName?.trim() || 'The donor',
      quantity: listing.quantity,
      quantityUnit: listing.quantityUnit,
    }),
    relatedListing: input.listingId,
    relatedRequest: input.requestId,
  })
}

export async function maybeNotifyDonorRequestReceived(input: {
  donorId: string
  requestId: string
  listingId: string
  ngoName: string
  listingTitle: string
}): Promise<void> {
  const enabled = await donorWantsNewRequestNotifications(input.donorId)
  if (!enabled) {
    return
  }

  await createInAppNotification({
    userId: input.donorId,
    type: NOTIFICATION_TYPE.REQUEST_RECEIVED,
    title: DONOR_NOTIFICATION_TITLE[NOTIFICATION_TYPE.REQUEST_RECEIVED],
    body: formatDonorNotificationBody({
      type: NOTIFICATION_TYPE.REQUEST_RECEIVED,
      ngoName: input.ngoName,
      listingTitle: input.listingTitle,
    }),
    relatedListing: input.listingId,
    relatedRequest: input.requestId,
  })
}

export async function notifyDonorRequestAccepted(input: {
  donorId: string
  requestId: string
  listingId: string
  ngoName: string
  listingTitle: string
}): Promise<void> {
  await createInAppNotification({
    userId: input.donorId,
    type: NOTIFICATION_TYPE.REQUEST_ACCEPTED,
    title: DONOR_NOTIFICATION_TITLE[NOTIFICATION_TYPE.REQUEST_ACCEPTED],
    body: formatDonorNotificationBody({
      type: NOTIFICATION_TYPE.REQUEST_ACCEPTED,
      ngoName: input.ngoName,
      listingTitle: input.listingTitle,
    }),
    relatedListing: input.listingId,
    relatedRequest: input.requestId,
  })
}

export async function notifyDonorTransferComplete(input: {
  requestId: string
  listingId: string
}): Promise<void> {
  const request = await FoodRequest.findById(input.requestId)
    .select('ngo listing')
    .lean()

  if (!request) {
    return
  }

  const [listing, ngo] = await Promise.all([
    Listing.findById(input.listingId)
      .select('donor title quantity quantityUnit')
      .lean(),
    User.findById(request.ngo).select('organisationName').lean() as Promise<{
      organisationName?: string | null
    } | null>,
  ])

  if (!listing) {
    return
  }

  await createInAppNotification({
    userId: listing.donor.toString(),
    type: NOTIFICATION_TYPE.TRANSFER_COMPLETE,
    title: DONOR_NOTIFICATION_TITLE[NOTIFICATION_TYPE.TRANSFER_COMPLETE],
    body: formatDonorNotificationBody({
      type: NOTIFICATION_TYPE.TRANSFER_COMPLETE,
      ngoName: ngo?.organisationName?.trim() || 'The NGO',
      listingTitle: listing.title,
      quantity: listing.quantity,
      quantityUnit: listing.quantityUnit,
    }),
    relatedListing: input.listingId,
    relatedRequest: input.requestId,
  })
}

export async function listNotificationsForUser(input: {
  userId: string
  limit?: number
}): Promise<{
  notifications: SerializedNotification[]
  unreadCount: number
}> {
  const limit = Math.min(
    input.limit ?? NOTIFICATION_LIST.DROPDOWN_LIMIT,
    NOTIFICATION_LIST.MAX_LIMIT,
  )

  const [notifications, unreadCount] = await Promise.all([
    Notification.find({ user: input.userId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean(),
    Notification.countDocuments({ user: input.userId, read: false }),
  ])

  return {
    notifications: notifications.map((doc) =>
      serializeNotification(
        doc as Parameters<typeof serializeNotification>[0],
      ),
    ),
    unreadCount,
  }
}

export async function markAllNotificationsReadForUser(
  userId: string,
): Promise<{ unreadCount: number }> {
  await Notification.updateMany(
    { user: userId, read: false },
    { $set: { read: true } },
  )

  return { unreadCount: 0 }
}

export async function markNotificationReadForUser(input: {
  userId: string
  notificationId: string
}): Promise<{
  notification: SerializedNotification
  unreadCount: number
}> {
  const updated = await Notification.findOneAndUpdate(
    { _id: input.notificationId, user: input.userId },
    { $set: { read: true } },
    { new: true },
  ).lean()

  if (!updated) {
    throw notFound('Notification not found', 'NOTIFICATION_NOT_FOUND')
  }

  const unreadCount = await Notification.countDocuments({
    user: input.userId,
    read: false,
  })

  return {
    notification: serializeNotification(
      updated as Parameters<typeof serializeNotification>[0],
    ),
    unreadCount,
  }
}

/** @deprecated Use listNotificationsForUser */
export async function listNotificationsForDonor(input: {
  donorId: string
  limit?: number
}) {
  return listNotificationsForUser({
    userId: input.donorId,
    limit: input.limit,
  })
}

/** @deprecated Use markAllNotificationsReadForUser */
export async function markAllNotificationsReadForDonor(donorId: string) {
  return markAllNotificationsReadForUser(donorId)
}

/** @deprecated Use markNotificationReadForUser */
export async function markNotificationReadForDonor(input: {
  donorId: string
  notificationId: string
}) {
  return markNotificationReadForUser({
    userId: input.donorId,
    notificationId: input.notificationId,
  })
}
