import { z } from 'zod'
import {
  DAILY_CAPACITY_MAX,
  DAILY_CAPACITY_MIN,
  PICKUP_TIME_PATTERN,
} from '../../constants/ngo-capacity'
import { TRANSPORT_MODE_VALUES } from '../../constants/transport-mode'
import { ngoCapacityContent } from '../../placeholder/ngo-capacity-content'

function pickupMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number)
  return hours * 60 + minutes
}

const pickupTimeSchema = z
  .string()
  .trim()
  .regex(PICKUP_TIME_PATTERN, ngoCapacityContent.validation.pickupTimeFormat)

export const ngoCapacityFormSchema = z
  .object({
    dailyCapacity: z
      .number()
      .min(DAILY_CAPACITY_MIN, ngoCapacityContent.validation.dailyCapacityMin)
      .max(DAILY_CAPACITY_MAX, ngoCapacityContent.validation.dailyCapacityMax),
    transport: z
      .object({
        hasOwnTransport: z.boolean(),
        mode: z.enum(TRANSPORT_MODE_VALUES).optional(),
      })
      .superRefine((value, ctx) => {
        if (value.hasOwnTransport && !value.mode) {
          ctx.addIssue({
            code: 'custom',
            message: ngoCapacityContent.validation.transportModeRequired,
            path: ['mode'],
          })
        }
      }),
    pickupHours: z
      .object({
        from: pickupTimeSchema,
        to: pickupTimeSchema,
      })
      .superRefine((value, ctx) => {
        if (pickupMinutes(value.from) >= pickupMinutes(value.to)) {
          ctx.addIssue({
            code: 'custom',
            message: ngoCapacityContent.validation.pickupRange,
            path: ['to'],
          })
        }
      }),
    paused: z.boolean(),
  })
  .strict()

export type NgoCapacityFormValues = z.infer<typeof ngoCapacityFormSchema>
