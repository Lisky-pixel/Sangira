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

const JSON_BODY_LIMIT = '1mb'

export function createApp() {
  const app = express()

  app.use(helmet())

  app.use(
    cors({
      origin: config.CLIENT_URL,
      credentials: true,
    }),
  )

  app.use(cookieParser())
  app.use(express.json({ limit: JSON_BODY_LIMIT }))
  app.use(express.urlencoded({ extended: true, limit: JSON_BODY_LIMIT }))
  app.use(mongoSanitizeMiddleware)

  app.use(healthRouter)
  app.use(globalRateLimiter)

  app.use('/auth', authRouter)
  app.use('/listings', listingsRouter)
  app.use('/requests', requestsRouter)
  app.use('/verification', verificationRouter)
  if (config.NODE_ENV !== 'production') {
    app.use('/dev/notifications', devNotificationsRouter)
  }

  app.use(notFoundHandler)
  app.use(errorHandler)

  return app
}
