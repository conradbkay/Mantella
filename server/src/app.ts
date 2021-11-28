import express, { Express } from 'express'
import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import path from 'path'
import cors from 'cors'
import { router } from './routes/router'
import { connect } from 'mongoose'
import passport from 'passport'
import { deserializeUser, passportStrategy, serializeUser } from './passport'
import { Strategy } from 'passport-local'
import session from 'express-session'
import uuid from 'uuid'

require('dotenv').config() // Injects .env variables into process.env object
const app: Express = express()

app.use(
  cors({
    credentials: true,
    origin: (origin, callback) => {
      return callback(null, true)
    }
  })
)

app.use(morgan(':method :status :response-time ms'))
app.use(express.json())
app.use(cookieParser(process.env.PRIVATE))
app.use(express.urlencoded({ extended: true }))
app.use(
  session({
    secret: process.env.SECRET || 'test',
    resave: true,
    saveUninitialized: true,
    genid: () => {
      return uuid()
    }
  })
)

if (process.env.NODE_ENV !== 'test') {
  ;(async () => await connect(process.env.DB_CONNECT as string))()
}
app.use(passport.initialize())
app.use(passport.session())
passport.use(new Strategy({ usernameField: 'email' }, passportStrategy))

passport.serializeUser(serializeUser)
passport.deserializeUser(deserializeUser)

app.use(router)

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '/../../client/build')))
}

export default app
