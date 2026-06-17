import type { Role } from '../constants/enums.js'

declare global {
  namespace Express {
    interface Request {
      auth?: {
        userId: string
        role: Role
      }
      validatedQuery?: unknown
      validatedParams?: unknown
    }
  }
}

export {}
