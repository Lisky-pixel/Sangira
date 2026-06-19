import type { TransportMode } from '../constants/transport-mode'

export type NgoTransportSettings = {
  hasOwnTransport: boolean
  mode?: TransportMode
}

export type NgoPickupHours = {
  from: string
  to: string
}

export type NgoCapacitySettings = {
  dailyCapacity: number
  transport: NgoTransportSettings
  pickupHours: NgoPickupHours
  paused: boolean
}

export type GetNgoCapacityResult = {
  capacity: NgoCapacitySettings
}

export type UpdateNgoCapacityResult = {
  capacity: NgoCapacitySettings
}
