import { closeDatabase } from './db/db'
import 'reflect-metadata'
import { createApp } from './app'

require('dotenv').config()

const debug = require('debug')

debug('ts-express:server')

function onListening(): void {
  console.log(
    `🚀 ${process.env.NODE_ENV} worker ready, listening on port ${
      process.env.PORT || 4000
    }`
  )
}

process.on('exit', (code) => {
  closeDatabase()
})

process
  .on('unhandledRejection', (reason, p) => {
    // Use your own logger here
    console.error(reason, 'Unhandled Rejection at Promise', p)
  })
  .on('uncaughtException', (err) => {
    console.error(err, 'Uncaught Exception thrown')
  })

const app = createApp()
export { app }

app.listen(process.env.PORT || 4000, () => onListening())
