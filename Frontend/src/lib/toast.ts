import { toast as sonnerToast } from 'sonner'

type ToastPromiseMessages<T> = {
  loading: string
  success: string | ((data: T) => string)
  error: string | ((error: unknown) => string)
}

export const toast = {
  success(message: string) {
    return sonnerToast.success(message)
  },

  error(message: string) {
    return sonnerToast.error(message)
  },

  promise<T>(promise: Promise<T>, messages: ToastPromiseMessages<T>) {
    return sonnerToast.promise(promise, messages)
  },
}
