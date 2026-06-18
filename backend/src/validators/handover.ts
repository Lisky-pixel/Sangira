import { z } from 'zod'
import { HANDOVER } from '../constants/handover.js'

export const confirmReceiptSchema = z.object({
  pin: z
    .string()
    .trim()
    .length(
      HANDOVER.PICKUP_PIN_LENGTH,
      `PIN must be ${HANDOVER.PICKUP_PIN_LENGTH} digits`,
    )
    .regex(/^\d+$/, 'PIN must contain only digits'),
})

export type ConfirmReceiptInput = z.infer<typeof confirmReceiptSchema>
