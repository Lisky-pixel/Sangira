import { Router } from 'express'
import * as listingController from '../controllers/listing-controller.js'
import { csrfGuard } from '../middleware/csrf.js'
import {
  donorParticipantReadGuards,
  donorParticipantWriteGuards,
  ngoParticipantReadGuards,
} from '../middleware/participant-guards.js'
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

listingsRouter.get(
  '/mine',
  ...donorParticipantReadGuards,
  validateQuery(listMineListingsQuerySchema),
  listingController.listMine,
)

listingsRouter.get(
  '/browse',
  ...ngoParticipantReadGuards,
  listingController.browse,
)

listingsRouter.get(
  '/browse/:id',
  ...ngoParticipantReadGuards,
  validateParams(listingIdParamSchema),
  listingController.browseById,
)

listingsRouter.post(
  '/',
  csrfGuard,
  ...donorParticipantWriteGuards,
  uploadListingPhotoMiddleware,
  requireListingPhoto,
  validateBody(createListingSchema),
  listingController.createListing,
)

listingsRouter.get(
  '/:id/requests',
  ...donorParticipantReadGuards,
  validateParams(listingIdParamSchema),
  listingController.listListingRequests,
)

listingsRouter.get(
  '/:id',
  ...donorParticipantReadGuards,
  validateParams(listingIdParamSchema),
  listingController.getById,
)

listingsRouter.patch(
  '/:id',
  csrfGuard,
  ...donorParticipantWriteGuards,
  validateParams(listingIdParamSchema),
  uploadListingPhotoMiddleware,
  validateOptionalListingPhoto,
  validateBody(updateListingSchema),
  listingController.updateListing,
)

listingsRouter.post(
  '/:id/cancel',
  csrfGuard,
  ...donorParticipantWriteGuards,
  validateParams(listingIdParamSchema),
  listingController.cancelListing,
)
