import { Notification } from '../models/notification.js'
import { User } from '../models/user.js'
import { Listing } from '../models/listing.js'
import { Request as FoodRequest } from '../models/request.js'
import { NOTIFICATION_TYPE } from '../constants/enums.js'
import { NOTIFICATION_EVENT_KEY } from '../constants/notification-preferences.js'
import {
  DONOR_NOTIFICATION_TITLE,
  formatDonorNotificationBody,
  NOTIFICATION_LIST,
} from '../constants/notifications.js'
import { normalizeNotificationPrefs } from '../utils/normalize-notification-prefs.js'
import { notFound } from '../utils/app-error.js'
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
): Promise<void> {
  await Notification.create({
    user: input.userId,
    type: input.type,
    title: input.title,
    body: input.body,
    read: false,
    ...(input.relatedListing ? { relatedListing: input.relatedListing } : {}),
    ...(input.relatedRequest ? { relatedRequest: input.relatedRequest } : {}),
    sentVia: { inApp: true, sms: false },
  })
}

async function donorWantsNewRequestNotifications(
  donorId: string,
): Promise<boolean> {
  const donor = await User.findById(donorId).select('notificationPrefs').lean()
  const prefs = normalizeNotificationPrefs(donor?.notificationPrefs)
  return prefs.events[NOTIFICATION_EVENT_KEY.NEW_REQUEST]
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

export async function listNotificationsForDonor(input: {
  donorId: string
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
    Notification.find({ user: input.donorId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean(),
    Notification.countDocuments({ user: input.donorId, read: false }),
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

export async function markAllNotificationsReadForDonor(
  donorId: string,
): Promise<{ unreadCount: number }> {
  await Notification.updateMany(
    { user: donorId, read: false },
    { $set: { read: true } },
  )

  return { unreadCount: 0 }
}

export async function markNotificationReadForDonor(input: {
  donorId: string
  notificationId: string
}): Promise<SerializedNotification> {
  const updated = await Notification.findOneAndUpdate(
    { _id: input.notificationId, user: input.donorId },
    { $set: { read: true } },
    { new: true },
  ).lean()

  if (!updated) {
    throw notFound('Notification not found', 'NOTIFICATION_NOT_FOUND')
  }

  return serializeNotification(
    updated as Parameters<typeof serializeNotification>[0],
  )
}
