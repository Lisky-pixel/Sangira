import { AppError } from './app-error.js'

export class NotificationError extends AppError {
  readonly provider: 'brevo'

  constructor(message: string, opts?: { provider?: 'brevo'; statusCode?: number }) {
    super(message, opts?.statusCode ?? 502, 'NOTIFICATION_FAILED')
    this.provider = opts?.provider ?? 'brevo'
    Object.setPrototypeOf(this, NotificationError.prototype)
  }
}

