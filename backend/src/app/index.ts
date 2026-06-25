import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import { config } from '../config/env.js'
import { errorHandler } from './middleware/error-handler.js'
import { mongoSanitizeMiddleware } from './middleware/mongo-sanitize.js'
import { notFoundHandler } from './middleware/not-found.js'
import { globalRateLimiter } from './middleware/rate-limit.js'
import { healthRouter } from './routes/health.js'
import { authRouter } from '../routes/auth.js'
import { listingsRouter } from '../routes/listings.js'
import { requestsRouter } from '../routes/requests.js'
import { verificationRouter } from '../routes/verification.js'
import { devNotificationsRouter } from '../routes/dev-notifications.js'
import { dashboardRouter, impactRouter } from '../routes/donor-portal.js'
import { ngoCapacityRouter } from '../routes/ngo-capacity.js'
import { ngoDashboardRouter, ngoImpactRouter } from '../routes/ngo-portal.js'
import { adminPortalRouter } from '../routes/admin-portal.js'
import { notificationsRouter } from '../routes/notifications.js'
import { transfersRouter } from '../routes/transfers.js'
import { publicRouter } from '../routes/public.js'

const JSON_BODY_LIMIT = '1mb'

function parseClientOrigins() {
  const origins = config.CLIENT_URL.split(',')
    .map((origin) => origin.trim())
    .filter(Boolean)

  return origins.length === 1 ? origins[0] : origins
}

export function createApp() {
  const app = express()

  if (config.NODE_ENV === 'production') {
    app.set('trust proxy', 1)
  }

  app.use(helmet())

  app.use(
    cors({
      origin: parseClientOrigins(),
      credentials: true,
    }),
  )

  app.use(cookieParser())
  app.use(express.json({ limit: JSON_BODY_LIMIT }))
  app.use(express.urlencoded({ extended: true, limit: JSON_BODY_LIMIT }))
  app.use(mongoSanitizeMiddleware)

  app.use(healthRouter)
  app.use(globalRateLimiter)

  app.use('/public', publicRouter)
  app.use('/auth', authRouter)
  app.use('/listings', listingsRouter)
  app.use('/requests', requestsRouter)
  app.use('/verification', verificationRouter)
  app.use('/impact', impactRouter)
  app.use('/impact', ngoImpactRouter)
  app.use('/dashboard', dashboardRouter)
  app.use('/dashboard', ngoDashboardRouter)
  app.use('/ngo', ngoCapacityRouter)
  app.use('/admin', adminPortalRouter)
  app.use('/notifications', notificationsRouter)
  app.use('/transfers', transfersRouter)
  if (config.NODE_ENV !== 'production') {
    app.use('/dev/notifications', devNotificationsRouter)
  }

  app.use(notFoundHandler)
  app.use(errorHandler)

  return app
}
