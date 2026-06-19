import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router'
import {
  RedirectIfAdminAuthed,
  useAuth,
} from '../../auth'
import { PasswordField, TextField } from '../../components/form'
import { Button } from '../../components/ui/button'
import { ADMIN_ROLE } from '../../constants/portal-roles'
import {
  adminSignInSchema,
  type AdminSignInFormValues,
} from '../../features/auth/admin-sign-in-schema'
import { adminSignInContent } from '../../placeholder/admin-sign-in-content'
import { ApiError } from '../../services/api-error'
import { authService } from '../../services/auth-service'
import { toast } from '../../lib/toast'

function AdminSignInForm() {
  const navigate = useNavigate()
  const { login, clearLocalSession } = useAuth()
  const [formError, setFormError] = useState<string | null>(null)

  const methods = useForm<AdminSignInFormValues>({
    resolver: zodResolver(adminSignInSchema),
    mode: 'onBlur',
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const handleSubmit = methods.handleSubmit(async (values) => {
    setFormError(null)

    try {
      const session = await login(
        values.email.trim().toLowerCase(),
        values.password,
      )

      if (session.user.role !== ADMIN_ROLE) {
        try {
          await authService.logout()
        } catch {
          // Still clear local session if logout fails.
        }
        clearLocalSession()
        const message = adminSignInContent.errors.notAdministrator
        setFormError(message)
        toast.error(message)
        return
      }

      toast.success(adminSignInContent.toast.success)
      navigate(adminSignInContent.routes.overview, { replace: true })
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.code === 'INVALID_CREDENTIALS') {
          const message = adminSignInContent.errors.invalidCredentials
          setFormError(message)
          toast.error(message)
          return
        }

        if (error.code === 'ACCOUNT_BLOCKED') {
          const message = adminSignInContent.errors.accountBlocked
          setFormError(message)
          toast.error(message)
          return
        }
      }

      const message = adminSignInContent.errors.invalidCredentials
      setFormError(message)
      toast.error(message)
    }
  })

  return (
    <FormProvider {...methods}>
      <form className="flex flex-col" onSubmit={handleSubmit} noValidate>
        <div className="mb-6 flex items-center justify-center gap-2">
          <span className="text-primary font-display text-2xl font-bold">
            {adminSignInContent.brand}
          </span>
          <span className="bg-sand text-body rounded-full px-2.5 py-1 text-[10px] font-semibold tracking-wide uppercase">
            {adminSignInContent.badge}
          </span>
        </div>

        <h1 className="text-charcoal font-display mb-2 text-center text-2xl font-bold sm:text-3xl">
          {adminSignInContent.heading}
        </h1>
        <p className="text-body mb-6 text-center text-sm leading-relaxed sm:text-base">
          {adminSignInContent.subcopy}
        </p>

        <div className="flex flex-col gap-5">
          <TextField
            name="email"
            label={adminSignInContent.fields.email.label}
            placeholder={adminSignInContent.fields.email.placeholder}
            type="email"
            autoComplete="email"
          />
          <div>
            <PasswordField
              name="password"
              label={adminSignInContent.fields.password.label}
              placeholder={adminSignInContent.fields.password.placeholder}
              autoComplete="current-password"
              showStrength={false}
            />
            <div className="mt-2 text-right">
              <Link
                to={adminSignInContent.routes.forgotPassword}
                className="text-primary text-sm font-medium hover:underline"
              >
                {adminSignInContent.forgotPassword}
              </Link>
            </div>
          </div>
        </div>

        {formError ? (
          <p className="text-clay-red mt-4 text-sm" role="alert">
            {formError}
          </p>
        ) : null}

        <Button
          type="submit"
          className="mt-6 w-full"
          disabled={methods.formState.isSubmitting}
        >
          {adminSignInContent.submitLabel}
        </Button>
      </form>
    </FormProvider>
  )
}

export function AdminSignInPage() {
  return (
    <RedirectIfAdminAuthed>
      <div className="bg-cream flex min-h-screen flex-col font-sans">
        <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-4 py-10 sm:px-6">
          <div className="border-border rounded-2xl border bg-white p-6 shadow-sm sm:p-8">
            <AdminSignInForm />
          </div>
          <p className="text-body mt-6 text-center text-sm">
            {adminSignInContent.restrictedNotice}
          </p>
        </main>

        <footer className="px-4 pb-8 text-center">
          <p className="text-body text-xs">{adminSignInContent.copyright}</p>
        </footer>
      </div>
    </RedirectIfAdminAuthed>
  )
}
