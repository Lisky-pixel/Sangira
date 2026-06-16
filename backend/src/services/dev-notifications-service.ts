import { sendEmail } from '../notifications/index.js'
import type { DevNotificationsTestInput } from '../validators/dev-notifications.js'

const DEFAULT_TEST_SUBJECT = 'Sangira test email'
const DEFAULT_TEST_MESSAGE =
  'This is a test email from the Sangira dev notifications endpoint.'

export async function sendTestEmail(input: DevNotificationsTestInput) {
  const subject = input.subject ?? DEFAULT_TEST_SUBJECT
  const message = input.message ?? DEFAULT_TEST_MESSAGE

  const { messageId } = await sendEmail({
    to: input.to,
    subject,
    html: `<p>${message}</p>`,
    text: message,
    tags: ['dev', 'test'],
  })

  return { messageId }
}

