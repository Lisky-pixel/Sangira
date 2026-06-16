import { sendEmail as sendBrevoEmail, type SendEmailInput } from '../config/brevo.js'
import { verificationCode } from './templates.js'

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

