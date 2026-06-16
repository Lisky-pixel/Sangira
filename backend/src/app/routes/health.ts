import { Router } from 'express'
import { sendSuccess } from '../../utils/response.js'

export const healthRouter = Router()

healthRouter.get('/health', (_req, res) => {
  return sendSuccess(res, { status: 'ok' })
})
