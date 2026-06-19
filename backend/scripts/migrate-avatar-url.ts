/**
 * One-off migration: copy legacy profileImageUrl → canonical avatarUrl.
 * Idempotent — only updates docs where avatarUrl is empty and profileImageUrl is non-empty.
 *
 * Run: npm run migrate:avatar-url
 */
import mongoose from 'mongoose'
import { config } from '../src/config/env.js'
import { User } from '../src/models/user.js'
import { resolveAvatarUrl } from '../src/utils/resolve-avatar-url.js'

type LegacyUserDoc = {
  _id: mongoose.Types.ObjectId
  avatarUrl?: string | null
  profileImageUrl?: string | null
}

async function migrateAvatarUrl(): Promise<void> {
  await mongoose.connect(config.MONGODB_URI)

  const candidates = await User.find({
    profileImageUrl: { $exists: true, $nin: [null, ''] },
    $or: [
      { avatarUrl: { $exists: false } },
      { avatarUrl: null },
      { avatarUrl: '' },
    ],
  })
    .select('avatarUrl profileImageUrl')
    .lean<LegacyUserDoc[]>()

  let updated = 0
  let skipped = 0

  for (const doc of candidates) {
    const legacyUrl = resolveAvatarUrl({ profileImageUrl: doc.profileImageUrl })
    const existingUrl = resolveAvatarUrl({ avatarUrl: doc.avatarUrl })

    if (!legacyUrl) {
      skipped += 1
      continue
    }

    if (existingUrl) {
      skipped += 1
      continue
    }

    const result = await User.updateOne(
      {
        _id: doc._id,
        $or: [
          { avatarUrl: { $exists: false } },
          { avatarUrl: null },
          { avatarUrl: '' },
        ],
      },
      { $set: { avatarUrl: legacyUrl } },
    )

    if (result.modifiedCount > 0) {
      updated += 1
    }
  }

  console.log(
    `Avatar migration complete: ${updated} document(s) updated, ${skipped} skipped (already canonical or empty legacy).`,
  )

  await mongoose.disconnect()
}

migrateAvatarUrl().catch((error: unknown) => {
  console.error('Avatar migration failed:', error)
  void mongoose.disconnect()
  process.exit(1)
})
