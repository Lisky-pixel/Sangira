import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { Controller, FormProvider, useForm } from 'react-hook-form'
import { Link, useLocation, useNavigate } from 'react-router'
import { z } from 'zod'
import { Footer } from '../components/layout/footer'
import { HeaderMinimal } from '../components/layout/header-minimal'
import { Button } from '../components/ui/button'
import { OtpInput, PasswordField } from '../components/form'
import { passwordResetContent } from '../placeholder/password-reset-content'
import { ROUTES } from '../routes/paths'
import { toast } from '../lib/toast'
import { passwordResetService } from '../services/password-reset-service'
import { ApiError } from '../services/api-error'
import { useAuth, resolveVerificationRoute } from '../auth'
import {
  estimatePasswordStrength,
  MODERATE_PASSWORD_MIN_SCORE,
} from '../lib/password-strength'

type ResetState = {
  identifier: string
  maskedEmail: string
  resendIn: number
}

const verifySchema = z.object({
  code: z.string().regex(/^\d{6}$/, 'Enter the 6-digit code'),
  newPassword: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .refine(
      (value) => estimatePasswordStrength(value).score >= MODERATE_PASSWORD_MIN_SCORE,
      'Password must be moderate strength or stronger',
    ),
})

type VerifyFormValues = z.infer<typeof verifySchema>

function formatCountdown(totalSeconds: number) {
  const seconds = Math.max(0, Math.floor(totalSeconds))
  const mm = String(Math.floor(seconds / 60)).padStart(1, '0')
  const ss = String(seconds % 60).padStart(2, '0')
  return `${mm}:${ss}`
}

export function ResetPasswordPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { refreshMe } = useAuth()

  const state = (location.state ?? null) as ResetState | null

  const [resendSeconds, setResendSeconds] = useState<number>(
    state?.resendIn ?? 0,
  )
  const [inlineError, setInlineError] = useState<string | null>(null)

  const methods = useForm<VerifyFormValues>({
    resolver: zodResolver(verifySchema),
    mode: 'onBlur',
    defaultValues: { code: '', newPassword: '' },
  })

  useEffect(() => {
    if (!state?.identifier) {
      navigate(ROUTES.FORGOT_PASSWORD, { replace: true })
    }
  }, [navigate, state?.identifier])

  useEffect(() => {
    if (resendSeconds <= 0) return
    const id = window.setInterval(() => {
      setResendSeconds((current) => Math.max(0, current - 1))
    }, 1000)
    return () => window.clearInterval(id)
  }, [resendSeconds])

  const canResend = resendSeconds <= 0 && !methods.formState.isSubmitting

  const canSubmit =
    methods.formState.isValid && !methods.formState.isSubmitting

  const handleResend = async () => {
    if (!state?.identifier || !canResend) return
    const result = await passwordResetService.requestCode(state.identifier)
    toast.success(passwordResetContent.verify.toast.resent)
    setResendSeconds(result.resendIn)
  }

  const onSubmit = methods.handleSubmit(async (values) => {
    if (!state?.identifier) return
    setInlineError(null)

    await toast.promise(
      (async () => {
        try {
          await passwordResetService.verify({
            identifier: state.identifier,
            code: values.code,
            newPassword: values.newPassword,
          })
        } catch (error) {
          if (error instanceof ApiError) {
            if (error.code === 'RESET_CODE_EXPIRED') {
              setInlineError(passwordResetContent.verify.errors.expired)
            } else if (error.code === 'RESET_TOO_MANY_ATTEMPTS') {
              setInlineError(passwordResetContent.verify.errors.tooManyAttempts)
            } else if (error.code === 'INVALID_RESET_CODE') {
              setInlineError(passwordResetContent.verify.errors.invalidCode)
            } else {
              setInlineError(error.message)
            }
          }
          throw error
        }

        const session = await refreshMe()
        if (!session) {
          navigate(ROUTES.SIGN_IN, { replace: true })
          return
        }

        navigate(
          resolveVerificationRoute(session.verificationStatus, {
            role: session.user.role,
          }),
          { replace: true },
        )
      })(),
      {
        loading: passwordResetContent.verify.toast.verifying,
        success: passwordResetContent.verify.toast.success,
        error: (error) => {
          if (error instanceof Error) {
            return error.message || passwordResetContent.verify.toast.error
          }
          return passwordResetContent.verify.toast.error
        },
      },
    )
  })

  const maskedEmail = state?.maskedEmail ?? ''

  return (
    <div className="bg-cream flex min-h-screen flex-col font-sans">
      <HeaderMinimal variant="help-only" />

      <main className="mx-auto flex w-full max-w-lg flex-1 flex-col px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <div className="border-border rounded-2xl border bg-white p-6 shadow-sm sm:p-8">
          <h1 className="text-charcoal font-display mb-2 text-2xl font-bold sm:text-3xl">
            {passwordResetContent.verify.heading}
          </h1>
          <p className="text-body mb-6 text-sm leading-relaxed sm:text-base">
            {passwordResetContent.verify.subcopyPrefix}{' '}
            <span className="font-medium">{maskedEmail}</span>.{' '}
            {passwordResetContent.verify.subcopySuffix}
          </p>

          <FormProvider {...methods}>
            <form className="flex flex-col gap-5" onSubmit={onSubmit} noValidate>
              <Controller
                name="code"
                control={methods.control}
                render={({ field }) => (
                  <OtpInput
                    length={6}
                    label={passwordResetContent.verify.fields.codeLabel}
                    value={field.value ?? ''}
                    onChange={(next) => field.onChange(next)}
                    disabled={methods.formState.isSubmitting}
                  />
                )}
              />

              <button
                type="button"
                onClick={handleResend}
                disabled={!canResend}
                className="text-body text-left text-sm"
              >
                {passwordResetContent.verify.resendPrefix}{' '}
                <span
                  className={
                    canResend
                      ? 'text-primary font-medium hover:underline'
                      : 'text-body'
                  }
                >
                  {passwordResetContent.verify.resendLabel} ({formatCountdown(resendSeconds)})
                </span>
              </button>

              <PasswordField
                name="newPassword"
                label={passwordResetContent.verify.fields.password.label}
                placeholder={passwordResetContent.verify.fields.password.placeholder}
              />

              {inlineError ? (
                <p className="text-clay-red text-sm" role="alert">
                  {inlineError}
                </p>
              ) : null}

              <Button type="submit" className="mt-2 w-full" disabled={!canSubmit}>
                {passwordResetContent.verify.submitLabel}
              </Button>
            </form>
          </FormProvider>
        </div>

        <div className="mt-6 text-center">
          <Link
            to={ROUTES.SIGN_IN}
            className="text-body hover:text-primary text-sm transition-colors"
          >
            {passwordResetContent.request.backToSignInLabel}
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  )
}

