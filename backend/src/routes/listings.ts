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
  validateOptionalListingPhoto,
} from '../middleware/upload.js'
import { validateBody, validateParams, validateQuery } from '../middleware/validate.js'
import {
  createListingSchema,
  listMineListingsQuerySchema,
  listingIdParamSchema,
  updateListingSchema,
} from '../validators/listing.js'

export const listingsRouter = Router()

const donorListingGuards = [
  requireAuth,
  requireVerified,
  requireRole(ROLES.DONOR),
] as const

listingsRouter.get(
  '/mine',
  requireAuth,
  requireRole(ROLES.DONOR),
  validateQuery(listMineListingsQuerySchema),
  listingController.listMine,
)

const ngoBrowseGuards = [
  requireAuth,
  requireVerified,
  requireRole(ROLES.NGO),
] as const

listingsRouter.get(
  '/browse',
  ...ngoBrowseGuards,
  listingController.browse,
)

listingsRouter.get(
  '/browse/:id',
  ...ngoBrowseGuards,
  validateParams(listingIdParamSchema),
  listingController.browseById,
)

listingsRouter.post(
  '/',
  csrfGuard,
  ...donorListingGuards,
  uploadListingPhotoMiddleware,
  requireListingPhoto,
  validateBody(createListingSchema),
  listingController.createListing,
)

listingsRouter.get(
  '/:id',
  ...donorListingGuards,
  validateParams(listingIdParamSchema),
  listingController.getById,
)

listingsRouter.patch(
  '/:id',
  csrfGuard,
  ...donorListingGuards,
  validateParams(listingIdParamSchema),
  uploadListingPhotoMiddleware,
  validateOptionalListingPhoto,
  validateBody(updateListingSchema),
  listingController.updateListing,
)

listingsRouter.post(
  '/:id/cancel',
  csrfGuard,
  ...donorListingGuards,
  validateParams(listingIdParamSchema),
  listingController.cancelListing,
)
