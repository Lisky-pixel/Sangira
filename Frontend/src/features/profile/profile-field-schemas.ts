import { z } from 'zod'
import { isValidRwandanMobile } from '../../constants/phone'
import { donorProfileContent } from '../../placeholder/donor-profile-content'
import { PROFILE_FIELD } from '../../constants/profile'

export const organisationNameSchema = z.object({
  [PROFILE_FIELD.ORGANISATION_NAME]: z
    .string()
    .trim()
    .min(2, donorProfileContent.toast.fieldError),
})

export const contactNameSchema = z.object({
  [PROFILE_FIELD.CONTACT_NAME]: z
    .string()
    .trim()
    .min(1, donorProfileContent.toast.fieldError),
})

export const profilePhoneSchema = z.object({
  [PROFILE_FIELD.PHONE]: z
    .string()
    .trim()
    .refine(isValidRwandanMobile, donorProfileContent.toast.fieldError),
})

export const profileAddressSchema = z.object({
  [PROFILE_FIELD.ADDRESS]: z
    .string()
    .trim()
    .min(1, donorProfileContent.toast.fieldError),
})
