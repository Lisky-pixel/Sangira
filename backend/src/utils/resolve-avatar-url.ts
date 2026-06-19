type AvatarFields = {
  avatarUrl?: string | null
  /** @deprecated Legacy field — fallback when avatarUrl is empty */
  profileImageUrl?: string | null
}

function trimNonEmpty(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim() ? value.trim() : undefined
}

/** Canonical avatarUrl with legacy profileImageUrl fallback (same logic as /auth/me). */
export function resolveAvatarUrl(fields: AvatarFields): string | undefined {
  return trimNonEmpty(fields.avatarUrl) ?? trimNonEmpty(fields.profileImageUrl)
}
