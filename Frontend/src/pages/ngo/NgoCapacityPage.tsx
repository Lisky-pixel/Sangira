import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { Controller, FormProvider, useForm } from 'react-hook-form'
import {
  NgoCapacityDailyStepper,
  NgoCapacityTransportSection,
} from '../../components/ngo/ngo-capacity-form-sections'
import { Button } from '../../components/ui/button'
import { Toggle } from '../../components/ui/toggle'
import {
  DAILY_CAPACITY_MAX,
  DAILY_CAPACITY_MIN,
} from '../../constants/ngo-capacity'
import {
  DAILY_CAPACITY_STEP,
  DAILY_CAPACITY_UNIT_LABEL,
} from '../../constants/ngo-registration'
import { TRANSPORT_MODE } from '../../constants/transport-mode'
import {
  ngoCapacityFormSchema,
  type NgoCapacityFormValues,
} from '../../features/ngo-capacity/ngo-capacity-schema'
import { useParticipantEditBlocked } from '../../hooks/use-participant-edit-blocked'
import { toast } from '../../lib/toast'
import { ParticipantActionBlockNote } from '../../components/participant/participant-action-control'
import { participantEnforcementContent } from '../../placeholder/participant-enforcement-content'
import { ngoCapacityContent } from '../../placeholder/ngo-capacity-content'
import { ApiError } from '../../services/api-error'
import { ngoCapacityService } from '../../services/ngo-capacity-service'

function toFormValues(
  capacity: Awaited<ReturnType<typeof ngoCapacityService.getCapacity>>,
): NgoCapacityFormValues {
  return {
    dailyCapacity: capacity.dailyCapacity,
    transport: {
      hasOwnTransport: capacity.transport.hasOwnTransport,
      mode: capacity.transport.hasOwnTransport
        ? (capacity.transport.mode ?? TRANSPORT_MODE.VAN)
        : undefined,
    },
    pickupHours: {
      from: capacity.pickupHours.from,
      to: capacity.pickupHours.to,
    },
    paused: capacity.paused,
  }
}

export function NgoCapacityPage() {
  const { blocked: editsBlocked } = useParticipantEditBlocked()
  const [loadState, setLoadState] = useState<'loading' | 'ready' | 'error'>(
    'loading',
  )

  const methods = useForm<NgoCapacityFormValues>({
    resolver: zodResolver(ngoCapacityFormSchema),
    mode: 'onChange',
    defaultValues: {
      dailyCapacity: 0,
      transport: { hasOwnTransport: false },
      pickupHours: { from: '08:00', to: '18:00' },
      paused: false,
    },
  })

  const {
    control,
    handleSubmit,
    reset,
    formState: { isDirty, isValid, isSubmitting },
  } = methods

  useEffect(() => {
    let cancelled = false

    const loadCapacity = async () => {
      setLoadState('loading')
      try {
        const capacity = await ngoCapacityService.getCapacity()
        if (cancelled) return
        reset(toFormValues(capacity))
        setLoadState('ready')
      } catch {
        if (!cancelled) {
          setLoadState('error')
        }
      }
    }

    void loadCapacity()

    return () => {
      cancelled = true
    }
  }, [reset])

  const pickupHoursError = methods.formState.errors.pickupHours?.to?.message

  const onSubmit = handleSubmit(async (values) => {
    const payload: NgoCapacityFormValues = {
      ...values,
      transport: {
        hasOwnTransport: values.transport.hasOwnTransport,
        ...(values.transport.hasOwnTransport && values.transport.mode
          ? { mode: values.transport.mode }
          : {}),
      },
    }

    const savePromise = ngoCapacityService.updateCapacity(payload)

    try {
      void toast.promise(savePromise, {
        loading: ngoCapacityContent.save.loading,
        success: ngoCapacityContent.save.success,
        error: (error) =>
          error instanceof ApiError &&
          (error.code === 'ACCOUNT_SUSPENDED' ||
            error.code === 'VERIFICATION_REVOKED')
            ? participantEnforcementContent.editsBlockedNote
            : error instanceof ApiError
              ? error.message
              : ngoCapacityContent.save.error,
      })
      const updated = await savePromise
      reset(toFormValues(updated))
    } catch {
      // toast.promise surfaces the error
    }
  })

  if (loadState === 'loading') {
    return (
      <p className="text-body text-sm">{ngoCapacityContent.load.loading}</p>
    )
  }

  if (loadState === 'error') {
    return (
      <p className="text-clay-red text-sm">{ngoCapacityContent.load.error}</p>
    )
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
      <header>
        <h1 className="text-charcoal font-display text-2xl font-bold sm:text-3xl">
          {ngoCapacityContent.pageTitle}
        </h1>
        <p className="text-body mt-2 text-sm sm:text-base">
          {ngoCapacityContent.subcopy}
        </p>
      </header>

      <FormProvider {...methods}>
        <form className="flex flex-col gap-5" onSubmit={onSubmit} noValidate>
          <fieldset disabled={editsBlocked} className="flex flex-col gap-5">
          <Controller
            name="dailyCapacity"
            control={control}
            render={({ field }) => (
              <NgoCapacityDailyStepper
                value={field.value}
                min={DAILY_CAPACITY_MIN}
                max={DAILY_CAPACITY_MAX}
                step={DAILY_CAPACITY_STEP}
                unitLabel={DAILY_CAPACITY_UNIT_LABEL}
                onChange={field.onChange}
              />
            )}
          />

          <Controller
            name="transport"
            control={control}
            render={({ field }) => (
              <NgoCapacityTransportSection
                hasOwnTransport={field.value.hasOwnTransport}
                mode={field.value.mode}
                onHasOwnTransportChange={(checked) => {
                  field.onChange({
                    hasOwnTransport: checked,
                    mode: checked
                      ? (field.value.mode ?? TRANSPORT_MODE.VAN)
                      : undefined,
                  })
                }}
                onModeChange={(mode) => {
                  field.onChange({
                    hasOwnTransport: true,
                    mode,
                  })
                }}
              />
            )}
          />

          <section className="border-border rounded-2xl border bg-white p-5 shadow-sm sm:p-6">
            <h2 className="text-charcoal font-display mb-5 text-lg font-bold">
              {ngoCapacityContent.pickupHours.sectionLabel}
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Controller
                name="pickupHours.from"
                control={control}
                render={({ field }) => (
                  <label className="flex flex-col gap-2">
                    <span className="text-charcoal text-sm font-medium">
                      {ngoCapacityContent.pickupHours.fromLabel}
                    </span>
                    <input
                      type="time"
                      value={field.value}
                      onChange={field.onChange}
                      className="border-border text-charcoal focus-visible:outline-primary w-full rounded-lg border bg-white px-3 py-2.5 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                    />
                  </label>
                )}
              />
              <Controller
                name="pickupHours.to"
                control={control}
                render={({ field }) => (
                  <label className="flex flex-col gap-2">
                    <span className="text-charcoal text-sm font-medium">
                      {ngoCapacityContent.pickupHours.toLabel}
                    </span>
                    <input
                      type="time"
                      value={field.value}
                      onChange={field.onChange}
                      className="border-border text-charcoal focus-visible:outline-primary w-full rounded-lg border bg-white px-3 py-2.5 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                    />
                  </label>
                )}
              />
            </div>
            {pickupHoursError ? (
              <p className="text-clay-red mt-3 text-sm" role="alert">
                {pickupHoursError}
              </p>
            ) : null}
          </section>

          <section className="border-border rounded-2xl border bg-white p-5 shadow-sm sm:p-6">
            <Controller
              name="paused"
              control={control}
              render={({ field }) => (
                <Toggle
                  label={ngoCapacityContent.pause.sectionLabel}
                  description={ngoCapacityContent.pause.description}
                  checked={field.value}
                  onChange={field.onChange}
                />
              )}
            />
          </section>

          <div className="flex flex-col items-center gap-2 pt-2">
            <Button
              type="submit"
              className="w-full max-w-md"
              disabled={!isDirty || !isValid || isSubmitting}
            >
              {ngoCapacityContent.save.label}
            </Button>
            <p className="text-body text-center text-sm">
              {ngoCapacityContent.save.footnote}
            </p>
            {editsBlocked ? (
              <ParticipantActionBlockNote className="text-center" />
            ) : null}
          </div>
          </fieldset>
        </form>
      </FormProvider>
    </div>
  )
}
