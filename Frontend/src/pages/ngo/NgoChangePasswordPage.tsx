import { zodResolver } from '@hookform/resolvers/zod'
import { useMemo } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router'
import { PasswordField } from '../../components/form'
import { Footer } from '../../components/layout/footer'
import { HeaderMinimal } from '../../components/layout/header-minimal'
import { Button } from '../../components/ui/button'
import { useAuth } from '../../auth'
import {
  changePasswordSchema,
  type ChangePasswordFormValues,
} from '../../features/auth/change-password-schema'
import { toast } from '../../lib/toast'
import { ngoChangePasswordContent } from '../../placeholder/ngo-change-password-content'
import { ApiError } from '../../services/api-error'
import { passwordChangeService } from '../../services/password-change-service'

export function NgoChangePasswordPage() {
  const navigate = useNavigate()
  const { clearLocalSession } = useAuth()

  const methods = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    mode: 'onChange',
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: '',
    },
  })

  const canSubmit = useMemo(() => {
    return methods.formState.isValid && !methods.formState.isSubmitting
  }, [methods.formState.isSubmitting, methods.formState.isValid])

  const onSubmit = methods.handleSubmit(async (values) => {
    methods.clearErrors(['currentPassword', 'newPassword'])

    try {
      await passwordChangeService.changePassword({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      })
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.code === 'INVALID_CURRENT_PASSWORD') {
          methods.setError('currentPassword', {
            message: ngoChangePasswordContent.validation.wrongCurrent,
          })
          return
        }

        if (error.code === 'PASSWORD_SAME_AS_CURRENT') {
          methods.setError('newPassword', {
            message: ngoChangePasswordContent.validation.sameAsCurrent,
          })
          return
        }
      }

      toast.error(
        error instanceof Error
          ? error.message
          : ngoChangePasswordContent.toast.error,
      )
      return
    }

    clearLocalSession()
    navigate(ngoChangePasswordContent.routes.signIn, { replace: true })
    toast.success(ngoChangePasswordContent.toast.success)
  })

  return (
    <div className="flex min-h-screen flex-col font-sans">
      <HeaderMinimal variant="help-only" />

      <main className="bg-sand flex flex-1 flex-col items-center justify-center px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <div className="w-full max-w-lg">
          <div className="border-border rounded-2xl border bg-white p-6 shadow-sm sm:p-8">
            <h1 className="text-charcoal font-display mb-6 text-2xl font-bold sm:text-3xl">
              {ngoChangePasswordContent.pageTitle}
            </h1>

            <FormProvider {...methods}>
              <form
                className="flex flex-col gap-5"
                onSubmit={onSubmit}
                noValidate
              >
                <PasswordField
                  name="currentPassword"
                  label={
                    ngoChangePasswordContent.fields.currentPassword.label
                  }
                  placeholder={
                    ngoChangePasswordContent.fields.currentPassword.placeholder
                  }
                  autoComplete="current-password"
                  showStrength={false}
                />

                <PasswordField
                  name="newPassword"
                  label={ngoChangePasswordContent.fields.newPassword.label}
                  placeholder={
                    ngoChangePasswordContent.fields.newPassword.placeholder
                  }
                  autoComplete="new-password"
                />

                <PasswordField
                  name="confirmNewPassword"
                  label={
                    ngoChangePasswordContent.fields.confirmNewPassword.label
                  }
                  placeholder={
                    ngoChangePasswordContent.fields.confirmNewPassword
                      .placeholder
                  }
                  autoComplete="new-password"
                  showStrength={false}
                />

                <Button
                  type="submit"
                  className="mt-2 w-full"
                  disabled={!canSubmit}
                >
                  {ngoChangePasswordContent.submitLabel}
                </Button>

                <div className="text-center">
                  <Link
                    to={ngoChangePasswordContent.routes.profile}
                    className="text-body hover:text-primary text-sm transition-colors"
                  >
                    {ngoChangePasswordContent.cancelLabel}
                  </Link>
                </div>
              </form>
            </FormProvider>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
