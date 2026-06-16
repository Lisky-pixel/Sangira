import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router'
import { PasswordField, TextField } from '../components/form'
import { HeaderZigzagBorder } from '../components/layout/header-zigzag-border'
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
import { looksLikePhone } from '../lib/identifier'
import { normalizePhone } from '../constants/phone'

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
      const rawIdentifier = values.identifier.trim()
      const identifier = looksLikePhone(rawIdentifier)
        ? normalizePhone(rawIdentifier) ?? rawIdentifier
        : rawIdentifier.toLowerCase()

      const session = await login(identifier, values.password)
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
            label={signInContent.fields.identifier.label}
            placeholder={signInContent.fields.identifier.placeholder}
            autoComplete="username"
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

        <div className="mt-4 text-center">
          <Link
            to={ROUTES.FORGOT_PASSWORD}
            className="text-primary text-sm font-medium hover:underline"
          >
            {signInContent.forgotPasswordLabel}
          </Link>
          <p className="text-body mt-1 text-sm">
            {signInContent.forgotPasswordSubcopy}
          </p>
        </div>

        <div className="my-6 flex items-center gap-4">
          <div className="bg-border h-px flex-1" />
          <span className="text-body text-xs font-medium tracking-wide">
            {signInContent.orLabel}
          </span>
          <div className="bg-border h-px flex-1" />
        </div>

        <Button
          type="button"
          variant="outline"
          className="w-full border-primary text-primary hover:bg-primary/5"
          onClick={() => navigate(ROUTES.REGISTER)}
        >
          {signInContent.registerLabel}
        </Button>

        <nav
          aria-label="Helpful links"
          className="mt-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm"
        >
          <Link to={ROUTES.PRIVACY} className="text-body hover:text-primary">
            {signInContent.links.privacy}
          </Link>
          <Link to={ROUTES.HELP} className="text-body hover:text-primary">
            {signInContent.links.help}
          </Link>
          <Link to={ROUTES.CONTACT} className="text-body hover:text-primary">
            {signInContent.links.contact}
          </Link>
        </nav>
      </form>
    </FormProvider>
  )
}

export function SignInPage() {
  return (
    <RedirectIfAuthed>
      <div className="bg-cream min-h-screen font-sans">
        {/* Mobile collapsed banner */}
        <div className="bg-primary relative lg:hidden">
          <div className="px-4 py-4 sm:px-6">
            <Link
              to={ROUTES.HOME}
              className="font-display text-lg font-bold text-white"
            >
              Sangira
            </Link>
          </div>
          <HeaderZigzagBorder className="text-primary/90 absolute inset-x-0 bottom-0 h-3" />
        </div>

        <div className="grid min-h-screen lg:grid-cols-2">
          {/* Left panel */}
          <aside className="bg-primary relative hidden lg:block">
            <div className="absolute inset-0 overflow-hidden">
              <HeaderZigzagBorder className="text-white/10 h-full w-full [transform:scale(4)]" />
            </div>
            <div className="relative flex h-full items-center justify-center px-10">
              <div className="max-w-md text-center">
                <div className="font-display text-5xl font-bold text-white">
                  Sangira
                </div>
                <p className="mt-3 text-base text-white/90">
                  Verified food redistribution for Kigali
                </p>
              </div>
            </div>
          </aside>

          {/* Right panel */}
          <main className="flex items-center justify-center px-4 py-10 sm:px-6 lg:px-10">
            <div className="w-full max-w-md">
              <div className="border-border rounded-2xl border bg-white p-6 shadow-sm sm:p-8">
                <SignInForm />
              </div>
            </div>
          </main>
        </div>
      </div>
    </RedirectIfAuthed>
  )
}
