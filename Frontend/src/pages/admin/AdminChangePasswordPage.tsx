import { zodResolver } from '@hookform/resolvers/zod'
import { useMemo } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router'
import { PasswordField } from '../../components/form'
import { Button } from '../../components/ui/button'
import { useAuth } from '../../auth'
import {
  changePasswordSchema,
  type ChangePasswordFormValues,
} from '../../features/auth/change-password-schema'
import { toast } from '../../lib/toast'
import { adminChangePasswordContent } from '../../placeholder/admin-change-password-content'
import { ApiError } from '../../services/api-error'
import { passwordChangeService } from '../../services/password-change-service'

export function AdminChangePasswordPage() {
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
            message: adminChangePasswordContent.validation.wrongCurrent,
          })
          return
        }

        if (error.code === 'PASSWORD_SAME_AS_CURRENT') {
          methods.setError('newPassword', {
            message: adminChangePasswordContent.validation.sameAsCurrent,
          })
          return
        }
      }

      toast.error(
        error instanceof Error
          ? error.message
          : adminChangePasswordContent.toast.error,
      )
      return
    }

    clearLocalSession()
    navigate(adminChangePasswordContent.routes.signIn, { replace: true })
    toast.success(adminChangePasswordContent.toast.success)
  })

  return (
    <div className="mx-auto flex w-full max-w-lg flex-col gap-6">
      <header>
        <h1 className="text-charcoal font-display text-2xl font-bold sm:text-3xl">
          {adminChangePasswordContent.pageTitle}
        </h1>
      </header>

      <section className="border-border rounded-2xl border bg-white p-6 shadow-sm sm:p-8">
        <FormProvider {...methods}>
          <form className="flex flex-col gap-5" onSubmit={onSubmit} noValidate>
            <PasswordField
              name="currentPassword"
              label={adminChangePasswordContent.fields.currentPassword.label}
              placeholder={
                adminChangePasswordContent.fields.currentPassword.placeholder
              }
              autoComplete="current-password"
              showStrength={false}
            />

            <PasswordField
              name="newPassword"
              label={adminChangePasswordContent.fields.newPassword.label}
              placeholder={
                adminChangePasswordContent.fields.newPassword.placeholder
              }
              autoComplete="new-password"
            />

            <PasswordField
              name="confirmNewPassword"
              label={
                adminChangePasswordContent.fields.confirmNewPassword.label
              }
              placeholder={
                adminChangePasswordContent.fields.confirmNewPassword.placeholder
              }
              autoComplete="new-password"
              showStrength={false}
            />

            <Button type="submit" className="mt-2 w-full" disabled={!canSubmit}>
              {adminChangePasswordContent.submitLabel}
            </Button>

            <div className="text-center">
              <Link
                to={adminChangePasswordContent.routes.profile}
                className="text-body hover:text-primary text-sm transition-colors"
              >
                {adminChangePasswordContent.cancelLabel}
              </Link>
            </div>
          </form>
        </FormProvider>
      </section>
    </div>
  )
}
