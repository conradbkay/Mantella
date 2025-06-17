import { createApp } from './app'
import { db } from './db/db'
import { createUser } from './db/user'
import { createProject } from './db/project'
import { addUserToProject } from './db/project'
import request from 'supertest'
import { Express } from 'express'

export const createTestApp = () => {
  return createApp()
}

export const setupTestDatabase = async () => {
  // in-memory db is created when NODE_ENV is 'test'
  await clearTestDatabase()
}

export const teardownTestDatabase = () => {
  // in-memory so no need to do anything
}

export const clearTestDatabase = async () => {
  const tables = await db.introspection.getTables()
  for (const table of tables) {
    if (table.name.startsWith('sqlite_')) continue
    await db.deleteFrom(table.name as any).execute()
  }
}

let userCounter = 0
// Helper function to create authenticated user session
export async function createAuthenticatedAgentAndProject(app: Express) {
  const agent = request.agent(app)
  userCounter++
  const userData = {
    email: `testuser${userCounter}@example.com`,
    username: `testuser${userCounter}`,
    password: 'password123'
  }

  const user = await createUser(userData)
  const project = await createProject({
    name: 'Test Project',
    ownerId: user.id!
  })
  await addUserToProject(project.id!, user.id!)

  await agent
    .post('/api/login')
    .send({ ...userData, persist: true })
    .expect(200)

  return { agent, user, project }
}
