import { zodResolver } from '@hookform/resolvers/zod'
import { InfoBanner } from '../../components/ui/info-banner'
import { useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router'
import { PasswordField, PhoneField, TextField } from '../../components/form'
import { Button } from '../../components/ui/button'
import { useRegistration } from '../../features/registration'
import {
  registerStep2Schema,
  type RegisterStep2FormValues,
} from '../../features/registration/register-step2-schema'
import { registerStep2Content } from '../../placeholder/register-content'
import { ROUTES } from '../../routes/paths'

export function RegisterStep2Page() {
  const navigate = useNavigate()
  const { state, dispatch } = useRegistration()

  const methods = useForm<RegisterStep2FormValues>({
    resolver: zodResolver(registerStep2Schema),
    mode: 'onBlur',
    defaultValues: {
      organisationName: state.organisationName,
      contactName: state.contactName,
      phone: state.phone,
      email: state.email,
      password: state.password,
    },
  })

  useEffect(() => {
    if (!state.role) {
      navigate(ROUTES.REGISTER, { replace: true })
    }
  }, [navigate, state.role])

  useEffect(() => {
    return () => {
      dispatch({
        type: 'SET_DETAILS',
        payload: methods.getValues(),
      })
    }
  }, [dispatch, methods])

  const onSubmit = (values: RegisterStep2FormValues) => {
    dispatch({ type: 'SET_DETAILS', payload: values })
    navigate(`${ROUTES.REGISTER}/documents`)
  }

  if (!state.role) {
    return null
  }

  const { fields } = registerStep2Content

  return (
    <>
      <h1 className="text-charcoal font-display mb-2 text-2xl font-bold sm:text-3xl">
        {registerStep2Content.heading}
      </h1>
      <p className="text-body mb-6 text-sm leading-relaxed sm:text-base">
        {registerStep2Content.subcopy}
      </p>

      <FormProvider {...methods}>
        <form
          className="flex flex-col gap-5"
          onSubmit={methods.handleSubmit(onSubmit)}
          noValidate
        >
          <TextField
            name="organisationName"
            label={fields.organisationName.label}
            autoComplete="organization"
          />
          <TextField
            name="contactName"
            label={fields.contactName.label}
            placeholder={fields.contactName.placeholder}
            autoComplete="name"
          />
          <PhoneField
            name="phone"
            label={fields.phone.label}
            placeholder={fields.phone.placeholder}
          />
          <TextField
            name="email"
            label={fields.email.label}
            placeholder={fields.email.placeholder}
            type="email"
            autoComplete="email"
          />
          <PasswordField
            name="password"
            label={fields.password.label}
            placeholder={fields.password.placeholder}
          />

          <Button type="submit" className="mt-2 w-full">
            {registerStep2Content.continueLabel}
          </Button>
        </form>
      </FormProvider>

      <InfoBanner variant="neutral" className="mt-6">
        {registerStep2Content.infoBanner}
      </InfoBanner>
    </>
  )
}
