import mongoose from 'mongoose'
import { config } from './env.js'

export async function connectDatabase(): Promise<void> {
  try {
    mongoose.set('strictQuery', true)

    await mongoose.connect(config.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
    })

    console.info('MongoDB connected')
  } catch (error) {
    console.error('MongoDB connection failed')
    if (error instanceof Error) {
      console.error(error.message)
    }
    process.exit(1)
  }
}

export async function disconnectDatabase(): Promise<void> {
  await mongoose.disconnect()
  console.info('MongoDB disconnected')
}
