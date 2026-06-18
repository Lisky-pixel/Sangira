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
import { donorChangePasswordContent } from '../../placeholder/donor-change-password-content'
import { ApiError } from '../../services/api-error'
import { passwordChangeService } from '../../services/password-change-service'

export function DonorChangePasswordPage() {
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
    methods.clearErrors('currentPassword')

    try {
      await passwordChangeService.changePassword({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      })
    } catch (error) {
      if (
        error instanceof ApiError &&
        error.code === 'INVALID_CURRENT_PASSWORD'
      ) {
        methods.setError('currentPassword', {
          message: donorChangePasswordContent.validation.wrongCurrent,
        })
        return
      }

      toast.error(
        error instanceof Error
          ? error.message
          : donorChangePasswordContent.toast.error,
      )
      return
    }

    clearLocalSession()
    navigate(donorChangePasswordContent.routes.signIn, { replace: true })
    toast.success(donorChangePasswordContent.toast.success)
  })

  return (
    <div className="flex min-h-screen flex-col font-sans">
      <HeaderMinimal variant="help-only" />

      <main className="bg-sand flex flex-1 flex-col items-center justify-center px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <div className="w-full max-w-lg">
          <div className="border-border rounded-2xl border bg-white p-6 shadow-sm sm:p-8">
            <h1 className="text-charcoal font-display mb-6 text-2xl font-bold sm:text-3xl">
              {donorChangePasswordContent.pageTitle}
            </h1>

            <FormProvider {...methods}>
              <form
                className="flex flex-col gap-5"
                onSubmit={onSubmit}
                noValidate
              >
                <PasswordField
                  name="currentPassword"
                  label={donorChangePasswordContent.fields.currentPassword.label}
                  placeholder={
                    donorChangePasswordContent.fields.currentPassword.placeholder
                  }
                  autoComplete="current-password"
                  showStrength={false}
                />

                <PasswordField
                  name="newPassword"
                  label={donorChangePasswordContent.fields.newPassword.label}
                  placeholder={
                    donorChangePasswordContent.fields.newPassword.placeholder
                  }
                  autoComplete="new-password"
                />

                <PasswordField
                  name="confirmNewPassword"
                  label={
                    donorChangePasswordContent.fields.confirmNewPassword.label
                  }
                  placeholder={
                    donorChangePasswordContent.fields.confirmNewPassword
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
                  {donorChangePasswordContent.submitLabel}
                </Button>

                <div className="text-center">
                  <Link
                    to={donorChangePasswordContent.routes.profile}
                    className="text-body hover:text-primary text-sm transition-colors"
                  >
                    {donorChangePasswordContent.cancelLabel}
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
