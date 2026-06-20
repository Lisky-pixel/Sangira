import { ROLES } from '../constants/enums.js'
import { requireAuth } from './require-auth.js'
import { requireRole } from './require-role.js'
import { requireVerifiedActive } from './require-verified-active.js'

export const donorParticipantReadGuards = [
  requireAuth,
  requireRole(ROLES.DONOR),
] as const

export const donorParticipantWriteGuards = [
  requireAuth,
  requireVerifiedActive,
  requireRole(ROLES.DONOR),
] as const

export const ngoParticipantReadGuards = [
  requireAuth,
  requireRole(ROLES.NGO),
] as const

export const ngoParticipantWriteGuards = [
  requireAuth,
  requireVerifiedActive,
  requireRole(ROLES.NGO),
] as const

/** Donor + NGO in-app notification reads (user-scoped) */
export const participantNotificationReadGuards = [
  requireAuth,
  requireRole(ROLES.DONOR, ROLES.NGO),
] as const

export const handoverParticipantReadGuards = [
  requireAuth,
  requireRole(ROLES.DONOR, ROLES.NGO),
] as const

export const handoverParticipantWriteGuards = [
  requireAuth,
  requireVerifiedActive,
  requireRole(ROLES.DONOR, ROLES.NGO),
] as const
