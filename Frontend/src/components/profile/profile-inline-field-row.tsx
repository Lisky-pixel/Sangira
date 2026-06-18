import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '../ui/button'
import type { ProfileFieldKey } from '../../constants/profile'
import { ApiError } from '../../services/api-error'
import { profileService } from '../../services/profile-service'
import { toast } from '../../lib/toast'
import { donorProfileContent } from '../../placeholder/donor-profile-content'
import { cn } from '../../lib/utils'
import {
  contactNameSchema,
  organisationNameSchema,
  profileAddressSchema,
  profilePhoneSchema,
} from '../../features/profile/profile-field-schemas'
import type { z } from 'zod'

const schemaByField = {
  organisationName: organisationNameSchema,
  contactName: contactNameSchema,
  phone: profilePhoneSchema,
  address: profileAddressSchema,
} as const

type ProfileFieldFormValues = {
  [K in ProfileFieldKey]: z.infer<(typeof schemaByField)[K]>
}

type ProfileInlineFieldRowProps = {
  label: string
  fieldName: ProfileFieldKey
  displayValue: string
  defaultValue: string
  onSaved: () => Promise<void>
}

export function ProfileInlineFieldRow({
  label,
  fieldName,
  displayValue,
  defaultValue,
  onSaved,
}: ProfileInlineFieldRowProps) {
  const [editing, setEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const schema = schemaByField[fieldName]

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileFieldFormValues[typeof fieldName]>({
    resolver: zodResolver(schema),
    defaultValues: { [fieldName]: defaultValue } as ProfileFieldFormValues[typeof fieldName],
  })

  const fieldError = errors[fieldName as keyof typeof errors]

  const startEditing = () => {
    reset({ [fieldName]: defaultValue } as ProfileFieldFormValues[typeof fieldName])
    setEditing(true)
  }

  const cancelEditing = () => {
    setEditing(false)
    reset({ [fieldName]: defaultValue } as ProfileFieldFormValues[typeof fieldName])
  }

  const onSubmit = handleSubmit(async (values) => {
    const nextValue = String(values[fieldName as keyof typeof values] ?? '').trim()
    if (nextValue === defaultValue.trim()) {
      setEditing(false)
      return
    }

    setIsSaving(true)
    try {
      await profileService.patchField(fieldName, nextValue)
      await onSaved()
      toast.success(donorProfileContent.toast.fieldSaved)
      setEditing(false)
    } catch (error) {
      if (error instanceof ApiError && error.code === 'PHONE_EXISTS') {
        toast.error(donorProfileContent.toast.phoneTaken)
      } else {
        toast.error(donorProfileContent.toast.fieldError)
      }
    } finally {
      setIsSaving(false)
    }
  })

  return (
    <div className="border-border flex flex-col gap-3 border-t py-4 first:border-t-0 first:pt-0 last:pb-0 sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0 flex-1">
        <p className="text-body text-xs font-medium tracking-wide uppercase">
          {label}
        </p>

        {editing ? (
          <form onSubmit={onSubmit} className="mt-2 flex flex-col gap-3">
            <label htmlFor={`profile-field-${fieldName}`} className="sr-only">
              {label}
            </label>
            <input
              id={`profile-field-${fieldName}`}
              className={cn(
                'border-border text-charcoal w-full rounded-lg border bg-white px-3 py-2.5 text-sm',
                'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
                fieldError && 'border-clay-red',
              )}
              {...register(fieldName)}
            />
            {fieldError ? (
              <p className="text-clay-red text-sm">
                {String(fieldError.message ?? '')}
              </p>
            ) : null}
            <div className="flex flex-wrap gap-2">
              <Button type="submit" size="default" disabled={isSaving}>
                {donorProfileContent.inlineEdit.save}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="default"
                disabled={isSaving}
                onClick={cancelEditing}
              >
                {donorProfileContent.inlineEdit.cancel}
              </Button>
            </div>
          </form>
        ) : (
          <p className="text-charcoal mt-1 text-sm font-semibold">{displayValue}</p>
        )}
      </div>

      {!editing ? (
        <button
          type="button"
          onClick={startEditing}
          className="text-primary shrink-0 text-sm font-medium hover:underline"
        >
          {donorProfileContent.inlineEdit.edit}
        </button>
      ) : null}
    </div>
  )
}
