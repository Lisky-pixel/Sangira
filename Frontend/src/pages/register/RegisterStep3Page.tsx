import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowRight } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { Controller, FormProvider, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router'
import { TextField } from '../../components/form/text-field'
import { Checkbox } from '../../components/ui/checkbox'
import { FileDropzone } from '../../components/ui/file-dropzone'
import { InfoBanner } from '../../components/ui/info-banner'
import { Button } from '../../components/ui/button'
import { NumberStepper } from '../../components/ui/number-stepper'
import { Toggle } from '../../components/ui/toggle'
import { UploadedFile } from '../../components/ui/uploaded-file'
import {
  ACCEPTED_DOCUMENT_LABEL,
  MAX_DOCUMENT_SIZE_MB,
} from '../../constants/documents'
import {
  DAILY_CAPACITY_DEFAULT,
  DAILY_CAPACITY_MIN,
  DAILY_CAPACITY_STEP,
  DAILY_CAPACITY_UNIT_LABEL,
  ORG_REG_NUMBER_PLACEHOLDER,
} from '../../constants/ngo-registration'
import type { UserRole } from '../../constants/registration-roles'
import { useRegistration } from '../../features/registration'
import {
  registerStep3DonorSchema,
  registerStep3NgoSchema,
  type RegisterStep3DonorFormValues,
  type RegisterStep3NgoFormValues,
} from '../../features/registration/register-step3-schema'
import type { RegistrationDocument } from '../../features/registration/registration-reducer'
import { registerStep3Content } from '../../placeholder/register-content'
import { toast } from '../../lib/toast'
import { ROUTES } from '../../routes/paths'
import {
  buildRegistrationSubmitPayload,
  submitRegistration,
} from '../../services/registration-service'

function resolveDailyCapacity(stored: number) {
  return stored > DAILY_CAPACITY_MIN ? stored : DAILY_CAPACITY_DEFAULT
}

type Step3SharedProps = {
  role: UserRole
  uploadedDocument: RegistrationDocument | null
  onFileAccepted: (file: File) => void
  onReplace: () => void
  fileInputRef: React.RefObject<HTMLInputElement | null>
}

function useStep3Submit(role: UserRole) {
  const navigate = useNavigate()
  const { state, dispatch } = useRegistration()

  return async (ngoValues?: RegisterStep3NgoFormValues) => {
    if (!state.documents[0]) return

    if (ngoValues) {
      dispatch({
        type: 'SET_NGO_FIELDS',
        payload: {
          registrationNumber: ngoValues.registrationNumber,
          dailyCapacity: ngoValues.dailyCapacity,
          transportAvailable: ngoValues.transportAvailable,
        },
      })
    }

    const payload = buildRegistrationSubmitPayload({
      role,
      organisationName: state.organisationName,
      contactName: state.contactName,
      phone: state.phone,
      email: state.email,
      password: state.password,
      documents: state.documents,
      registrationNumber: ngoValues?.registrationNumber ?? '',
      dailyCapacity: ngoValues?.dailyCapacity ?? 0,
      transportAvailable: ngoValues?.transportAvailable ?? false,
    })

    if (!payload) return

    await toast.promise(submitRegistration(payload), {
      loading: registerStep3Content.submit.loading,
      success: registerStep3Content.submit.success,
      error: registerStep3Content.submit.error,
    })

    dispatch({ type: 'RESET' })
    navigate(ROUTES.REGISTER_PENDING)
  }
}

function RegisterStep3DonorForm({
  uploadedDocument,
  onFileAccepted,
  onReplace,
  fileInputRef,
}: Step3SharedProps) {
  const copy = registerStep3Content.copyByRole.donor
  const submitStep = useStep3Submit('donor')

  const methods = useForm<RegisterStep3DonorFormValues>({
    resolver: zodResolver(registerStep3DonorSchema),
    mode: 'onChange',
    defaultValues: { confirmed: false },
  })

  const dropzoneHint = copy.dropzoneHint(
    ACCEPTED_DOCUMENT_LABEL,
    MAX_DOCUMENT_SIZE_MB,
  )

  const handleSubmit = methods.handleSubmit(async (values) => {
    if (!values.confirmed || !uploadedDocument) return

    try {
      await submitStep()
    } catch {
      // Sonner handles the error toast.
    }
  })

  const handleReplace = () => {
    onReplace()
    methods.setValue('confirmed', false)
  }

  return (
    <FormProvider {...methods}>
      <form className="flex flex-col" onSubmit={handleSubmit} noValidate>
        <h1 className="text-charcoal font-display mb-6 text-2xl font-bold sm:text-3xl">
          {copy.heading}
        </h1>
        <p className="text-body mb-6 text-sm leading-relaxed sm:text-base">
          {copy.uploadDescription}
        </p>

        <InfoBanner variant="info" className="mb-6">
          {registerStep3Content.slaBanner}
        </InfoBanner>

        <FileDropzone
          inputRef={fileInputRef}
          onFileAccepted={onFileAccepted}
          promptText={copy.dropzonePrompt}
          hintText={dropzoneHint}
          className="mb-4"
        />

        {uploadedDocument ? (
          <UploadedFile document={uploadedDocument} onReplace={handleReplace} />
        ) : null}

        <Controller
          name="confirmed"
          control={methods.control}
          render={({ field }) => (
            <Checkbox
              name="confirmed"
              checked={field.value}
              onChange={(event) => field.onChange(event.target.checked)}
              label={registerStep3Content.confirmationLabel}
              className="mt-6"
            />
          )}
        />

        <Button
          type="submit"
          className="mt-6 w-full"
          disabled={!uploadedDocument || !methods.formState.isValid}
        >
          <span className="inline-flex items-center gap-2">
            {registerStep3Content.submitLabel}
            <ArrowRight aria-hidden="true" className="size-4" />
          </span>
        </Button>
      </form>
    </FormProvider>
  )
}

function RegisterStep3NgoForm({
  uploadedDocument,
  onFileAccepted,
  onReplace,
  fileInputRef,
}: Step3SharedProps) {
  const { state, dispatch } = useRegistration()
  const copy = registerStep3Content.copyByRole.ngo
  const submitStep = useStep3Submit('ngo')

  const methods = useForm<RegisterStep3NgoFormValues>({
    resolver: zodResolver(registerStep3NgoSchema),
    mode: 'onChange',
    defaultValues: {
      registrationNumber: state.registrationNumber,
      dailyCapacity: resolveDailyCapacity(state.dailyCapacity),
      transportAvailable: state.transportAvailable,
      confirmed: false,
    },
  })

  useEffect(() => {
    return () => {
      const values = methods.getValues()
      dispatch({
        type: 'SET_NGO_FIELDS',
        payload: {
          registrationNumber: values.registrationNumber,
          dailyCapacity: values.dailyCapacity,
          transportAvailable: values.transportAvailable,
        },
      })
    }
  }, [dispatch, methods])

  const dropzoneHint = copy.dropzoneHint

  const handleSubmit = methods.handleSubmit(async (values) => {
    if (!values.confirmed || !uploadedDocument) return

    try {
      await submitStep(values)
    } catch {
      // Sonner handles the error toast.
    }
  })

  const handleReplace = () => {
    onReplace()
    methods.setValue('confirmed', false)
  }

  return (
    <FormProvider {...methods}>
      <form className="flex flex-col" onSubmit={handleSubmit} noValidate>
        <h1 className="text-charcoal font-display mb-6 text-2xl font-bold sm:text-3xl">
          {copy.heading}
        </h1>

        <div className="mb-6 flex flex-col gap-5">
          <TextField
            name="registrationNumber"
            label={registerStep3Content.ngoFields.registrationNumberLabel}
            placeholder={ORG_REG_NUMBER_PLACEHOLDER}
          />
          <Controller
            name="dailyCapacity"
            control={methods.control}
            render={({ field }) => (
              <NumberStepper
                label={registerStep3Content.ngoFields.dailyCapacityLabel}
                value={field.value}
                onChange={field.onChange}
                min={DAILY_CAPACITY_MIN}
                step={DAILY_CAPACITY_STEP}
                unitLabel={DAILY_CAPACITY_UNIT_LABEL}
              />
            )}
          />
          <Controller
            name="transportAvailable"
            control={methods.control}
            render={({ field }) => (
              <Toggle
                label={registerStep3Content.ngoFields.transportLabel}
                checked={field.value}
                onChange={field.onChange}
              />
            )}
          />
        </div>

        {copy.uploadLabel ? (
          <h2 className="text-charcoal font-display mb-2 text-lg font-semibold">
            {copy.uploadLabel}
          </h2>
        ) : null}
        <p className="text-body mb-4 text-sm leading-relaxed sm:text-base">
          {copy.uploadDescription}
        </p>

        <FileDropzone
          inputRef={fileInputRef}
          onFileAccepted={onFileAccepted}
          promptText={copy.dropzonePrompt}
          hintText={dropzoneHint}
          className="mb-4"
        />

        {uploadedDocument ? (
          <UploadedFile document={uploadedDocument} onReplace={handleReplace} />
        ) : null}

        <Controller
          name="confirmed"
          control={methods.control}
          render={({ field }) => (
            <Checkbox
              name="confirmed"
              checked={field.value}
              onChange={(event) => field.onChange(event.target.checked)}
              label={registerStep3Content.confirmationLabel}
              className="mt-6"
            />
          )}
        />

        <Button
          type="submit"
          className="mt-6 w-full"
          disabled={!uploadedDocument || !methods.formState.isValid}
        >
          <span className="inline-flex items-center gap-2">
            {registerStep3Content.submitLabel}
            <ArrowRight aria-hidden="true" className="size-4" />
          </span>
        </Button>

        <InfoBanner variant="info" className="mt-6">
          {registerStep3Content.slaBanner}
        </InfoBanner>
      </form>
    </FormProvider>
  )
}

export function RegisterStep3Page() {
  const navigate = useNavigate()
  const { state, dispatch } = useRegistration()
  const fileInputRef = useRef<HTMLInputElement>(null)
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

  const sharedProps: Step3SharedProps = {
    role: state.role,
    uploadedDocument,
    fileInputRef,
    onFileAccepted: (file) => {
      dispatch({
        type: 'SET_DOCUMENT',
        document: {
          file,
          filename: file.name,
          size: file.size,
        },
      })
    },
    onReplace: () => {
      dispatch({ type: 'SET_DOCUMENT', document: null })
      fileInputRef.current?.click()
    },
  }

  if (state.role === 'ngo') {
    return <RegisterStep3NgoForm {...sharedProps} />
  }

  return <RegisterStep3DonorForm {...sharedProps} />
}
