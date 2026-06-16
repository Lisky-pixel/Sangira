import axios, {
  type AxiosError,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios'
import type { ApiEnvelope } from '../types/api'
import { ApiError } from './api-error'

const baseURL = import.meta.env.VITE_API_URL

if (!baseURL) {
  throw new Error('VITE_API_URL is not defined. Copy .env.example to .env.')
}

const MUTATING_METHODS = new Set(['post', 'put', 'patch', 'delete'])
const CSRF_HEADER = 'x-csrf-token'

type RequestConfig = InternalAxiosRequestConfig & {
  skipAuthRefresh?: boolean
  skipCsrf?: boolean
  _authRetry?: boolean
  _csrfRetry?: boolean
}

let csrfToken: string | null = null
let csrfPromise: Promise<string> | null = null

let isRefreshing = false
let refreshQueue: Array<{
  resolve: () => void
  reject: (error: unknown) => void
}> = []

let onAuthFailure: (() => void) | null = null

export function setAuthFailureHandler(handler: (() => void) | null) {
  onAuthFailure = handler
}

export function clearCsrfToken() {
  csrfToken = null
}

async function fetchCsrfToken(): Promise<string> {
  const response = await axios.get<ApiEnvelope<{ csrfToken: string }>>(
    '/auth/csrf',
    {
      baseURL,
      withCredentials: true,
    },
  )

  const body = response.data

  if (!body.success) {
    throw ApiError.fromEnvelope(body, response.status)
  }

  csrfToken = body.data.csrfToken
  return csrfToken
}

export async function ensureCsrfToken(): Promise<string> {
  if (csrfToken) {
    return csrfToken
  }

  if (!csrfPromise) {
    csrfPromise = fetchCsrfToken()
      .catch((error) => {
        csrfToken = null
        throw error
      })
      .finally(() => {
        csrfPromise = null
      })
  }

  return csrfPromise
}

function isApiEnvelope(value: unknown): value is ApiEnvelope<unknown> {
  return (
    typeof value === 'object' &&
    value !== null &&
    'success' in value &&
    typeof (value as { success: unknown }).success === 'boolean'
  )
}

function normalizeAxiosError(error: AxiosError<ApiEnvelope<unknown>>): ApiError {
  const responseData = error.response?.data

  if (responseData && isApiEnvelope(responseData) && !responseData.success) {
    return ApiError.fromEnvelope(responseData, error.response?.status)
  }

  if (error.message) {
    return new ApiError(error.message, 'NETWORK_ERROR', {
      status: error.response?.status,
    })
  }

  return new ApiError('Request failed', 'NETWORK_ERROR', {
    status: error.response?.status,
  })
}

function flushRefreshQueue(error?: unknown) {
  const queue = refreshQueue
  refreshQueue = []

  if (error) {
    queue.forEach(({ reject }) => reject(error))
    return
  }

  queue.forEach(({ resolve }) => resolve())
}

function shouldAttemptRefresh(config: RequestConfig, error: AxiosError) {
  if (config.skipAuthRefresh || config._authRetry) {
    return false
  }

  if (error.response?.status !== 401) {
    return false
  }

  const url = config.url ?? ''

  return (
    !url.includes('/auth/login') &&
    !url.includes('/auth/refresh') &&
    !url.includes('/auth/me')
  )
}

export const apiClient = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.request.use(async (config) => {
  const requestConfig = config as RequestConfig
  const method = requestConfig.method?.toLowerCase()

  if (method && MUTATING_METHODS.has(method) && !requestConfig.skipCsrf) {
    const token = await ensureCsrfToken()
    requestConfig.headers.set(CSRF_HEADER, token)
  }

  if (requestConfig.data instanceof FormData) {
    requestConfig.headers.delete('Content-Type')
  }

  return requestConfig
})

apiClient.interceptors.response.use(
  (response: AxiosResponse<ApiEnvelope<unknown>>) => {
    const body = response.data

    if (isApiEnvelope(body) && !body.success) {
      throw ApiError.fromEnvelope(body, response.status)
    }

    return response
  },
  async (error: AxiosError<ApiEnvelope<unknown>>) => {
    const config = error.config as RequestConfig | undefined

    if (!config) {
      throw normalizeAxiosError(error)
    }

    const responseData = error.response?.data

    if (
      error.response?.status === 403 &&
      responseData &&
      isApiEnvelope(responseData) &&
      !responseData.success &&
      responseData.error.code === 'CSRF_INVALID' &&
      !config._csrfRetry
    ) {
      config._csrfRetry = true
      clearCsrfToken()
      await ensureCsrfToken()
      return apiClient(config)
    }

    if (shouldAttemptRefresh(config, error)) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          refreshQueue.push({
            resolve: () => resolve(apiClient(config)),
            reject,
          })
        })
      }

      isRefreshing = true
      config._authRetry = true

      try {
        await apiClient.post('/auth/refresh', {}, { skipAuthRefresh: true })
        flushRefreshQueue()
        return apiClient(config)
      } catch (refreshError) {
        flushRefreshQueue(refreshError)
        clearCsrfToken()
        onAuthFailure?.()
        throw normalizeAxiosError(refreshError as AxiosError<ApiEnvelope<unknown>>)
      } finally {
        isRefreshing = false
      }
    }

    throw normalizeAxiosError(error)
  },
)

declare module 'axios' {
  export interface AxiosRequestConfig {
    skipAuthRefresh?: boolean
    skipCsrf?: boolean
  }
}
