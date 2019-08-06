import debug from 'debug'
import * as http from 'http'
const nodemon = require('nodemon')
import Server from './server'
import { Response, NextFunction } from 'express'
import 'reflect-metadata'
debug('ts-express:server')

/* set port */

function purifyProjectPort(val: number | string): number | string | boolean {
  return typeof val === 'string' ? parseInt(val, 10) : val
}

const port = purifyProjectPort(process.env.PORT || 4000)

Server.set('port', port)

Server.use((err: Error, req: any, res: Response, next: NextFunction) => {
  console.error('Throwing an Error: ', err.message) // Log error message in our server's console
  res.status((err as any).statusCode || 500).json({ error: err.message })
})

/* create server */
const server = http.createServer(Server)

server.listen(port, onListening)
server.on('error', onError)
process.on('SIGINT', () => {
  console.log('Bye bye!')
  process.exit()
})

process.on('exit', (code) => {
  nodemon.emit('quit')
  process.exit(code)
})

function onListening(): void {
  const addr = server.address()

  console.log(
    `🚀  Server ready, listening on port ${
      typeof addr === 'string' && addr !== null ? addr : addr.port.toString()
    }`
  )
}

/** error handling */

function onError(error: NodeJS.ErrnoException): void {
  if (error.syscall !== 'listen') {
    throw error
  }

  const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port
  switch (error.code) {
    case 'EACCES':
      console.error(`BEEP BOOP: ${bind} requires elevated privileges`)
      process.exit(1)
      break
    case 'EADDRINUSE':
      console.error(`BEEP BOOP: ${bind} is already in use`)
      process.exit(1)
      break
    default:
      throw error
  }
}
