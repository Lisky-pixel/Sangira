import { Router } from 'express'
import * as listingController from '../controllers/listing-controller.js'
import { ROLES } from '../constants/enums.js'
import { csrfGuard } from '../middleware/csrf.js'
import { requireAuth } from '../middleware/require-auth.js'
import { requireRole } from '../middleware/require-role.js'
import { requireVerified } from '../middleware/require-verified.js'
import {
  requireListingPhoto,
  uploadListingPhotoMiddleware,
} from '../middleware/upload.js'
import { validateBody, validateQuery } from '../middleware/validate.js'
import {
  createListingSchema,
  listMineListingsQuerySchema,
} from '../validators/listing.js'

export const listingsRouter = Router()

listingsRouter.get(
  '/mine',
  requireAuth,
  requireRole(ROLES.DONOR),
  validateQuery(listMineListingsQuerySchema),
  listingController.listMine,
)

listingsRouter.post(
  '/',
  csrfGuard,
  requireAuth,
  requireVerified,
  requireRole(ROLES.DONOR),
  uploadListingPhotoMiddleware,
  requireListingPhoto,
  validateBody(createListingSchema),
  listingController.createListing,
)
