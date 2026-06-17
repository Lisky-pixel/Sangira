import { Camera, FileUp } from 'lucide-react'
import { useId, useRef, useState, type RefObject } from 'react'
import {
  ACCEPTED_DOCUMENT_ACCEPT,
  ACCEPTED_DOCUMENT_LABEL,
  MAX_DOCUMENT_SIZE_MB,
  validateDocumentFile,
} from '../../constants/documents'
import { registerStep3Content } from '../../placeholder/register-content'
import { toast } from '../../lib/toast'
import { cn } from '../../lib/utils'

type FileDropzoneProps = {
  onFileAccepted: (file: File) => void
  inputRef?: RefObject<HTMLInputElement | null>
  className?: string
  promptText?: string
  hintText?: string
  accept?: string
  validateFile?: (file: File) => 'type' | 'size' | null
  onValidationError?: (reason: 'type' | 'size') => void
  ariaLabel?: string
}

function showDocumentValidationError(reason: 'type' | 'size') {
  const message =
    reason === 'type'
      ? registerStep3Content.validation.invalidType(ACCEPTED_DOCUMENT_LABEL)
      : registerStep3Content.validation.tooLarge(MAX_DOCUMENT_SIZE_MB)
  toast.error(message)
}

function processFile(
  file: File,
  onFileAccepted: (file: File) => void,
  validate: (file: File) => 'type' | 'size' | null,
  onValidationError: (reason: 'type' | 'size') => void,
) {
  const error = validate(file)
  if (error) {
    onValidationError(error)
    return
  }

  onFileAccepted(file)
}

export function FileDropzone({
  onFileAccepted,
  inputRef: externalInputRef,
  className,
  promptText = registerStep3Content.copyByRole.donor.dropzonePrompt,
  hintText = registerStep3Content.copyByRole.donor.dropzoneHint(
    ACCEPTED_DOCUMENT_LABEL,
    MAX_DOCUMENT_SIZE_MB,
  ),
  accept = ACCEPTED_DOCUMENT_ACCEPT,
  validateFile = validateDocumentFile,
  onValidationError = showDocumentValidationError,
  ariaLabel = registerStep3Content.dropzone.ariaLabel,
}: FileDropzoneProps) {
  const internalInputRef = useRef<HTMLInputElement>(null)
  const inputRef = externalInputRef ?? internalInputRef
  const inputId = useId()
  const [dragOver, setDragOver] = useState(false)

  const openPicker = () => {
    inputRef.current?.click()
  }

  const handleFiles = (files: FileList | null) => {
    const file = files?.[0]
    if (!file) return
    processFile(file, onFileAccepted, validateFile, onValidationError)
  }

  return (
    <div className={className}>
      <input
        ref={inputRef}
        id={inputId}
        type="file"
        accept={accept}
        className="sr-only"
        onChange={(event) => {
          handleFiles(event.target.files)
          event.target.value = ''
        }}
      />
      <div
        role="button"
        tabIndex={0}
        aria-controls={inputId}
        aria-label={ariaLabel}
        onClick={openPicker}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault()
            openPicker()
          }
        }}
        onDragEnter={(event) => {
          event.preventDefault()
          setDragOver(true)
        }}
        onDragOver={(event) => {
          event.preventDefault()
          setDragOver(true)
        }}
        onDragLeave={(event) => {
          event.preventDefault()
          setDragOver(false)
        }}
        onDrop={(event) => {
          event.preventDefault()
          setDragOver(false)
          handleFiles(event.dataTransfer.files)
        }}
        className={cn(
          'border-border flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed px-6 py-10 transition-colors',
          'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
          dragOver
            ? 'border-primary bg-mint-card'
            : 'bg-white hover:border-primary/40',
        )}
      >
        <div className="text-body flex items-center gap-3">
          <Camera aria-hidden="true" className="size-5" />
          <FileUp aria-hidden="true" className="size-5" />
        </div>
        <div className="text-center">
          <p className="text-charcoal text-sm font-medium">{promptText}</p>
          <p className="text-body mt-1 text-xs">{hintText}</p>
        </div>
      </div>
    </div>
  )
}
