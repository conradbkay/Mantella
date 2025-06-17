import express, { Express, NextFunction, Request, Response } from 'express'
import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import path from 'path'
import cors from 'cors'
import { router } from './routes/router'
import passport from 'passport'
import { deserializeUser, passportStrategy, serializeUser } from './passport'
import { Strategy } from 'passport-local'
import session from 'express-session'
import { sqlite } from './db/db'

const SqliteStore = require('better-sqlite3-session-store')(session)
const compression = require('compression')

export const createApp = (): Express => {
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

  if (process.env.NODE_ENV === 'production') {
    app.set('trust proxy', 1) // heroku, maybe not still needed?
  }

  app.use(
    session({
      secret: process.env.PRIVATE || 'test',
      resave: false,
      saveUninitialized: false,
      name: 'Mantella',
      cookie: {
        sameSite: 'lax',
        secure: 'auto',
        httpOnly: process.env.NODE_ENV === 'production',
        maxAge: 1000 * 60 * 60 * 24 * 7
      },
      store: new SqliteStore({
        client: sqlite,
        expired: {
          clear: true,
          intervalMs: 900000 // 15 minutes
        }
      })
    })
  )

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

  app.get(/(.*)/, redirectionFilter)

  app.use(express.static(path.resolve(__dirname, '../dist')))

  app.get(/(.*)/, function (req, res) {
    res.sendFile(path.resolve(__dirname, '../dist/index.html'))
  })

  app.use((err: Error, req: any, res: any, next: any) => {
    console.error('Error: ', err)
    res.status((err as any).statusCode || 500).json({ error: err.message })
  })

  return app
}
