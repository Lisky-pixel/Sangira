import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft, MapPin, Sparkles, Timer, Utensils, ChevronDown } from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Controller, FormProvider, useForm, useWatch } from 'react-hook-form'
import { Link, useNavigate } from 'react-router'
import { useAuth } from '../../auth'
import { TextAreaField, TextField } from '../../components/form'
import { ListingPhotoUpload } from '../../components/listing/listing-photo-upload'
import { ListingReviewSummary } from '../../components/listing/listing-review-summary'
import {
  PostListingStepper,
  type PostListingStep,
} from '../../components/listing/post-listing-stepper'
import { SingleSelectPills } from '../../components/listing/single-select-pills'
import { ParticipantActionButton } from '../../components/participant/participant-action-control'
import { useParticipantEditBlocked } from '../../hooks/use-participant-edit-blocked'
import { Checkbox } from '../../components/ui/checkbox'
import { InfoBanner } from '../../components/ui/info-banner'
import {
  FOOD_LABEL_VALUES,
  FOOD_TYPE_VALUES,
  QUANTITY_UNIT,
  QUANTITY_UNIT_VALUES,
  STORAGE_CONDITION_VALUES,
  UNIT_BY_FOOD_TYPE,
  type FoodLabel,
  type FoodType,
  type QuantityUnit,
  type StorageCondition,
} from '../../constants/listing-form'
import { POST_LISTING_SECTION_ID } from '../../constants/post-listing-steps'
import {
  editListingSchema,
  postListingSchema,
  type EditListingFormValues,
  type PostListingFormValues,
} from '../../features/post-listing/post-listing-schema'
import { getDonorPickupAddress } from '../../lib/donor-pickup-address'
import { canEditListing } from '../../lib/listing-manage'
import {
  getAvailableDatetimePresets,
  toDatetimeLocalValue,
  type DatetimePresetId,
} from '../../lib/preset-datetime'
import { toast } from '../../lib/toast'
import { cn } from '../../lib/utils'
import { geocodeContent } from '../../placeholder/geocode-content'
import { postListingContent } from '../../placeholder/post-listing-content'
import { donorListingManagePath, ROUTES } from '../../routes/paths'
import { MY_LISTINGS_LOCATION_STATE } from '../../routes/my-listings-location-state'
import { listingService } from '../../services/listing-service'
import type { CreateListingPayload } from '../../types/create-listing'
import type { UpdateListingPayload } from '../../types/update-listing'

type PostListingPageProps = {
  editListingId?: string
}

const sectionOrder = [
  POST_LISTING_SECTION_ID.WHAT,
  POST_LISTING_SECTION_ID.SAFETY,
  POST_LISTING_SECTION_ID.PICKUP,
] as const

function presetLabel(id: DatetimePresetId) {
  switch (id) {
    case 'today_6pm':
      return postListingContent.presets.todaySixPm
    case 'tonight_10pm':
      return postListingContent.presets.tonightTenPm
    case 'tomorrow_noon':
      return postListingContent.presets.tomorrowNoon
  }
}

function buildDefaultValues(pickupAddress: string): Partial<PostListingFormValues> {
  return {
    quantity: 1,
    quantityUnit: QUANTITY_UNIT.SERVINGS,
    expiresAt: '',
    foodLabels: [],
    pickupAddress,
    pickupInstructions: '',
  }
}

function SectionHeader({
  icon: Icon,
  title,
}: {
  icon: typeof Utensils
  title: string
}) {
  return (
    <div className="mb-5 flex items-center gap-3">
      <span className="bg-mint-card text-primary inline-flex size-10 items-center justify-center rounded-full">
        <Icon aria-hidden="true" className="size-5" />
      </span>
      <h2 className="text-charcoal text-lg font-semibold">{title}</h2>
    </div>
  )
}

export function PostListingPage({ editListingId }: PostListingPageProps = {}) {
  const navigate = useNavigate()
  const { state } = useAuth()
  const { blocked: actionsBlocked } = useParticipantEditBlocked()
  const isEditMode = Boolean(editListingId)
  const [unitOverridden, setUnitOverridden] = useState(false)
  const [activeSectionId, setActiveSectionId] = useState<string>(
    POST_LISTING_SECTION_ID.WHAT,
  )
  const [selectedPresetId, setSelectedPresetId] = useState<
    DatetimePresetId | null
  >(null)
  const [existingPhotoUrl, setExistingPhotoUrl] = useState<string | undefined>()
  const [loadingListing, setLoadingListing] = useState(isEditMode)

  const pickupAddressDefault =
    state.status === 'authed' ? getDonorPickupAddress(state.user) : ''

  const methods = useForm<PostListingFormValues | EditListingFormValues>({
    resolver: zodResolver(isEditMode ? editListingSchema : postListingSchema),
    mode: 'onBlur',
    reValidateMode: 'onChange',
    defaultValues: buildDefaultValues(pickupAddressDefault),
  })

  const {
    control,
    handleSubmit,
    register,
    setValue,
    reset,
    trigger,
    formState: { errors, isSubmitting, isValid },
  } = methods

  const watched = useWatch({ control })
  const availablePresets = useMemo(() => getAvailableDatetimePresets(), [])

  useEffect(() => {
    if (!isEditMode || !editListingId) {
      return
    }

    let cancelled = false

    const loadListing = async () => {
      setLoadingListing(true)
      try {
        const listing = await listingService.getListing(editListingId)
        if (cancelled) return

        if (!canEditListing(listing)) {
          toast.info(postListingContent.edit.notEditable)
          navigate(donorListingManagePath(listing._id), { replace: true })
          return
        }

        setExistingPhotoUrl(listing.photos[0])
        setUnitOverridden(true)
        reset({
          foodType: listing.foodType,
          quantity: listing.quantity,
          quantityUnit: listing.quantityUnit,
          expiresAt: toDatetimeLocalValue(new Date(listing.expiresAt)),
          storageCondition: listing.storageCondition,
          foodLabels: listing.foodLabels,
          pickupAddress: listing.pickupAddress ?? pickupAddressDefault,
          pickupInstructions: listing.pickupInstructions ?? '',
        })
      } catch {
        if (cancelled) return
        toast.error(postListingContent.edit.toast.error)
        navigate(ROUTES.DONOR_LISTINGS, { replace: true })
      } finally {
        if (!cancelled) {
          setLoadingListing(false)
        }
      }
    }

    void loadListing()

    return () => {
      cancelled = true
    }
  }, [editListingId, isEditMode, navigate, pickupAddressDefault, reset])

  useEffect(() => {
    const observers: IntersectionObserver[] = []

    sectionOrder.forEach((sectionId) => {
      const element = document.getElementById(sectionId)
      if (!element) return

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry?.isIntersecting) {
            setActiveSectionId(sectionId)
          }
        },
        { rootMargin: '-30% 0px -55% 0px', threshold: 0 },
      )

      observer.observe(element)
      observers.push(observer)
    })

    return () => {
      observers.forEach((observer) => observer.disconnect())
    }
  }, [])

  const stepCompletion = useMemo(() => {
    return {
      [POST_LISTING_SECTION_ID.WHAT]: Boolean(
        watched.foodType &&
          (watched.quantity ?? 0) > 0 &&
          watched.quantityUnit &&
          (watched.photo || (isEditMode && existingPhotoUrl)),
      ),
      [POST_LISTING_SECTION_ID.SAFETY]: Boolean(
        watched.expiresAt && watched.storageCondition,
      ),
      [POST_LISTING_SECTION_ID.PICKUP]: Boolean(watched.pickupAddress?.trim()),
    }
  }, [watched, isEditMode, existingPhotoUrl])

  const steps: PostListingStep[] = [
    {
      id: POST_LISTING_SECTION_ID.WHAT,
      label: postListingContent.steps.what,
      completed: stepCompletion[POST_LISTING_SECTION_ID.WHAT],
    },
    {
      id: POST_LISTING_SECTION_ID.SAFETY,
      label: postListingContent.steps.safety,
      completed: stepCompletion[POST_LISTING_SECTION_ID.SAFETY],
    },
    {
      id: POST_LISTING_SECTION_ID.PICKUP,
      label: postListingContent.steps.pickup,
      completed: stepCompletion[POST_LISTING_SECTION_ID.PICKUP],
    },
  ]

  const scrollToSection = useCallback((sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })
  }, [])

  const handleFoodTypeChange = (foodType: FoodType) => {
    setValue('foodType', foodType, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    })
    if (!unitOverridden) {
      setValue('quantityUnit', UNIT_BY_FOOD_TYPE[foodType], {
        shouldDirty: true,
      })
    }
  }

  const handleQuantityUnitChange = (unit: QuantityUnit) => {
    setUnitOverridden(true)
    setValue('quantityUnit', unit, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    })
  }

  const handlePresetSelect = (presetId: DatetimePresetId, at: Date) => {
    setSelectedPresetId(presetId)
    setValue('expiresAt', toDatetimeLocalValue(at), {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    })
  }

  const handleExpiresAtManualChange = (value: string) => {
    setSelectedPresetId(null)
    setValue('expiresAt', value, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    })
  }

  const toggleFoodLabel = (label: FoodLabel, checked: boolean) => {
    const current = watched.foodLabels ?? []
    const next = checked
      ? [...current, label]
      : current.filter((item) => item !== label)
    setValue('foodLabels', next, { shouldDirty: true })
  }

  const onSubmit = handleSubmit(
    async (values) => {
      if (isEditMode && editListingId) {
        const payload: UpdateListingPayload = {
          foodType: values.foodType,
          quantity: values.quantity,
          quantityUnit: values.quantityUnit,
          expiresAt: new Date(values.expiresAt).toISOString(),
          storageCondition: values.storageCondition,
          foodLabels: values.foodLabels,
          pickupAddress: values.pickupAddress.trim(),
          pickupInstructions: values.pickupInstructions?.trim() || undefined,
        }

        if (values.photo) {
          payload.photo = values.photo
        }

        const updatePromise = listingService.updateListing(editListingId, payload)

        try {
          void toast.promise(updatePromise, {
            loading: postListingContent.edit.toast.saving,
            success: postListingContent.edit.toast.success,
            error: postListingContent.edit.toast.error,
          })

          const result = await updatePromise

          if (result.geocodeResolved === false) {
            toast.warning(geocodeContent.addressSavedNoMapWarning)
          }

          navigate(donorListingManagePath(editListingId))
        } catch {
          // toast.promise surfaces the error
        }

        return
      }

      const payload: CreateListingPayload = {
        foodType: values.foodType,
        quantity: values.quantity,
        quantityUnit: values.quantityUnit,
        // TODO: multi-photo later — schema supports an array; v1 allows one photo
        photos: [values.photo as File],
        expiresAt: new Date(values.expiresAt).toISOString(),
        storageCondition: values.storageCondition,
        foodLabels: values.foodLabels,
        pickupAddress: values.pickupAddress.trim(),
        pickupInstructions: values.pickupInstructions?.trim() || undefined,
      }

      const createPromise = listingService.createListing(payload)

      try {
        void toast.promise(createPromise, {
          loading: postListingContent.toast.publishing,
          success: postListingContent.toast.success,
          error: postListingContent.toast.error,
        })

        const { listing: createdListing, geocodeResolved } = await createPromise

        if (!geocodeResolved) {
          toast.warning(geocodeContent.addressSavedNoMapWarning)
        }

        setUnitOverridden(false)
        setSelectedPresetId(null)
        reset(buildDefaultValues(pickupAddressDefault))
        navigate(ROUTES.DONOR_LISTINGS, {
          state: {
            [MY_LISTINGS_LOCATION_STATE.CREATED_LISTING]: createdListing,
          },
        })
      } catch {
        // toast.promise surfaces the error
      }
    },
    async () => {
      await trigger()
    },
  )

  const canSubmit = isValid && !isSubmitting && !actionsBlocked

  if (state.status !== 'authed') {
    return null
  }

  if (loadingListing) {
    return (
      <p className="text-body text-sm">{postListingContent.edit.toast.saving}</p>
    )
  }

  return (
    <div className="mx-auto w-full max-w-3xl">
      {isEditMode && editListingId ? (
        <Link
          to={donorListingManagePath(editListingId)}
          className="text-body hover:text-primary mb-6 inline-flex items-center gap-1 text-sm font-medium transition-colors"
        >
          <ArrowLeft aria-hidden="true" className="size-4" />
          {postListingContent.edit.backToManage}
        </Link>
      ) : null}

      <header className="mb-8">
        <h1 className="text-charcoal font-display mb-6 text-2xl font-bold sm:text-3xl">
          {isEditMode
            ? postListingContent.edit.pageTitle
            : postListingContent.pageTitle}
        </h1>
        <PostListingStepper
          steps={steps}
          activeStepId={activeSectionId}
          onStepClick={scrollToSection}
        />
      </header>

      <FormProvider {...methods}>
        <form onSubmit={onSubmit} noValidate className="flex flex-col gap-10">
          <section
            id={POST_LISTING_SECTION_ID.WHAT}
            className="scroll-mt-24 border-border rounded-2xl border bg-white p-5 sm:p-6"
          >
            <SectionHeader
              icon={Utensils}
              title={postListingContent.sections.what.title}
            />

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(12rem,14rem)]">
              <div className="flex flex-col gap-6">
                <Controller
                  name="foodType"
                  control={control}
                  render={({ field }) => (
                    <div onBlur={field.onBlur}>
                      <SingleSelectPills
                        name="foodType"
                        label={postListingContent.sections.what.foodType}
                        options={FOOD_TYPE_VALUES}
                        value={field.value}
                        onChange={handleFoodTypeChange}
                        getLabel={(value) =>
                          postListingContent.foodTypeLabels[value]
                        }
                        error={errors.foodType?.message}
                      />
                    </div>
                  )}
                />

                <div className="flex flex-col gap-2">
                  <span className="text-charcoal text-sm font-medium">
                    {postListingContent.sections.what.quantity}
                  </span>
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
                    <div className="flex-1">
                      <input
                        type="number"
                        min={1}
                        step={1}
                        aria-invalid={Boolean(errors.quantity)}
                        className={cn(
                          'border-border text-charcoal w-full rounded-lg border bg-white px-3 py-2.5 text-sm',
                          'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
                          errors.quantity && 'border-clay-red',
                        )}
                        {...register('quantity', { valueAsNumber: true })}
                      />
                      {errors.quantity ? (
                        <p className="text-clay-red mt-1 text-sm">
                          {errors.quantity.message}
                        </p>
                      ) : null}
                    </div>
                    <div className="relative sm:w-40">
                      <label htmlFor="quantityUnit" className="sr-only">
                        {postListingContent.sections.what.unit}
                      </label>
                      <select
                        id="quantityUnit"
                        value={watched.quantityUnit ?? ''}
                        onChange={(event) =>
                          handleQuantityUnitChange(
                            event.target.value as QuantityUnit,
                          )
                        }
                        className={cn(
                          'border-border text-charcoal w-full appearance-none rounded-lg border bg-white py-2.5 pr-10 pl-3 text-sm',
                          'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
                          errors.quantityUnit && 'border-clay-red',
                        )}
                      >
                        {QUANTITY_UNIT_VALUES.map((unit) => (
                          <option key={unit} value={unit}>
                            {postListingContent.quantityUnitLabels[unit]}
                          </option>
                        ))}
                      </select>
                      <ChevronDown
                        aria-hidden="true"
                        className="text-body pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2"
                      />
                      {errors.quantityUnit ? (
                        <p className="text-clay-red mt-1 text-sm">
                          {errors.quantityUnit.message}
                        </p>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>

              <Controller
                name="photo"
                control={control}
                render={({ field }) => (
                  <div onBlur={field.onBlur}>
                    <ListingPhotoUpload
                      value={field.value}
                      onChange={(file) => {
                        field.onChange(file)
                        field.onBlur()
                      }}
                      error={errors.photo?.message}
                      existingPhotoUrl={isEditMode ? existingPhotoUrl : undefined}
                    />
                  </div>
                )}
              />
            </div>
          </section>

          <section
            id={POST_LISTING_SECTION_ID.SAFETY}
            className="scroll-mt-24 border-border rounded-2xl border bg-white p-5 sm:p-6"
          >
            <SectionHeader
              icon={Timer}
              title={postListingContent.sections.safety.title}
            />

            <div className="flex flex-col gap-6">
              <fieldset className="m-0 min-w-0 border-0 p-0">
                <legend className="text-charcoal mb-2 block w-full text-sm font-medium">
                  {postListingContent.sections.safety.availableUntil}
                </legend>
                <div className="flex flex-wrap gap-2">
                  {availablePresets.map((preset) => {
                    const selected = selectedPresetId === preset.id
                    return (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() =>
                          handlePresetSelect(preset.id, preset.at)
                        }
                        className={cn(
                          'rounded-full border px-4 py-2 text-sm font-medium transition-colors',
                          selected
                            ? 'border-primary bg-primary text-white'
                            : 'border-border text-charcoal bg-white hover:border-primary/40',
                        )}
                      >
                        {presetLabel(preset.id)}
                      </button>
                    )
                  })}
                </div>
                <input
                  type="datetime-local"
                  value={watched.expiresAt ?? ''}
                  onChange={(event) =>
                    handleExpiresAtManualChange(event.target.value)
                  }
                  onBlur={() => {
                    void trigger('expiresAt')
                  }}
                  aria-invalid={Boolean(errors.expiresAt)}
                  className={cn(
                    'border-border text-charcoal mt-2 w-full rounded-lg border bg-white px-3 py-2.5 text-sm',
                    'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
                    errors.expiresAt && 'border-clay-red',
                  )}
                />
                {errors.expiresAt ? (
                  <p className="text-clay-red text-sm">
                    {errors.expiresAt.message}
                  </p>
                ) : null}
              </fieldset>

              <Controller
                name="storageCondition"
                control={control}
                render={({ field }) => (
                  <div onBlur={field.onBlur}>
                    <SingleSelectPills
                      name="storageCondition"
                      label={postListingContent.sections.safety.storage}
                      options={STORAGE_CONDITION_VALUES}
                      value={field.value}
                      onChange={(value) => {
                        field.onChange(value as StorageCondition)
                        field.onBlur()
                      }}
                      getLabel={(value) =>
                        postListingContent.storageLabels[value]
                      }
                      error={errors.storageCondition?.message}
                    />
                  </div>
                )}
              />

              <fieldset className="m-0 min-w-0 border-0 p-0">
                <legend className="text-charcoal mb-2 block w-full text-sm font-medium">
                  {postListingContent.sections.safety.foodLabels}
                </legend>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {FOOD_LABEL_VALUES.map((label) => (
                    <Checkbox
                      key={label}
                      name={`foodLabel-${label}`}
                      label={postListingContent.foodLabelLabels[label]}
                      checked={watched.foodLabels?.includes(label) ?? false}
                      onChange={(event) =>
                        toggleFoodLabel(label, event.target.checked)
                      }
                    />
                  ))}
                </div>
              </fieldset>

              <InfoBanner variant="neutral">
                {postListingContent.sections.safety.expiryBanner}
              </InfoBanner>
            </div>
          </section>

          <section
            id={POST_LISTING_SECTION_ID.PICKUP}
            className="scroll-mt-24 border-border rounded-2xl border bg-white p-5 sm:p-6"
          >
            <SectionHeader
              icon={MapPin}
              title={postListingContent.sections.pickup.title}
            />

            <div className="flex flex-col gap-6">
              <TextField
                name="pickupAddress"
                label={postListingContent.sections.pickup.location}
                placeholder={postListingContent.sections.pickup.locationPlaceholder}
              />
              <TextAreaField
                name="pickupInstructions"
                label={postListingContent.sections.pickup.instructions}
                placeholder={
                  postListingContent.sections.pickup.instructionsPlaceholder
                }
              />
            </div>
          </section>

          <ListingReviewSummary values={watched} />

          <div className="flex flex-col gap-3">
            <ParticipantActionButton
              type="submit"
              size="lg"
              disabled={!canSubmit}
              className="w-full"
            >
              {isEditMode
                ? postListingContent.edit.submit
                : postListingContent.submit.publish}
            </ParticipantActionButton>
            <p className="text-body flex items-start justify-center gap-2 text-center text-sm">
              <Sparkles
                aria-hidden="true"
                className="text-primary mt-0.5 size-4 shrink-0"
              />
              {isEditMode
                ? postListingContent.edit.note
                : postListingContent.submit.note}
            </p>
          </div>
        </form>
      </FormProvider>
    </div>
  )
}
