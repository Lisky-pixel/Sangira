import { createApp } from './app/index.js'
import { connectDatabase, disconnectDatabase } from './config/db.js'
import { config } from './config/env.js'
import './models/index.js'

async function bootstrap() {
  await connectDatabase()

  const app = createApp()

  const server = app.listen(config.PORT, () => {
    console.info(`Server listening on port ${config.PORT}`)
  })

  const shutdown = async (signal: string) => {
    console.info(`Received ${signal}, shutting down`)
    server.close(async () => {
      await disconnectDatabase()
      process.exit(0)
    })
  }

  process.on('SIGINT', () => void shutdown('SIGINT'))
  process.on('SIGTERM', () => void shutdown('SIGTERM'))
}

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled rejection:', reason)
})

process.on('uncaughtException', (error) => {
  console.error('Uncaught exception:', error)
  process.exit(1)
})

bootstrap().catch((error) => {
  console.error('Failed to start server')
  if (error instanceof Error) {
    console.error(error.message)
  }
  process.exit(1)
})
