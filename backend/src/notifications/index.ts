import { sendEmail as sendBrevoEmail, type SendEmailInput } from '../config/brevo.js'
import {
  verificationApproved,
  verificationCode,
  verificationRejected,
} from './templates.js'

export { NotificationError } from '../utils/notification-error.js'

export async function sendEmail(input: SendEmailInput) {
  return sendBrevoEmail(input)
}

export async function sendVerificationCodeEmail(input: {
  to: string
  code: string
  organisationName: string
  ttlMinutes: number
}) {
  const template = verificationCode({
    code: input.code,
    organisationName: input.organisationName,
    ttlMinutes: input.ttlMinutes,
  })

  return sendEmail({
    to: input.to,
    subject: template.subject,
    html: template.html,
    text: template.text,
    tags: ['auth', 'verification-code'],
  })
}

export async function sendVerificationApprovedEmail(input: {
  to: string
  organisationName: string
}) {
  const template = verificationApproved({
    organisationName: input.organisationName,
  })

  return sendEmail({
    to: input.to,
    subject: template.subject,
    html: template.html,
    text: template.text,
    tags: ['verification', 'approved'],
  })
}

export async function sendVerificationRejectedEmail(input: {
  to: string
  organisationName: string
  reasonLabel: string
  details?: string
}) {
  const template = verificationRejected({
    organisationName: input.organisationName,
    reasonLabel: input.reasonLabel,
    details: input.details,
  })

  return sendEmail({
    to: input.to,
    subject: template.subject,
    html: template.html,
    text: template.text,
    tags: ['verification', 'rejected'],
  })
}

