import passport from 'passport'
// ids must be mocked to access
jest.mock('uuid', () => {
  return () => 'MOCK_ID'
})

// TODO: for now
jest.mock('passport')
;(passport.authenticate as any).mockImplementation(
  (type: any) => (req: any, res: any, next: any) => next()
)

import request from 'supertest'
import mongoose from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'
let mongoServer: any
import app from '../app'
import { editProjectReqObj, loginReqObj, registerReqObj } from './types'

const connect = async () => {
  await mongoose.disconnect()

  mongoServer = await MongoMemoryServer.create()

  const mongoUri = await mongoServer.getUri()
  console.log(mongoUri)
  await mongoose.connect(mongoUri, {}, (err) => {
    if (err) {
      console.error(err)
    }
  })
}

const close = async () => {
  await Promise.all([mongoose.disconnect(), mongoServer.stop()])
}

const clear = async () => {
  const collections = mongoose.connection.collections

  let toDelete = []

  for (const key in collections) {
    toDelete.push(collections[key].deleteMany(null as any))
  }
  await Promise.all(toDelete)
}

beforeAll((done) => {
  connect().then(() => done())
})

afterAll((done) => {
  clear().then(() => close().then(() => done()))
})

const isObject = (obj: any) => {
  return typeof obj === 'object' && obj !== null
}

const stripIds = (obj: any) => {
  for (const key in obj) {
    if (isObject(obj[key])) {
      stripIds(obj[key])
    } else if (key === 'id' || key === '_id') {
      obj[key] = 'MOCK_ID'
    }
  }
  return obj
}

describe('Test utilities', () => {
  test('stripIds', () => {
    const TEST_OBJ = {
      id: '',
      elem: {
        id: ''
      }
    }
    expect(stripIds(TEST_OBJ)).toEqual({
      id: 'MOCK_ID',
      elem: {
        id: 'MOCK_ID'
      }
    })
  })
})

describe('Authentication', () => {
  const REGISTER_ROUTE = '/register'
  const REGISTER_DATA: registerReqObj = {
    email: 'test@gmail.com',
    username: 'testUsername',
    password: 'Password123'
  }

  test(REGISTER_ROUTE, async () => {
    const res = await request(app)
      .post(REGISTER_ROUTE)
      .send(REGISTER_DATA)
      .expect(200)
    const user = res.body.user
    expect(user.projects[0].name).toBe('Tutorial Project')
  })

  const LOGIN_ROUTE = '/login'
  const HAPPY_LOGIN_DATA: loginReqObj = {
    email: 'test@gmail.com',
    password: 'Password123'
  }

  test(LOGIN_ROUTE, async () => {
    await request(app).post(LOGIN_ROUTE).send(HAPPY_LOGIN_DATA).expect(200)

    await request(app)
      .post(LOGIN_ROUTE)
      .send({ ...HAPPY_LOGIN_DATA, password: 'wrong123' })
      .expect(500)
  })

  const GUEST_LOGIN_ROUTE = '/guestLogin'
  test(GUEST_LOGIN_ROUTE, async () => {
    const res = await request(app).post(GUEST_LOGIN_ROUTE).send().expect(200)
    const user = res.body.user
    expect(user.projects[0].name).toBe('Tutorial Project')
  })
})

describe('Projects', () => {
  const CREATE_PROJECT_ROUTE = '/createProject'
  test(CREATE_PROJECT_ROUTE, async () => {
    const res = await request(app)
      .post(CREATE_PROJECT_ROUTE)
      .send({ userId: 'MOCK_ID', name: 'MOCK_PROJECT' })
      .expect(200)
    expect(res.body.project.name).toBe('MOCK_PROJECT')
  })

  const EDIT_PROJECT_ROUTE = '/editProject'
  const HAPPY_EDIT_DATA: editProjectReqObj = {
    id: 'MOCK_ID',
    newProj: {
      name: 'NEW_MOCK_PROJECT'
    }
  }
  test(EDIT_PROJECT_ROUTE, async () => {
    const res = await request(app)
      .post(EDIT_PROJECT_ROUTE)
      .send(HAPPY_EDIT_DATA)
      .expect(200)
    expect(res.body.project.name).toBe('NEW_MOCK_PROJECT')
  })

  const DELETE_PROJECT_ROUTE = '/deleteProject'
  test(DELETE_PROJECT_ROUTE, async () => {
    const res = await request(app)
      .post(DELETE_PROJECT_ROUTE)
      .send({ id: 'MOCK_ID' })
      .expect(200)

    expect(res.body.id).toBe('MOCK_ID')
  })
})
