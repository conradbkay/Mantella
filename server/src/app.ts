import express, { Express } from 'express'
import * as bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import path from 'path'
import cors from 'cors'
import { router } from './routes/router'
import { connect } from 'mongoose'
import passport from 'passport'
import { passportStrategy } from './passport'
import { Strategy } from 'passport-local'
import session from 'express-session'
import { UserModel } from './models/User'

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
app.use(bodyParser.json())
app.use(cookieParser(process.env.PRIVATE))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(
  session({
    secret: process.env.SECRET || 'test',
    resave: true,
    saveUninitialized: true
  })
)

if (process.env.NODE_ENV !== 'test') {
  ;(async () => await connect(process.env.DB_CONNECT as string))()
}
app.use(passport.initialize())
app.use(passport.session())
passport.use(new Strategy(passportStrategy))

passport.serializeUser((user: any, done) => {
  done(null, user.id)
})

passport.deserializeUser(async (id, done) => {
  try {
    const user = await UserModel.findOne({ id })
    done(null, user)
  } catch (err) {
    done(err)
  }
})

app.use(router)

app.use(express.static(path.join(__dirname, '/../../client/build')))

export default app
