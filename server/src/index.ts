import express, { Express, NextFunction, Request, Response } from 'express'
import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import path from 'path'
import cors from 'cors'
import { router } from './routes/router'
import { connect, disconnect } from 'mongoose'
import passport from 'passport'
import { deserializeUser, passportStrategy, serializeUser } from './passport'
import { Strategy } from 'passport-local'
import session from 'express-session'
import { v4 as uuid } from 'uuid'
import 'reflect-metadata'

const debug = require('debug')
const throng = require('throng')
const FileStore = require('session-file-store')(session)
const compression = require('compression')

require('dotenv').config() // Injects .env variables into process.env object
// eslint-disable-next-line import/first

debug('ts-express:server')

function onListening(id: any): void {
  console.log(
    `🚀 ${process.env.NODE_ENV} worker ${id} ready, listening on port ${
      process.env.PORT || 4000
    }`
  )
}

const master = () => {
  ;(async () => await connect(process.env.DB_CONNECT as string))()

  process.once('beforeExit', async () => {
    await disconnect()
  })
}

const start = (id: any, disconnect: () => void) => {
  process.on('SIGINT', () => {
    console.log(`Worker ${id} exiting`)
    disconnect()
  })

  process.on('SIGTERM', () => {
    console.log(`Worker ${id} exiting`)
    disconnect()
  })

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

  app.use(morgan('dev'))
  app.use(express.json())
  app.use(cookieParser(process.env.PRIVATE))
  app.use(express.urlencoded({ extended: true }))
  const WEEK_IN_SECONDS = 60 * 60 * 24 * 7
  app.use(
    session({
      secret: process.env.PRIVATE || 'test',
      resave: true,
      saveUninitialized: true,
      genid: () => {
        return uuid()
      },
      store: new FileStore({ ttl: WEEK_IN_SECONDS })
    })
  )

  // test env mocks mongodb
  if (process.env.NODE_ENV !== 'test') {
    ;(async () => await connect(process.env.DB_CONNECT as string))()
  }

  app.use(compression())

  app.use(passport.initialize())
  app.use(passport.session())
  passport.use(new Strategy({ usernameField: 'email' }, passportStrategy))

  passport.serializeUser(serializeUser)
  passport.deserializeUser(deserializeUser)

  app.use(router)

  const serveClient = () => {
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

    app.get('/*', redirectionFilter)

    app.use(express.static(path.resolve(__dirname, '../../client/build')))

    app.get('/*', function (req, res) {
      res.sendFile(path.resolve(__dirname, '../../client/build', 'index.html'))
    })
  }

  if (process.env.NODE_ENV === 'production') {
    serveClient()
  }

  app.use((err: Error, req: any, res: any, next: any) => {
    console.error('Error: ', err.message)
    res.status((err as any).statusCode || 500).json({ error: err.message })
  })

  app.listen(process.env.PORT || 4000, () => onListening(id))
}

var WORKERS = process.env.WEB_CONCURRENCY || 1

throng({
  worker: start,
  master: master,
  lifeTime: Infinity,
  count: WORKERS,
  signals: ['SIGTERM', 'SIGINT']
})
