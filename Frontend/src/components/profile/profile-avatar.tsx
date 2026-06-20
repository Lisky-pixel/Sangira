import { Camera } from 'lucide-react'
import { useRef, type ChangeEvent } from 'react'
import {
  ACCEPTED_AVATAR_PHOTO_ACCEPT,
  MAX_AVATAR_PHOTO_SIZE_MB,
} from '../../constants/avatar-photo'
import { getOrganisationInitials } from '../../lib/profile-format'
import { toast } from '../../lib/toast'
import { cn } from '../../lib/utils'
import { donorProfileContent } from '../../placeholder/donor-profile-content'
import { profileService } from '../../services/profile-service'

type ProfileAvatarProps = {
  organisationName: string
  avatarUrl?: string
  onAvatarUpdated: () => Promise<void>
  className?: string
  readOnly?: boolean
}

function validateAvatarFile(file: File): 'type' | 'size' | null {
  if (!ACCEPTED_AVATAR_PHOTO_ACCEPT.split(',').includes(file.type)) {
    return 'type'
  }
  if (file.size > MAX_AVATAR_PHOTO_SIZE_MB * 1024 * 1024) {
    return 'size'
  }
  return null
}

export function ProfileAvatar({
  organisationName,
  avatarUrl,
  onAvatarUpdated,
  className,
  readOnly = false,
}: ProfileAvatarProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const initials = getOrganisationInitials(organisationName)

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    if (readOnly) return
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return

    const validationError = validateAvatarFile(file)
    if (validationError === 'type') {
      toast.error(donorProfileContent.toast.avatarError)
      return
    }
    if (validationError === 'size') {
      toast.error(donorProfileContent.toast.avatarError)
      return
    }

    try {
      await toast.promise(profileService.uploadAvatar(file), {
        loading: donorProfileContent.toast.avatarUploading,
        success: donorProfileContent.toast.avatarSuccess,
        error: donorProfileContent.toast.avatarError,
      })
      await onAvatarUpdated()
    } catch {
      // toast.promise surfaces the error
    }
  }

  return (
    <div className={cn('flex flex-col items-center gap-3', className)}>
      <div className="relative">
        <div className="bg-primary flex size-24 items-center justify-center overflow-hidden rounded-full sm:size-28">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt=""
              className="size-full object-cover"
            />
          ) : (
            <span className="font-display text-2xl font-bold text-white sm:text-3xl">
              {initials}
            </span>
          )}
        </div>
        <span className="bg-primary absolute right-0 bottom-0 flex size-8 items-center justify-center rounded-full border-2 border-white text-white shadow-sm">
          <Camera aria-hidden="true" className="size-4" />
        </span>
      </div>

      {!readOnly ? (
        <>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="text-primary text-sm font-medium hover:underline"
          >
            {donorProfileContent.avatar.editPhoto}
          </button>

          <input
            ref={inputRef}
            type="file"
            accept={ACCEPTED_AVATAR_PHOTO_ACCEPT}
            className="sr-only"
            aria-label={donorProfileContent.avatar.uploadAria}
            onChange={(event) => void handleFileChange(event)}
          />
        </>
      ) : null}
    </div>
  )
}
