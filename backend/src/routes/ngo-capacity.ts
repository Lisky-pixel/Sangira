import { Router } from 'express'
import * as ngoCapacityController from '../controllers/ngo-capacity-controller.js'
import { csrfGuard } from '../middleware/csrf.js'
import {
  ngoParticipantReadGuards,
  ngoParticipantWriteGuards,
} from '../middleware/participant-guards.js'
import { validateBody } from '../middleware/validate.js'
import { updateNgoCapacitySchema } from '../validators/ngo-capacity.js'

export const ngoCapacityRouter = Router()

ngoCapacityRouter.get(
  '/capacity',
  ...ngoParticipantReadGuards,
  ngoCapacityController.getNgoCapacity,
)

ngoCapacityRouter.put(
  '/capacity',
  csrfGuard,
  ...ngoParticipantWriteGuards,
  validateBody(updateNgoCapacitySchema),
  ngoCapacityController.putNgoCapacity,
)
