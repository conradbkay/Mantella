import { test, describe } from 'node:test'
import assert from 'node:assert'
import { db } from './db'

describe('SQLite Database', () => {
  describe('Database Connection', () => {
    test('should connect to database', async () => {
      const result = await db.selectFrom('users').selectAll().execute()
      assert.ok(Array.isArray(result), 'Should return an array')
    })

    test('should have all required tables', async () => {
      // Test table existence by trying to select from each table
      const expectedTables = [
        'users',
        'projects',
        'projectUsers',
        'lists',
        'tasks',
        'taskAssignments'
      ]

      for (const tableName of expectedTables) {
        try {
          await db
            .selectFrom(tableName as any)
            .selectAll()
            .limit(1)
            .execute()
        } catch (error) {
          assert.fail(
            `Table ${tableName} should exist and be queryable: ${error}`
          )
        }
      }
    })
  })

  describe('Users Table', () => {
    test('should insert and retrieve user', async () => {
      const testUser = {
        id: 'user-' + Date.now() + '-1',
        username: 'testuser',
        email: 'test-' + Date.now() + '@example.com',
        password: 'testpass',
        profileImg: 'test.jpg'
      }

      await db.insertInto('users').values(testUser).execute()

      const retrieved = await db
        .selectFrom('users')
        .selectAll()
        .where('id', '=', testUser.id)
        .executeTakeFirst()

      assert.ok(retrieved, 'User should be retrieved')
      assert.strictEqual(retrieved!.username, testUser.username)
      assert.strictEqual(retrieved!.email, testUser.email)
    })

    test('should enforce unique email constraint', async () => {
      const timestamp = Date.now()
      const sharedEmail = 'shared-' + timestamp + '@example.com'

      const user1 = {
        id: 'user-' + timestamp + '-unique1',
        username: 'user1',
        email: sharedEmail,
        password: 'pass1'
      }

      const user2 = {
        id: 'user-' + timestamp + '-unique2',
        username: 'user2',
        email: sharedEmail,
        password: 'pass2'
      }

      await db.insertInto('users').values(user1).execute()

      await assert.rejects(
        async () => {
          await db.insertInto('users').values(user2).execute()
        },
        /UNIQUE constraint failed/,
        'Should reject duplicate email'
      )
    })

    test('should handle guest users', async () => {
      const timestamp = Date.now()
      const guestUser = {
        id: 'guest-' + timestamp,
        username: 'Guest User',
        email: 'guest-' + timestamp + '@example.com',
        password: null as string | null
      }

      await db.insertInto('users').values(guestUser).execute()

      const retrieved = await db
        .selectFrom('users')
        .selectAll()
        .where('id', '=', guestUser.id)
        .executeTakeFirst()

      assert.strictEqual(retrieved?.password, null)
    })
  })

  describe('Projects Table', () => {
    test('should insert and retrieve project', async () => {
      const timestamp = Date.now()

      // First create a user
      const user = {
        id: 'owner-' + timestamp,
        username: 'owner',
        email: 'owner-' + timestamp + '@example.com',
        password: 'pass'
      }
      await db.insertInto('users').values(user).execute()

      const testProject = {
        id: 'project-' + timestamp,
        name: 'Test Project',
        ownerId: user.id,
        colors: JSON.stringify(['#FF0000', '#00FF00']),
        securityPublic: 0,
        data: JSON.stringify({ key: 'value' })
      }

      await db.insertInto('projects').values(testProject).execute()

      const retrieved = await db
        .selectFrom('projects')
        .selectAll()
        .where('id', '=', testProject.id)
        .executeTakeFirst()

      assert.ok(retrieved, 'Project should be retrieved')
      assert.strictEqual(retrieved!.name, testProject.name)
      assert.strictEqual(retrieved!.ownerId, testProject.ownerId)
      assert.ok(retrieved!.securityPublic === 0)
    })

    test('should cascade delete when owner is deleted', async () => {
      const timestamp = Date.now()

      // Create user and project
      const user = {
        id: 'owner-cascade-' + timestamp,
        username: 'owner',
        email: 'owner-cascade-' + timestamp + '@example.com',
        password: 'pass'
      }
      await db.insertInto('users').values(user).execute()

      const project = {
        id: 'project-cascade-' + timestamp,
        name: 'Test Project',
        ownerId: user.id
      }
      await db.insertInto('projects').values(project).execute()

      // Delete the user
      await db.deleteFrom('users').where('id', '=', user.id).execute()

      // Project should be deleted too
      const remainingProject = await db
        .selectFrom('projects')
        .selectAll()
        .where('id', '=', project.id)
        .executeTakeFirst()

      assert.strictEqual(
        remainingProject,
        undefined,
        'Project should be cascade deleted'
      )
    })
  })

  describe('Task System', () => {
    test('should create and link tasks to projects and lists', async () => {
      const timestamp = Date.now()

      // Create user
      const user = {
        id: 'task-user-' + timestamp,
        username: 'taskuser',
        email: 'task-' + timestamp + '@example.com',
        password: 'pass'
      }
      await db.insertInto('users').values(user).execute()

      // Create project
      const project = {
        id: 'task-project-' + timestamp,
        name: 'Task Project',
        ownerId: user.id
      }
      await db.insertInto('projects').values(project).execute()

      // Create list
      const list = {
        id: 'task-list-' + timestamp,
        projectId: project.id,
        name: 'To Do',
        orderIndex: 0
      }
      await db.insertInto('lists').values(list).execute()

      // Create task
      const task = {
        id: 'test-task-' + timestamp,
        projectId: project.id,
        name: 'Test Task',
        description: 'A test task',
        points: 5,
        color: '#FF0000',
        workedOnMs: 0,
        securityPublic: 1,
        securityAssignedUsers: JSON.stringify([])
      }
      await db.insertInto('tasks').values(task).execute()

      // Create task position
      const taskPosition = {
        taskId: task.id,
        listId: list.id,
        columnIndex: 0,
        positionIndex: 0
      }
      await db.insertInto('taskPositions').values(taskPosition).execute()

      const retrievedTask = await db
        .selectFrom('tasks')
        .selectAll()
        .where('id', '=', task.id)
        .executeTakeFirst()

      const retrievedPosition = await db
        .selectFrom('taskPositions')
        .selectAll()
        .where('taskId', '=', task.id)
        .executeTakeFirst()

      assert.ok(retrievedTask, 'Task should be retrieved')
      assert.ok(retrievedPosition, 'Task position should be retrieved')
      assert.strictEqual(retrievedPosition!.listId, list.id)
    })
  })
})
