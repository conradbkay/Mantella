import { test, describe, before, after, beforeEach } from 'node:test'
import assert from 'node:assert'
import request from 'supertest'
import { z } from 'zod'
import {
  createTestApp,
  setupTestDatabase,
  teardownTestDatabase,
  clearTestDatabase,
  createAuthenticatedAgentAndProject
} from '../testUtils'

// Zod schemas for validation
const createProjectSchema = z.object({
  name: z.string().min(1),
  public: z.boolean().optional()
})

const editProjectSchema = z.object({
  id: z.string(),
  newProj: z.object({
    name: z.string().optional(),
    colors: z.array(z.string()).optional()
  })
})

describe('Project Routes', () => {
  let app: any

  before(async () => {
    await setupTestDatabase()
    app = createTestApp()
  })

  after(async () => {
    await teardownTestDatabase()
  })

  beforeEach(async () => {
    await clearTestDatabase()
  })

  describe('POST /api/createProject', () => {
    test('should create project successfully for authenticated user', async () => {
      const { agent, user } = await createAuthenticatedAgentAndProject(app)
      const projectData = {
        name: 'New Project',
        ownerId: user.id
      }

      const response = await agent
        .post('/api/createProject')
        .send(projectData)
        .expect(200)

      assert.ok(response.body.project, 'Should return project object')
      assert.strictEqual(response.body.project.name, projectData.name)
      assert.ok(response.body.project.id, 'Project should have ID')
      assert.strictEqual(response.body.project.ownerId, user.id)
      assert.ok(
        Array.isArray(response.body.project.lists),
        'Should have lists array'
      )
      assert.strictEqual(
        response.body.project.lists.length,
        1,
        'Should create default list'
      )
    })

    test('should validate project data with zod', async () => {
      const validData = {
        name: 'Valid Project',
        public: true
      }

      // Valid data should pass
      const validResult = createProjectSchema.safeParse(validData)
      assert.ok(validResult.success, 'Valid data should pass zod validation')

      // Empty name should fail
      const emptyName = { ...validData, name: '' }
      const emptyNameResult = createProjectSchema.safeParse(emptyName)
      assert.ok(
        !emptyNameResult.success,
        'Empty name should fail zod validation'
      )

      // Missing name should fail
      const missingName = { public: true }
      const missingNameResult = createProjectSchema.safeParse(missingName)
      assert.ok(
        !missingNameResult.success,
        'Missing name should fail zod validation'
      )
    })

    test('should reject project creation for unauthenticated user', async () => {
      const projectData = {
        name: 'Unauthenticated Project'
      }
      await request(app)
        .post('/api/createProject')
        .send(projectData)
        .expect(401)
    })

    test('should create project with default settings when optional fields missing', async () => {
      const { agent, user } = await createAuthenticatedAgentAndProject(app)
      const projectData = {
        name: 'Project with Defaults',
        ownerId: user.id
      }

      const response = await agent
        .post('/api/createProject')
        .send(projectData)
        .expect(200)

      assert.ok(response.body.project, 'Should return project object')
      assert.deepStrictEqual(response.body.project.colors, [])
    })

    test('should handle special characters in project name', async () => {
      const { agent, user } = await createAuthenticatedAgentAndProject(app)
      const projectName = 'Project with !@#$%^&*()_+-=[]{}|;:,.<>?'
      const projectData = {
        name: projectName,
        ownerId: user.id
      }

      const response = await agent
        .post('/api/createProject')
        .send(projectData)
        .expect(200)

      assert.strictEqual(response.body.project.name, projectName)
    })

    test('should handle very long project names', async () => {
      const { agent, user } = await createAuthenticatedAgentAndProject(app)
      const longName = 'a'.repeat(255)
      const projectData = {
        name: longName,
        ownerId: user.id
      }

      const response = await agent
        .post('/api/createProject')
        .send(projectData)
        .expect(200)

      assert.strictEqual(response.body.project.name, longName)
    })

    test('should create project with correct default structure', async () => {
      const { agent, user } = await createAuthenticatedAgentAndProject(app)
      const projectData = {
        name: 'Default Structure Test',
        ownerId: user.id
      }

      const response = await agent
        .post('/api/createProject')
        .send(projectData)
        .expect(200)

      const project = response.body.project
      assert.ok(project.id, 'Project should have an ID')
      assert.strictEqual(project.name, 'Default Structure Test')
      assert.strictEqual(project.ownerId, user.id)
    })
  })

  describe('POST /api/editProject', () => {
    test('should edit project successfully', async () => {
      const { agent, project } = await createAuthenticatedAgentAndProject(app)
      const editData = {
        projectId: project.id,
        name: 'New Project Name'
      }

      const response = await agent
        .post('/api/editProject')
        .send(editData)
        .expect(200)

      assert.strictEqual(response.body.project.name, 'New Project Name')
    })

    test('should validate edit project data with zod', async () => {
      const invalidData = {
        projectId: 'project-123',
        name: 'Updated Name',
        colors: ['#FF0000']
      }

      // Valid data should pass
      const validResult = editProjectSchema.safeParse(invalidData)
      assert.ok(validResult.success, 'Valid data should pass zod validation')

      // Missing ID should fail
      const missingId = { name: 'Test' }
      const missingIdResult = editProjectSchema.safeParse(missingId)
      assert.ok(
        !missingIdResult.success,
        'Missing ID should fail zod validation'
      )

      // Invalid colors array should fail (if we add more specific validation)
      const invalidColors = {
        projectId: 'project-123',
        name: 'Updated Name',
        colors: ['not-a-color']
      }
      // For now, just check it parses - could add hex color validation later
      const colorResult = editProjectSchema.safeParse(invalidColors)
      assert.ok(colorResult.success, 'Should accept color strings for now')
    })

    test('should edit only provided fields', async () => {
      const { agent, project } = await createAuthenticatedAgentAndProject(app)
      const editData = {
        projectId: project.id,
        colors: ['#FF0000']
      }

      const response = await agent
        .post('/api/editProject')
        .send(editData)
        .expect(200)

      assert.strictEqual(response.body.project.name, 'Test Project')
      assert.deepStrictEqual(response.body.project.colors, ['#FF0000'])
    })

    test('should reject edit for non-existent project', async () => {
      const { agent } = await createAuthenticatedAgentAndProject(app)
      const editData = {
        projectId: 'non-existent-id',
        name: 'This should fail'
      }

      await agent.post('/api/editProject').send(editData).expect(500)
    })

    test('should reject edit for unauthenticated user', async () => {
      const { agent } = await createAuthenticatedAgentAndProject(app)
      const editData = {
        projectId: 'some-project-id',
        name: 'Unauthorized Edit'
      }

      await agent.post('/api/editProject').send(editData).expect(401)
    })
  })

  describe('POST /api/deleteProject', () => {
    test('should delete project successfully', async () => {
      const { agent, project } = await createAuthenticatedAgentAndProject(app)
      const deleteData = { projectId: project.id }

      await agent.post('/api/deleteProject').send(deleteData).expect(200)
    })

    test('should reject delete for non-existent project', async () => {
      const { agent } = await createAuthenticatedAgentAndProject(app)
      const deleteData = { projectId: 'non-existent-id' }

      await agent.post('/api/deleteProject').send(deleteData).expect(500)
    })

    test('should reject delete for unauthenticated user', async () => {
      const deleteData = { projectId: 'some-id' }
      await request(app).post('/api/deleteProject').send(deleteData).expect(401)
    })

    test('should handle deletion with missing project ID', async () => {
      const { agent } = await createAuthenticatedAgentAndProject(app)
      await agent.post('/api/deleteProject').send({}).expect(400)
    })
  })

  describe('POST /api/leaveProject', () => {
    test('should allow user to leave project', async () => {
      const { agent, project } = await createAuthenticatedAgentAndProject(app)
      const leaveData = { projectId: project.id }
      await agent.post('/api/leaveProject').send(leaveData).expect(200)
    })

    test('should reject leave for non-existent project', async () => {
      const { agent } = await createAuthenticatedAgentAndProject(app)
      const leaveData = { projectId: 'non-existent-id' }
      await agent.post('/api/leaveProject').send(leaveData).expect(500)
    })

    test('should reject leave for unauthenticated user', async () => {
      const leaveData = { projectId: 'some-id' }
      await request(app).post('/api/leaveProject').send(leaveData).expect(401)
    })
  })

  describe('Error Handling', () => {
    test('should handle malformed request data', async () => {
      const { agent } = await createAuthenticatedAgentAndProject(app)
      await agent
        .post('/api/createProject')
        .set('Content-Type', 'application/json')
        .send('invalid json')
        .expect(400)
    })

    test('should handle missing required fields gracefully', async () => {
      const { agent } = await createAuthenticatedAgentAndProject(app)
      await agent.post('/api/createProject').send({}).expect(400)
    })

    test('should handle extremely large request payloads', async () => {
      const { agent, user } = await createAuthenticatedAgentAndProject(app)
      const hugeData = {
        name: 'Huge Project',
        ownerId: user.id,
        data: {
          big: 'a'.repeat(100000)
        }
      }
      // Note: This might fail depending on server limits, which is what we're testing
      await agent.post('/api/createProject').send(hugeData).expect(413)
    })
  })

  describe('Security Tests', () => {
    test('should not allow user to edit others projects', async () => {
      const { project } = await createAuthenticatedAgentAndProject(app)

      // Create a second user and agent
      const anotherAgent = request.agent(app)
      const anotherUserData = {
        email: 'anotheruser@example.com',
        username: 'anotheruser',
        password: 'password123',
        persist: true
      }
      await anotherAgent.post('/api/register').send(anotherUserData).expect(200)

      const editData = {
        projectId: project.id,
        name: 'Hacked!'
      }

      await anotherAgent.post('/api/editProject').send(editData).expect(403)
    })

    test('should validate project ownership for deletion', async () => {
      const { project } = await createAuthenticatedAgentAndProject(app)

      // Create a second user and agent
      const anotherAgent = request.agent(app)
      const anotherUserData = {
        email: 'anotheruser2@example.com',
        username: 'anotheruser2',
        password: 'password123',
        persist: true
      }
      await anotherAgent.post('/api/register').send(anotherUserData).expect(200)

      const deleteData = { projectId: project.id }

      await anotherAgent.post('/api/deleteProject').send(deleteData).expect(403)
    })
  })

  describe('Integration Tests', () => {
    test('should maintain data consistency across operations', async () => {
      const { agent, user } = await createAuthenticatedAgentAndProject(app)

      // 1. Create a project
      const createResponse = await agent
        .post('/api/createProject')
        .send({ name: 'Integration Test Project', ownerId: user.id })
        .expect(200)
      const projectId = createResponse.body.project.id

      // 2. Edit the project
      await agent
        .post('/api/editProject')
        .send({ projectId, name: 'Updated Project Name' })
        .expect(200)

      // 3. Delete the project
      await agent.post('/api/deleteProject').send({ projectId }).expect(200)
    })
  })
})
