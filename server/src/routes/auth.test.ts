import request from 'supertest'
import { test, describe, before, after, beforeEach, mock } from 'node:test'
import assert from 'node:assert'
import bcrypt from 'bcryptjs'
import { createApp } from '../app'
import {
  setupTestDatabase,
  teardownTestDatabase,
  clearTestDatabase,
  createAuthenticatedAgentAndProject
} from '../testUtils'
import { createUser } from '../db/user'

// Mock bcrypt for faster tests
mock.method(bcrypt, 'hash', async () => 'hashed_password')
mock.method(
  bcrypt,
  'compare',
  async (plain: string, hash: string) =>
    plain === 'password123' && hash === 'hashed_password'
)

describe('Authentication Routes', () => {
  let app: any
  let userCounter = 0

  before(async () => {
    app = createApp()
    await setupTestDatabase()
  })

  after(async () => {
    await teardownTestDatabase()
  })

  beforeEach(async () => {
    await clearTestDatabase()
  })

  async function createDbUser() {
    userCounter++
    const userData = {
      email: `testuser${userCounter}@example.com`,
      username: `testuser${userCounter}`,
      password: 'password123'
    }
    await createUser(userData)
    return userData
  }

  describe('POST /api/register', () => {
    test('should register new user successfully', async () => {
      const { user } = await createAuthenticatedAgentAndProject(app)

      assert.ok(user, 'Should return user object')
    })

    test('should reject registration with invalid email', async () => {
      const userData = {
        email: 'invalid-email',
        username: 'testuser',
        password: 'password123',
        persist: true
      }

      const agent = request.agent(app)
      const response = await agent
        .post('/api/register')
        .send(userData)
        .expect(400)

      assert.ok(response.body.error, 'Should return validation error')
      const error = JSON.parse(response.body.error)
      assert.strictEqual(error[0].message, 'Invalid email format')
    })

    test('should reject registration with short password', async () => {
      const userData = {
        email: 'test@example.com',
        username: 'testuser',
        password: '123',
        persist: true
      }

      const agent = request.agent(app)
      const response = await agent
        .post('/api/register')
        .send(userData)
        .expect(400)

      assert.ok(response.body.error, 'Should return validation error')
      const error = JSON.parse(response.body.error)
      assert.strictEqual(
        error[0].message,
        'Password must be at least 6 characters'
      )
    })

    test('should reject duplicate email registration', async () => {
      const userData = await createDbUser()

      const agent = request.agent(app)
      // Second registration with same email should fail
      const duplicateData = {
        ...userData,
        username: 'user2'
      }

      const response = await agent
        .post('/api/register')
        .send(duplicateData)
        .expect(500)

      assert.ok(response.body.error, 'Should return error for duplicate email')
      assert.match(
        response.body.error,
        /already in use/,
        'Error should mention email already in use'
      )
    })
  })

  describe('POST /api/login', () => {
    test('should login existing user successfully', async () => {
      const { user } = await createAuthenticatedAgentAndProject(app)

      // Then try to login
      const loginData = {
        email: user.email,
        password: 'password123',
        persist: true
      }

      const agent = request.agent(app)
      const response = await agent
        .post('/api/login')
        .send(loginData)
        .expect(200)

      assert.ok(response.body.user, 'Should return user object on login')
    })

    test('should reject login with invalid email format', async () => {
      const loginData = {
        email: 'invalid-email',
        password: 'password123',
        persist: true
      }

      const agent = request.agent(app)
      const response = await agent
        .post('/api/login')
        .send(loginData)
        .expect(400)

      assert.ok(response.body.error, 'Should return validation error')
    })

    test('should reject login with wrong password', async () => {
      const userData = await createDbUser()
      const loginData = {
        email: userData.email,
        password: 'wrongpassword',
        persist: true
      }

      const agent = request.agent(app)
      const response = await agent
        .post('/api/login')
        .send(loginData)
        .expect(401)
      assert.ok(response.body.error, 'Should return error for wrong password')
    })
  })

  describe('POST /api/guestLogin', () => {
    test('should create guest user successfully', async () => {
      const agent = request.agent(app)
      const response = await agent.post('/api/guestLogin').send().expect(200)

      assert.ok(response.body.user, 'Should return guest user object')
    })
  })

  describe('POST /api/logout', () => {
    test('should logout successfully', async () => {
      const agent = request.agent(app)
      const userData = await createDbUser()
      await agent
        .post('/api/login')
        .send({ ...userData })
        .expect(200)

      const response = await agent.post('/api/logout').send().expect(200)
      assert.strictEqual(response.body.message, 'Logged out')
    })
  })
})
