import { config } from './env.js'
import { NotificationError } from '../utils/notification-error.js'

const BREVO_SEND_EMAIL_URL = 'https://api.brevo.com/v3/smtp/email'

export type BrevoEmailRecipient = { email: string; name?: string }

export type SendEmailInput = {
  to: string | BrevoEmailRecipient[]
  subject: string
  html: string
  text: string
  tags?: string[]
}

type BrevoSendEmailResponse = { messageId?: string }

function normalizeRecipients(to: SendEmailInput['to']): BrevoEmailRecipient[] {
  if (typeof to === 'string') return [{ email: to }]
  return to
}

export async function sendEmail(input: SendEmailInput): Promise<{ messageId: string }> {
  const payload = {
    sender: {
      name: config.EMAIL_FROM_NAME,
      email: config.EMAIL_FROM_ADDRESS,
    },
    to: normalizeRecipients(input.to),
    subject: input.subject,
    htmlContent: input.html,
    textContent: input.text,
    tags: input.tags,
  }

  let response: Response
  try {
    response = await fetch(BREVO_SEND_EMAIL_URL, {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        'api-key': config.BREVO_API_KEY,
      },
      body: JSON.stringify(payload),
    })
  } catch {
    throw new NotificationError('Failed to reach email provider')
  }

  if (response.ok) {
    const data = (await response.json().catch(() => ({}))) as BrevoSendEmailResponse
    const messageId = data.messageId ?? response.headers.get('x-message-id') ?? ''
    return { messageId }
  }

  const errorBody = await response.json().catch(() => ({}))
  const providerMessage =
    typeof errorBody === 'object' &&
    errorBody !== null &&
    'message' in errorBody &&
    typeof (errorBody as { message?: unknown }).message === 'string'
      ? (errorBody as { message: string }).message
      : 'Email provider request failed'

  throw new NotificationError(providerMessage, {
    provider: 'brevo',
    statusCode: response.status,
  })
}

