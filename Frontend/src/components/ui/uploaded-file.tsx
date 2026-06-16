import { BadgeCheck, FileText } from 'lucide-react'
import type { RegistrationDocument } from '../../features/registration/registration-reducer'
import { registerStep3Content } from '../../placeholder/register-content'
import { humanReadableSize } from '../../lib/file-size'

type UploadedFileProps = {
  document: RegistrationDocument
  onReplace: () => void
}

export function UploadedFile({ document, onReplace }: UploadedFileProps) {
  return (
    <div className="bg-sand flex items-center justify-between gap-4 rounded-lg px-4 py-3">
      <div className="flex min-w-0 items-start gap-3">
        <FileText
          aria-hidden="true"
          className="text-stat mt-0.5 size-5 shrink-0"
        />
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <p className="text-charcoal truncate text-sm font-medium">
              {document.filename}
            </p>
            <BadgeCheck
              aria-hidden="true"
              className="text-stat size-4 shrink-0"
            />
          </div>
          <p className="text-body text-xs">
            {humanReadableSize(document.size)} •{' '}
            {registerStep3Content.uploadedFile.readyLabel}
          </p>
        </div>
      </div>
      <button
        type="button"
        onClick={onReplace}
        className="text-primary shrink-0 text-sm font-medium hover:underline"
      >
        {registerStep3Content.uploadedFile.replaceLabel}
      </button>
    </div>
  )
}
