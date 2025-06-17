import { test, describe, before, after } from 'node:test'
import assert from 'node:assert'
import supertest from 'supertest'
import { app } from '../index'
import { createDatabase, closeDatabase } from '../db/db'

describe('List Routes', () => {
  let db: any
  let agent: supertest.SuperTest<supertest.Test>
  let user: any
  let project: any

  before(async () => {
    const { db: testDb } = createDatabase({ inMemory: true })
    db = testDb

    // Setup app
    const testApp = app
    agent = supertest(testApp)

    // Create a user and a project for testing
    await agent.post('/api/register').send({
      email: 'list-test@example.com',
      password: 'password',
      username: 'list-tester'
    })
    const loginResponse = await agent.post('/api/login').send({
      email: 'list-test@example.com',
      password: 'password'
    })
    user = loginResponse.body.user

    const projectResponse = await agent
      .post('/api/createProject')
      .send({ name: 'Test Project for Lists' })
      .expect(200)
    project = projectResponse.body.project
  })

  after(async () => {
    await closeDatabase()
  })

  test('POST /api/createList should create a new list', async () => {
    const response = await agent
      .post('/api/createList')
      .send({
        projId: project.id,
        name: 'New Test List'
      })
      .expect(200)

    const { project: updatedProject, list } = response.body
    assert.ok(list, 'Should return the new list')
    assert.strictEqual(list.name, 'New Test List')
    assert.strictEqual(updatedProject.lists.length, project.lists.length + 1)
  })

  test('POST /api/editList should update a list', async () => {
    const listToEdit = project.lists[0]
    const newName = 'Updated List Name'

    const response = await agent
      .post('/api/editList')
      .send({
        projId: project.id,
        listId: listToEdit.id,
        newList: { name: newName }
      })
      .expect(200)

    const { project: updatedProject, list } = response.body
    assert.ok(list, 'Should return the updated list')
    assert.strictEqual(list.name, newName)
    assert.strictEqual(
      updatedProject.lists.find((l: any) => l.id === listToEdit.id).name,
      newName
    )
  })

  test('POST /api/deleteList should delete a list', async () => {
    const listToDelete = project.lists[0]

    const response = await agent
      .post('/api/deleteList')
      .send({
        projId: project.id,
        id: listToDelete.id
      })
      .expect(200)

    const { project: updatedProject } = response.body
    assert.strictEqual(
      updatedProject.lists.find((l: any) => l.id === listToDelete.id),
      undefined
    )
  })

  test('POST /api/setListIdx should reorder lists', async () => {
    // Create a couple more lists to reorder
    await agent
      .post('/api/createList')
      .send({ projId: project.id, name: 'List A' })
    await agent
      .post('/api/createList')
      .send({ projId: project.id, name: 'List B' })

    const getProjectResponse = await agent
      .post('/api/getProjectById')
      .send({ id: project.id })
      .expect(200)

    const originalLists = getProjectResponse.body.project.lists
    const listOrder = originalLists.map((l: any) => l.id).reverse()

    const response = await agent
      .post('/api/setListIdx')
      .send({
        projectId: project.id,
        listOrder
      })
      .expect(200)

    const { project: updatedProject } = response.body
    const updatedListIds = updatedProject.lists.map((l: any) => l.id)
    assert.deepStrictEqual(
      updatedListIds,
      listOrder,
      'Lists should be reordered'
    )
  })
})
