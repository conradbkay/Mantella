import express, { Express /*NextFunction, Request, Response*/ } from 'express'
import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import path from 'path'
import cors from 'cors'
import { router } from './routes/router'
import { connect, disconnect, set } from 'mongoose'
import passport from 'passport'
import { deserializeUser, passportStrategy, serializeUser } from './passport'
import { Strategy } from 'passport-local'
import session from 'express-session'
import { v4 as uuid } from 'uuid'
import 'reflect-metadata'
import http from 'http'
import { ChatModel } from './models/Chat'

const debug = require('debug')
const FileStore = require('session-file-store')(session)
const compression = require('compression')
const { Server } = require('socket.io')

require('dotenv').config() // Injects .env variables into process.env object
// eslint-disable-next-line import/first

debug('ts-express:server')

function onListening(): void {
  console.log(
    `🚀 ${process.env.NODE_ENV} worker ready, listening on port ${
      process.env.PORT || 4000
    }`
  )
}

process.on('exit', (code) => {
  disconnect()
})

process
  .on('unhandledRejection', (reason, p) => {
    // Use your own logger here
    console.error(reason, 'Unhandled Rejection at Promise', p)
  })
  .on('uncaughtException', (err) => {
    console.error(err, 'Uncaught Exception thrown')
  })

const app: Express = express()

app.use(
  cors({
    credentials: true,
    origin: (origin, callback) => {
      return callback(null, true)
    }
  })
)

const server = http.createServer()

const io = new Server(server)

io.on('connection', (socket: any) => {
  socket.on('send_message', async ({ chatId, message, userId }: any) => {
    const messageObj = {
      message,
      senderId: userId,
      createdAt: new Date().getTime(),
      id: uuid()
    }

    io.in(chatId).emit('message', messageObj)
    // save to project

    const chat = await ChatModel.findOne({ id: chatId })

    if (chat) {
      chat.messages.push(messageObj)
      await chat.save()
    }
  })

  socket.on('login', ({ chatId }: any) => {
    socket.join(chatId)
  })
})

server.listen(3000, () => {
  console.log('websocket listening on port 3000')
})

app.use(morgan('dev'))
app.use(express.json())
app.use(cookieParser(process.env.PRIVATE))
app.use(express.urlencoded({ extended: true }))
const WEEK_IN_SECONDS = 60 * 60 * 24 * 7
app.use(
  session({
    secret: process.env.PRIVATE || 'test',
    resave: true,
    saveUninitialized: false,
    genid: () => {
      return uuid()
    },
    store: new FileStore({ ttl: WEEK_IN_SECONDS })
  })
)

// test env mocks mongodb
if (process.env.NODE_ENV !== 'test') {
  ;(async () => {
    set('strictQuery', true)
    await connect(process.env.DB_CONNECT as string)
    console.log('MongoDB connected')
  })()
}

app.use(compression())

app.use(passport.initialize())
app.use(passport.session())
passport.use(
  new Strategy(
    { usernameField: 'email', passReqToCallback: true },
    passportStrategy
  )
)

passport.serializeUser(serializeUser)
passport.deserializeUser(deserializeUser)

app.use('/api/', router)
/*
  const redirectionFilter = (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    if (req.get('X-Forwarded-Proto') === 'http') {
      const redirectTo = `https://${req.hostname}${req.url}`
      res.redirect(301, redirectTo)
    } else {
      next()
    }
  }

  app.get('/*', redirectionFilter)*/
app.use(express.static(path.join(__dirname, '../../client/build')))

app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, '../../client/build', 'index.html'))
})

app.use((err: Error, req: any, res: any, next: any) => {
  console.error('Error: ', err)
  res.status((err as any).statusCode || 500).json({ error: err.message })
})

app.listen(process.env.PORT || 4000, () => onListening())
