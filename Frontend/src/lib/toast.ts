import { toast as sonnerToast } from 'sonner'

type ToastPromiseMessages<T> = {
  loading: string
  success: string | ((data: T) => string)
  error: string | ((error: unknown) => string)
}

type ToastErrorOptions = {
  action?: {
    label: string
    onClick: () => void
  }
}

export const toast = {
  success(message: string, options?: { id?: string | number }) {
    return sonnerToast.success(message, options)
  },

  error(message: string, options?: ToastErrorOptions & { id?: string | number }) {
    return sonnerToast.error(message, options)
  },

  info(message: string, options?: { id?: string | number }) {
    return sonnerToast.info(message, options)
  },

  loading(message: string) {
    return sonnerToast.loading(message)
  },

  promise<T>(promise: Promise<T>, messages: ToastPromiseMessages<T>) {
    return sonnerToast.promise(promise, messages)
  },
}
