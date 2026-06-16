import { ArrowRight } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import { Checkbox } from '../../components/ui/checkbox'
import { FileDropzone } from '../../components/ui/file-dropzone'
import { InfoBanner } from '../../components/ui/info-banner'
import { Button } from '../../components/ui/button'
import { UploadedFile } from '../../components/ui/uploaded-file'
import { useRegistration } from '../../features/registration'
import {
  getRegisterStep3Copy,
  registerStep3Content,
} from '../../placeholder/register-content'
import { toast } from '../../lib/toast'
import { ROUTES } from '../../routes/paths'
import {
  buildRegistrationSubmitPayload,
  submitRegistration,
} from '../../services/registration-service'

export function RegisterStep3Page() {
  const navigate = useNavigate()
  const { state, dispatch } = useRegistration()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [confirmed, setConfirmed] = useState(false)

  const uploadedDocument = state.documents[0] ?? null

  useEffect(() => {
    if (!state.role) {
      navigate(ROUTES.REGISTER, { replace: true })
      return
    }

    if (!state.organisationName || !state.email) {
      navigate(`${ROUTES.REGISTER}/details`, { replace: true })
    }
  }, [navigate, state.email, state.organisationName, state.role])

  if (!state.role) {
    return null
  }

  const copy = getRegisterStep3Copy(state.role)

  const handleFileAccepted = (file: File) => {
    dispatch({
      type: 'SET_DOCUMENT',
      document: {
        file,
        filename: file.name,
        size: file.size,
      },
    })
  }

  const handleReplace = () => {
    dispatch({ type: 'SET_DOCUMENT', document: null })
    setConfirmed(false)
    fileInputRef.current?.click()
  }

  const handleSubmit = async () => {
    if (!uploadedDocument || !confirmed || !state.role) return

    const payload = buildRegistrationSubmitPayload({
      role: state.role,
      organisationName: state.organisationName,
      contactName: state.contactName,
      phone: state.phone,
      email: state.email,
      password: state.password,
      documents: state.documents,
    })
    if (!payload) return

    try {
      await toast.promise(submitRegistration(payload), {
        loading: registerStep3Content.submit.loading,
        success: registerStep3Content.submit.success,
        error: registerStep3Content.submit.error,
      })

      dispatch({ type: 'RESET' })
      navigate(ROUTES.REGISTER_PENDING)
    } catch {
      // Sonner handles the error toast.
    }
  }

  return (
    <>
      <h1 className="text-charcoal font-display mb-2 text-2xl font-bold sm:text-3xl">
        {copy.heading}
      </h1>
      <p className="text-body mb-6 text-sm leading-relaxed sm:text-base">
        {copy.description}
      </p>

      <InfoBanner variant="info" className="mb-6">
        {registerStep3Content.slaBanner}
      </InfoBanner>

      <FileDropzone
        inputRef={fileInputRef}
        onFileAccepted={handleFileAccepted}
        className="mb-4"
      />

      {uploadedDocument ? (
        <UploadedFile document={uploadedDocument} onReplace={handleReplace} />
      ) : null}

      <Checkbox
        name="document-confirmation"
        checked={confirmed}
        onChange={(event) => setConfirmed(event.target.checked)}
        label={registerStep3Content.confirmationLabel}
        className="mt-6"
      />

      <Button
        type="button"
        className="mt-6 w-full"
        disabled={!uploadedDocument || !confirmed}
        onClick={handleSubmit}
      >
        <span className="inline-flex items-center gap-2">
          {registerStep3Content.submitLabel}
          <ArrowRight aria-hidden="true" className="size-4" />
        </span>
      </Button>
    </>
  )
}
