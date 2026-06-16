import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router'
import { PasswordField, TextField } from '../components/form'
import { Footer } from '../components/layout/footer'
import { HeaderMinimal } from '../components/layout/header-minimal'
import { Button } from '../components/ui/button'
import { RedirectIfAuthed, resolveVerificationRoute, useAuth } from '../auth'
import {
  signInSchema,
  type SignInFormValues,
} from '../features/auth/sign-in-schema'
import { signInContent } from '../placeholder/sign-in-content'
import { ApiError } from '../services/api-error'
import { toast } from '../lib/toast'
import { ROUTES } from '../routes/paths'

function SignInForm() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [formError, setFormError] = useState<string | null>(null)

  const methods = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    mode: 'onBlur',
    defaultValues: {
      identifier: '',
      password: '',
    },
  })

  const handleSubmit = methods.handleSubmit(async (values) => {
    setFormError(null)

    try {
      const session = await login(values.identifier, values.password)
      toast.success(signInContent.toast.success)
      navigate(
        resolveVerificationRoute(session.verificationStatus, {
          role: session.user.role,
        }),
        {
          replace: true,
        },
      )
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.code === 'INVALID_CREDENTIALS') {
          const message = signInContent.errors.invalidCredentials
          setFormError(message)
          toast.error(message)
          return
        }

        if (error.code === 'ACCOUNT_BLOCKED') {
          const message = signInContent.errors.accountBlocked
          setFormError(message)
          toast.error(message)
          return
        }
      }

      const message = signInContent.errors.invalidCredentials
      setFormError(message)
      toast.error(message)
    }
  })

  return (
    <FormProvider {...methods}>
      <form className="flex flex-col" onSubmit={handleSubmit} noValidate>
        <h1 className="text-charcoal font-display mb-2 text-2xl font-bold sm:text-3xl">
          {signInContent.heading}
        </h1>
        <p className="text-body mb-6 text-sm leading-relaxed sm:text-base">
          {signInContent.subcopy}
        </p>

        <div className="flex flex-col gap-5">
          <TextField
            name="identifier"
            label={signInContent.fields.email.label}
            placeholder={signInContent.fields.email.placeholder}
            autoComplete="email"
          />
          <PasswordField
            name="password"
            label={signInContent.fields.password.label}
            placeholder={signInContent.fields.password.placeholder}
            autoComplete="current-password"
            showStrength={false}
          />
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
          {signInContent.submitLabel}
        </Button>

        <p className="text-body mt-6 text-center text-sm">
          {signInContent.newHerePrefix}{' '}
          <Link
            to={ROUTES.REGISTER}
            className="text-primary font-medium hover:underline"
          >
            {signInContent.getStartedLabel}
          </Link>
        </p>
      </form>
    </FormProvider>
  )
}

export function SignInPage() {
  return (
    <RedirectIfAuthed>
      <div className="bg-cream flex min-h-screen flex-col font-sans">
        <HeaderMinimal />

        <main className="mx-auto flex w-full max-w-lg flex-1 flex-col px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
          <div className="border-border rounded-2xl border bg-white p-6 shadow-sm sm:p-8">
            <SignInForm />
          </div>
        </main>

        <Footer />
      </div>
    </RedirectIfAuthed>
  )
}
