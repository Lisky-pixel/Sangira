import { Ngo } from '../models/user.js'
import { notFound } from '../utils/app-error.js'
import {
  resolveNgoCapacityFromSource,
  type ResolvedNgoCapacity,
} from '../utils/resolve-ngo-capacity.js'
import type { UpdateNgoCapacityInput } from '../validators/ngo-capacity.js'

const NGO_CAPACITY_SELECT =
  'dailyCapacity transportAvailable transport pickupHours paused'

export async function getNgoCapacity(ngoId: string): Promise<ResolvedNgoCapacity> {
  const ngo = await Ngo.findById(ngoId).select(NGO_CAPACITY_SELECT).lean()

  if (!ngo) {
    throw notFound('NGO not found', 'NGO_NOT_FOUND')
  }

  return resolveNgoCapacityFromSource(ngo)
}

export async function updateNgoCapacity(
  ngoId: string,
  input: UpdateNgoCapacityInput,
): Promise<ResolvedNgoCapacity> {
  const ngo = await Ngo.findById(ngoId)

  if (!ngo) {
    throw notFound('NGO not found', 'NGO_NOT_FOUND')
  }

  ngo.dailyCapacity = input.dailyCapacity
  ngo.transportAvailable = input.transport.hasOwnTransport
  ngo.transport = {
    hasOwnTransport: input.transport.hasOwnTransport,
    ...(input.transport.hasOwnTransport && input.transport.mode
      ? { mode: input.transport.mode }
      : {}),
  }
  ngo.pickupHours = {
    from: input.pickupHours.from,
    to: input.pickupHours.to,
  }
  ngo.paused = input.paused

  await ngo.save()

  return resolveNgoCapacityFromSource(ngo.toObject())
}
