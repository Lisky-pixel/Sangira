import {
  DAILY_CAPACITY_DEFAULT,
  DEFAULT_PICKUP_HOURS,
} from '../constants/ngo-capacity.js'
import {
  TRANSPORT_MODE,
  TRANSPORT_MODE_VALUES,
  type TransportMode,
} from '../constants/transport-mode.js'

export type NgoTransportSettings = {
  hasOwnTransport: boolean
  mode?: TransportMode
}

export type NgoPickupHours = {
  from: string
  to: string
}

export type ResolvedNgoCapacity = {
  dailyCapacity: number
  transport: NgoTransportSettings
  pickupHours: NgoPickupHours
  paused: boolean
}

type NgoCapacitySource = {
  dailyCapacity?: number | null
  transportAvailable?: boolean | null
  transport?: {
    hasOwnTransport?: boolean | null
    mode?: string | null
  } | null
  pickupHours?: {
    from?: string | null
    to?: string | null
  } | null
  paused?: boolean | null
}

function resolveTransportMode(value: unknown): TransportMode | undefined {
  return typeof value === 'string' &&
    TRANSPORT_MODE_VALUES.includes(value as TransportMode)
    ? (value as TransportMode)
    : undefined
}

function resolvePickupTime(value: unknown, fallback: string): string {
  return typeof value === 'string' && value.trim() ? value.trim() : fallback
}

export function resolveNgoCapacityFromSource(
  source: NgoCapacitySource,
): ResolvedNgoCapacity {
  const hasOwnTransport =
    typeof source.transport?.hasOwnTransport === 'boolean'
      ? source.transport.hasOwnTransport
      : Boolean(source.transportAvailable)

  const mode = resolveTransportMode(source.transport?.mode)

  const dailyCapacity =
    typeof source.dailyCapacity === 'number' &&
    Number.isFinite(source.dailyCapacity)
      ? source.dailyCapacity
      : DAILY_CAPACITY_DEFAULT

  return {
    dailyCapacity,
    transport: {
      hasOwnTransport,
      ...(hasOwnTransport && mode ? { mode } : {}),
      ...(hasOwnTransport && !mode ? { mode: TRANSPORT_MODE.VAN } : {}),
    },
    pickupHours: {
      from: resolvePickupTime(
        source.pickupHours?.from,
        DEFAULT_PICKUP_HOURS.FROM,
      ),
      to: resolvePickupTime(source.pickupHours?.to, DEFAULT_PICKUP_HOURS.TO),
    },
    paused: Boolean(source.paused),
  }
}
