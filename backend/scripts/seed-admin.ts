/**
 * Idempotent admin seed — creates one admin account when missing.
 *
 * Required env (backend/.env):
 *   ADMIN_SEED_EMAIL=you@sangira.rw
 *   ADMIN_SEED_PASSWORD=<strong-password>
 *
 * Optional:
 *   ADMIN_SEED_NAME=Aline K.
 *
 * Run: npm run seed:admin
 */
import bcrypt from 'bcryptjs'
import mongoose from 'mongoose'
import { config } from '../src/config/env.js'
import {
  ADMIN_SEED_DEFAULT_NAME,
  ADMIN_SEED_ENV,
} from '../src/constants/admin-seed.js'
import { ACCOUNT_STATUS, ROLES } from '../src/constants/enums.js'
import { Admin } from '../src/models/user.js'

function readSeedConfig() {
  const email = process.env[ADMIN_SEED_ENV.EMAIL]?.trim().toLowerCase()
  const password = process.env[ADMIN_SEED_ENV.PASSWORD]
  const name =
    process.env[ADMIN_SEED_ENV.NAME]?.trim() || ADMIN_SEED_DEFAULT_NAME

  if (!email) {
    throw new Error(
      `${ADMIN_SEED_ENV.EMAIL} is required. Set it in backend/.env before running seed:admin.`,
    )
  }

  if (!password || password.length < 8) {
    throw new Error(
      `${ADMIN_SEED_ENV.PASSWORD} is required (min 8 characters). Set it in backend/.env — do not commit the value.`,
    )
  }

  return { email, password, name }
}

async function seedAdmin(): Promise<void> {
  const { email, password, name } = readSeedConfig()

  await mongoose.connect(config.MONGODB_URI)

  const existing = await Admin.findOne({ email }).lean()

  if (existing) {
    console.log(
      `Admin seed skipped: account already exists for ${existing.email}`,
    )
    await mongoose.disconnect()
    return
  }

  const passwordHash = await bcrypt.hash(password, config.BCRYPT_SALT_ROUNDS)

  const admin = await Admin.create({
    email,
    passwordHash,
    role: ROLES.ADMIN,
    name,
    accountStatus: ACCOUNT_STATUS.ACTIVE,
  })

  console.log(`Admin seed complete: created ${admin.email} (${admin.name})`)

  await mongoose.disconnect()
}

seedAdmin().catch((error: unknown) => {
  console.error('Admin seed failed:', error)
  void mongoose.disconnect()
  process.exit(1)
})
