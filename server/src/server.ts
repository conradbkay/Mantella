import express, { Express } from 'express'
import * as bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
const morgan = require('morgan')
import path from 'path'
import jwt from 'express-jwt'
import cors from 'cors'
import { router } from './routes/router'
import { connect } from 'mongoose'

require('dotenv').config()
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
;(async () => await connect(process.env.DB_CONNECT as string))()

const auth = jwt({
  secret: process.env.PRIVATE as string,
  credentialsRequired: false,
  algorithms: ['RS256']
})

app.use(auth)
app.use(router)

app.use(express.static(path.join(__dirname, '/../../client/build')))

export default app
