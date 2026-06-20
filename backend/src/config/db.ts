import mongoose from 'mongoose'
import { MONGO_READ_PREFERENCE_PRIMARY } from '../constants/mongo.js'
import { config } from './env.js'

export async function connectDatabase(): Promise<void> {
  try {
    mongoose.set('strictQuery', true)

    if (mongoose.connection.readyState !== mongoose.ConnectionStates.disconnected) {
      await mongoose.disconnect()
    }

    await mongoose.connect(config.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
      readPreference: MONGO_READ_PREFERENCE_PRIMARY,
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
