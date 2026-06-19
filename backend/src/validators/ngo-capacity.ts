import { z } from 'zod'
import {
  DAILY_CAPACITY_MAX,
  DAILY_CAPACITY_MIN,
  PICKUP_TIME_PATTERN,
} from '../constants/ngo-capacity.js'
import { TRANSPORT_MODE_VALUES } from '../constants/transport-mode.js'

function pickupMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number)
  return hours * 60 + minutes
}

const pickupTimeSchema = z
  .string()
  .trim()
  .regex(PICKUP_TIME_PATTERN, 'Time must be in HH:mm format')

const transportSchema = z
  .object({
    hasOwnTransport: z.boolean(),
    mode: z.enum(TRANSPORT_MODE_VALUES).optional(),
  })
  .superRefine((value, ctx) => {
    if (value.hasOwnTransport && !value.mode) {
      ctx.addIssue({
        code: 'custom',
        message: 'Transport mode is required when own transport is enabled',
        path: ['mode'],
      })
    }

    if (!value.hasOwnTransport && value.mode) {
      ctx.addIssue({
        code: 'custom',
        message: 'Transport mode must be omitted when own transport is disabled',
        path: ['mode'],
      })
    }
  })

export const updateNgoCapacitySchema = z
  .object({
    dailyCapacity: z
      .number()
      .min(DAILY_CAPACITY_MIN, 'Daily capacity must be zero or greater')
      .max(DAILY_CAPACITY_MAX, 'Daily capacity exceeds the allowed maximum'),
    transport: transportSchema,
    pickupHours: z
      .object({
        from: pickupTimeSchema,
        to: pickupTimeSchema,
      })
      .superRefine((value, ctx) => {
        if (pickupMinutes(value.from) >= pickupMinutes(value.to)) {
          ctx.addIssue({
            code: 'custom',
            message: 'Pickup start time must be before end time',
            path: ['to'],
          })
        }
      }),
    paused: z.boolean(),
  })
  .strict()

export type UpdateNgoCapacityInput = z.infer<typeof updateNgoCapacitySchema>
