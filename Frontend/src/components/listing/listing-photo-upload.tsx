import { useEffect, useMemo, useRef } from 'react'
import {
  ACCEPTED_LISTING_PHOTO_ACCEPT,
  ACCEPTED_LISTING_PHOTO_LABEL,
  MAX_LISTING_PHOTO_SIZE_MB,
  validateListingPhotoFile,
} from '../../constants/listing-photo'
import { postListingContent } from '../../placeholder/post-listing-content'
import { toast } from '../../lib/toast'
import { cn } from '../../lib/utils'
import { FileDropzone } from '../ui/file-dropzone'
import { Button } from '../ui/button'

type ListingPhotoUploadProps = {
  value: File | undefined
  onChange: (file: File | undefined) => void
  error?: string
  className?: string
}

export function ListingPhotoUpload({
  value,
  onChange,
  error,
  className,
}: ListingPhotoUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  const previewUrl = useMemo(() => {
    if (!value) return null
    return URL.createObjectURL(value)
  }, [value])

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [previewUrl])

  const showValidationError = (reason: 'type' | 'size') => {
    const message =
      reason === 'type'
        ? postListingContent.validation.photoInvalidType(
            ACCEPTED_LISTING_PHOTO_LABEL,
          )
        : postListingContent.validation.photoTooLarge(MAX_LISTING_PHOTO_SIZE_MB)
    toast.error(message)
  }

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <span className="text-charcoal text-sm font-medium">
        {postListingContent.sections.what.photo}
      </span>

      {previewUrl ? (
        <div className="border-border relative overflow-hidden rounded-xl border bg-white">
          <img
            src={previewUrl}
            alt=""
            className="aspect-[4/3] w-full object-cover"
          />
          <div className="absolute inset-x-0 bottom-0 flex justify-end bg-gradient-to-t from-charcoal/50 to-transparent p-3">
            <Button
              type="button"
              variant="outline"
              size="default"
              className="border-white bg-white/95 text-charcoal hover:bg-white"
              onClick={() => inputRef.current?.click()}
            >
              {postListingContent.photo.replace}
            </Button>
          </div>
          <input
            ref={inputRef}
            type="file"
            accept={ACCEPTED_LISTING_PHOTO_ACCEPT}
            className="sr-only"
            onChange={(event) => {
              const file = event.target.files?.[0]
              event.target.value = ''
              if (!file) return
              const validationError = validateListingPhotoFile(file)
              if (validationError) {
                showValidationError(validationError)
                return
              }
              onChange(file)
            }}
          />
        </div>
      ) : (
        <FileDropzone
          inputRef={inputRef}
          onFileAccepted={onChange}
          accept={ACCEPTED_LISTING_PHOTO_ACCEPT}
          validateFile={validateListingPhotoFile}
          onValidationError={showValidationError}
          promptText={postListingContent.photo.dropzonePrompt}
          hintText={postListingContent.photo.dropzoneHint(
            ACCEPTED_LISTING_PHOTO_LABEL,
            MAX_LISTING_PHOTO_SIZE_MB,
          )}
          ariaLabel={postListingContent.photo.ariaLabel}
        />
      )}

      {error ? <p className="text-clay-red text-sm">{error}</p> : null}
    </div>
  )
}
