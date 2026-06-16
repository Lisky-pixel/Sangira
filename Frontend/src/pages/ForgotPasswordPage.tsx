import { zodResolver } from '@hookform/resolvers/zod'
import { useMemo } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router'
import { z } from 'zod'
import { Footer } from '../components/layout/footer'
import { HeaderMinimal } from '../components/layout/header-minimal'
import { Button } from '../components/ui/button'
import { TextField } from '../components/form'
import { passwordResetContent } from '../placeholder/password-reset-content'
import { ROUTES } from '../routes/paths'
import { isEmail, looksLikePhone } from '../lib/identifier'
import { isValidRwandanMobile, normalizePhone } from '../constants/phone'
import { toast } from '../lib/toast'
import { passwordResetService } from '../services/password-reset-service'

const requestSchema = z.object({
  identifier: z
    .string()
    .min(1, passwordResetContent.request.validation.identifierRequired)
    .refine(
      (value) => isEmail(value) || isValidRwandanMobile(value),
      passwordResetContent.request.validation.identifierInvalid,
    ),
})

type RequestFormValues = z.infer<typeof requestSchema>

function normalizeIdentifier(raw: string) {
  const trimmed = raw.trim()
  if (looksLikePhone(trimmed)) {
    return normalizePhone(trimmed) ?? trimmed
  }
  return trimmed.toLowerCase()
}

export function ForgotPasswordPage() {
  const navigate = useNavigate()

  const methods = useForm<RequestFormValues>({
    resolver: zodResolver(requestSchema),
    mode: 'onBlur',
    defaultValues: { identifier: '' },
  })

  const canSubmit = useMemo(() => {
    return methods.formState.isValid && !methods.formState.isSubmitting
  }, [methods.formState.isSubmitting, methods.formState.isValid])

  const onSubmit = methods.handleSubmit(async (values) => {
    const identifier = normalizeIdentifier(values.identifier)
    const result = await passwordResetService.requestCode(identifier)
    toast.success(passwordResetContent.request.toast.sent)

    navigate(ROUTES.RESET_PASSWORD, {
      state: {
        identifier,
        maskedEmail: result.maskedEmail,
        resendIn: result.resendIn,
      },
    })
  })

  return (
    <div className="bg-cream flex min-h-screen flex-col font-sans">
      <HeaderMinimal />

      <main className="mx-auto flex w-full max-w-lg flex-1 flex-col px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <Link
          to={ROUTES.SIGN_IN}
          className="text-body hover:text-primary mb-4 inline-flex items-center gap-2 text-sm transition-colors"
        >
          <span aria-hidden="true">←</span>
          {passwordResetContent.request.backToSignInLabel}
        </Link>

        <div className="border-border rounded-2xl border bg-white p-6 shadow-sm sm:p-8">
          <h1 className="text-charcoal font-display mb-2 text-2xl font-bold sm:text-3xl">
            {passwordResetContent.request.heading}
          </h1>
          <p className="text-body mb-6 text-sm leading-relaxed sm:text-base">
            {passwordResetContent.request.subcopy}
          </p>

          <FormProvider {...methods}>
            <form className="flex flex-col gap-5" onSubmit={onSubmit} noValidate>
              <TextField
                name="identifier"
                label={passwordResetContent.request.fields.identifier.label}
                placeholder={
                  passwordResetContent.request.fields.identifier.placeholder
                }
                autoComplete="username"
              />

              <Button type="submit" className="mt-2 w-full" disabled={!canSubmit}>
                {passwordResetContent.request.submitLabel}
              </Button>
            </form>
          </FormProvider>
        </div>
      </main>

      <Footer />
    </div>
  )
}

