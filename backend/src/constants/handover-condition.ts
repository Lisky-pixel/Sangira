export const HANDOVER_CONDITION = {
  AS_DESCRIBED: 'as_described',
  PARTIAL: 'partial',
  ISSUE: 'issue',
} as const

export type HandoverCondition =
  (typeof HANDOVER_CONDITION)[keyof typeof HANDOVER_CONDITION]

export const HANDOVER_CONDITION_VALUES = Object.values(HANDOVER_CONDITION) as [
  HandoverCondition,
  ...HandoverCondition[],
]

export const HANDOVER_CONDITION_NOTE = {
  MAX_LENGTH: 500,
} as const
