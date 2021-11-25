const debug = require('debug')
import * as http from 'http'
const nodemon = require('nodemon')
import Server from './app'
import 'reflect-metadata'
debug('ts-express:server')

Server.set('port', process.env.PORT || 4000)

Server.use((err: Error, req: any, res: any, next: any) => {
  console.error('Error: ', err.message)
  res.status((err as any).statusCode || 500).json({ error: err.message })
})

const server = http.createServer(Server)

server.listen(process.env.PORT || 4000, onListening)
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
  console.log(`🚀  Server ready, listening on port ${process.env.PORT || 4000}`)
}

function onError(error: NodeJS.ErrnoException): void {
  if (error.syscall !== 'listen') {
    throw error
  }

  const bind = 'Port ' + process.env.PORT || 4000
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
