import { Router } from 'express'
import { getPublicStatsHandler } from '../controllers/public-stats-controller.js'

export const publicRouter = Router()

publicRouter.get('/stats', getPublicStatsHandler)
