import type { NextFunction, Request, Response } from 'express'
import { notFound } from '../../utils/app-error.js'

export function notFoundHandler(
  _req: Request,
  _res: Response,
  next: NextFunction,
) {
  next(notFound('Route not found', 'ROUTE_NOT_FOUND'))
}
