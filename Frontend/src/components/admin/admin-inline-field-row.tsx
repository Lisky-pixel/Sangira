import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import {
  ADMIN_PROFILE_FIELD,
  type AdminProfileFieldKey,
} from '../../constants/admin-profile'
import { isValidRwandanMobile } from '../../constants/phone'
import { adminProfileContent } from '../../placeholder/admin-profile-content'
import { adminProfileService } from '../../services/admin-profile-service'
import { ApiError } from '../../services/api-error'
import { toast } from '../../lib/toast'
import { cn } from '../../lib/utils'
import { Button } from '../ui/button'

const schemaByField = {
  [ADMIN_PROFILE_FIELD.NAME]: z.object({
    name: z.string().trim().min(2, adminProfileContent.toast.fieldError),
  }),
  [ADMIN_PROFILE_FIELD.PHONE]: z.object({
    phone: z
      .string()
      .trim()
      .refine(
        (value) => value === '' || isValidRwandanMobile(value),
        adminProfileContent.toast.fieldError,
      ),
  }),
} as const

type AdminInlineFieldRowProps = {
  label: string
  fieldName: AdminProfileFieldKey
  displayValue: string
  defaultValue: string
  onSaved: (profile: Awaited<ReturnType<typeof adminProfileService.patchField>>) => void
}

export function AdminInlineFieldRow({
  label,
  fieldName,
  displayValue,
  defaultValue,
  onSaved,
}: AdminInlineFieldRowProps) {
  const [editing, setEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const schema = schemaByField[fieldName]

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { [fieldName]: defaultValue } as z.infer<typeof schema>,
  })

  const fieldError = errors[fieldName as keyof typeof errors]

  const startEditing = () => {
    reset({ [fieldName]: defaultValue } as z.infer<typeof schema>)
    setEditing(true)
  }

  const cancelEditing = () => {
    setEditing(false)
    reset({ [fieldName]: defaultValue } as z.infer<typeof schema>)
  }

  const onSubmit = handleSubmit(async (values) => {
    const nextValue = String(values[fieldName as keyof typeof values] ?? '').trim()
    if (nextValue === defaultValue.trim()) {
      setEditing(false)
      return
    }

    setIsSaving(true)
    try {
      const profile = await adminProfileService.patchField(fieldName, nextValue)
      onSaved(profile)
      toast.success(adminProfileContent.toast.fieldSaved)
      setEditing(false)
    } catch (error) {
      if (error instanceof ApiError && error.code === 'PHONE_EXISTS') {
        toast.error(adminProfileContent.toast.phoneTaken)
      } else {
        toast.error(adminProfileContent.toast.fieldError)
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
            <label htmlFor={`admin-field-${fieldName}`} className="sr-only">
              {label}
            </label>
            <input
              id={`admin-field-${fieldName}`}
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
              <Button type="submit" disabled={isSaving}>
                {adminProfileContent.inlineEdit.save}
              </Button>
              <Button
                type="button"
                variant="outline"
                disabled={isSaving}
                onClick={cancelEditing}
              >
                {adminProfileContent.inlineEdit.cancel}
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
          {adminProfileContent.inlineEdit.edit}
        </button>
      ) : null}
    </div>
  )
}
