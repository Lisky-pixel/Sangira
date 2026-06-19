/** Env keys for `npm run seed:admin` — set in backend/.env (never commit real passwords). */
export const ADMIN_SEED_ENV = {
  EMAIL: 'ADMIN_SEED_EMAIL',
  PASSWORD: 'ADMIN_SEED_PASSWORD',
  NAME: 'ADMIN_SEED_NAME',
} as const

export const ADMIN_SEED_DEFAULT_NAME = 'Administrator'
