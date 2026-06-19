import { z } from 'zod'
import { HANDOVER } from '../constants/handover.js'
import {
  HANDOVER_CONDITION_NOTE,
  HANDOVER_CONDITION_VALUES,
} from '../constants/handover-condition.js'

export const confirmReceiptSchema = z.object({
  pin: z
    .string()
    .trim()
    .length(
      HANDOVER.PICKUP_PIN_LENGTH,
      `PIN must be ${HANDOVER.PICKUP_PIN_LENGTH} digits`,
    )
    .regex(/^\d+$/, 'PIN must contain only digits'),
  condition: z.enum(HANDOVER_CONDITION_VALUES, {
    error: 'Condition is required',
  }),
  note: z
    .string()
    .trim()
    .max(
      HANDOVER_CONDITION_NOTE.MAX_LENGTH,
      `Note must be at most ${HANDOVER_CONDITION_NOTE.MAX_LENGTH} characters`,
    )
    .optional()
    .transform((value) => (value && value.length > 0 ? value : undefined)),
})

export type ConfirmReceiptInput = z.infer<typeof confirmReceiptSchema>
