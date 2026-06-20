export type AdminProfile = {
  id: string
  name: string
  email: string
  phone?: string
  avatarUrl?: string
  createdAt: string
  passwordChangedAt?: string
}

export type AdminReviewerActivity = {
  verificationsReviewed: number
  approved: number
  rejected: number
}

export type AdminMeData = {
  profile: AdminProfile
  activity: AdminReviewerActivity
}

import type { AdminNotificationEventPreferences } from '../constants/admin-notification-preferences'

export type AdminSettingsData = {
  adminNotificationPrefs: AdminNotificationEventPreferences
  verificationSlaTargetHours: number
}
