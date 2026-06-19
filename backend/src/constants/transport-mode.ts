export const TRANSPORT_MODE = {
  VAN: 'van',
  MOTORBIKE: 'motorbike',
  ON_FOOT: 'on_foot',
} as const

export type TransportMode = (typeof TRANSPORT_MODE)[keyof typeof TRANSPORT_MODE]

export const TRANSPORT_MODE_VALUES = Object.values(TRANSPORT_MODE)
