import { Router } from 'express'
import * as ngoCapacityController from '../controllers/ngo-capacity-controller.js'
import { ROLES } from '../constants/enums.js'
import { csrfGuard } from '../middleware/csrf.js'
import { requireAuth } from '../middleware/require-auth.js'
import { requireRole } from '../middleware/require-role.js'
import { requireVerified } from '../middleware/require-verified.js'
import { validateBody } from '../middleware/validate.js'
import { updateNgoCapacitySchema } from '../validators/ngo-capacity.js'

export const ngoCapacityRouter = Router()

const ngoCapacityGuards = [
  requireAuth,
  requireVerified,
  requireRole(ROLES.NGO),
] as const

ngoCapacityRouter.get(
  '/capacity',
  ...ngoCapacityGuards,
  ngoCapacityController.getNgoCapacity,
)

ngoCapacityRouter.put(
  '/capacity',
  csrfGuard,
  ...ngoCapacityGuards,
  validateBody(updateNgoCapacitySchema),
  ngoCapacityController.putNgoCapacity,
)
