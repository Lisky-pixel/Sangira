import axios from 'axios'

const baseURL = import.meta.env.VITE_API_URL

if (!baseURL) {
  throw new Error('VITE_API_URL is not defined. Copy .env.example to .env.')
}

export const apiClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
})
