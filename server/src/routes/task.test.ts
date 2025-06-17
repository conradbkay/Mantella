import { test, describe } from 'node:test'
import assert from 'node:assert'
import { createApp } from '../app'
import { createAuthenticatedAgentAndProject } from '../testUtils'
import { Task } from '../db/project'
import { getFullProject } from '../db/toApi'

describe('Task Routes', async () => {
  const app = createApp()
  const { agent, project, user } = await createAuthenticatedAgentAndProject(app)
  let task: Task

  const fullProject = await getFullProject(project.id)

  test('POST /api/createTask should create a new task', async () => {
    const response = await agent
      .post('/api/createTask')
      .send({
        projId: project.id,
        listId: fullProject.lists[0].id,
        taskInfo: { name: 'Another Test Task' }
      })
      .expect(200)

    const { task: newTask } = response.body
    assert.ok(newTask, 'Should return the new task')
    assert.strictEqual(newTask.name, 'Another Test Task')
    task = newTask
  })

  test('POST /api/editTask should update a task', async () => {
    const newName = 'Updated Task Name'
    const response = await agent
      .post('/api/editTask')
      .send({
        projId: project.id,
        taskId: task.id,
        task: { ...task, name: newName }
      })
      .expect(200)

    const { task: updatedTask } = response.body
    assert.ok(updatedTask, 'Should return the updated task')
    assert.strictEqual(updatedTask.name, newName)
  })

  test('POST /api/deleteTask should delete a task', async () => {
    await agent
      .post('/api/deleteTask')
      .send({
        projId: project.id,
        id: task.id
      })
      .expect(200)

    const getProjectResponse = await agent
      .post('/api/getProjectById')
      .send({ id: project.id })
      .expect(200)

    const updatedProject = getProjectResponse.body.project
    assert.strictEqual(
      updatedProject.tasks.find((t: any) => t.id === task.id),
      undefined
    )
  })

  test('POST /api/dragTask should move a task', async () => {
    // Create another list to move the task to
    const listResponse = await agent
      .post('/api/createList')
      .send({ projId: project.id, name: 'Done' })
      .expect(200)
    const toList = listResponse.body.list

    const response = await agent
      .post('/api/dragTask')
      .send({
        projectId: project.id,
        taskId: task.id,
        toListId: toList.id,
        toProgress: 2, // 'Done'
        toIdx: 0
      })
      .expect(200)

    const { project: updatedProject } = response.body
    const movedTask = updatedProject.tasks.find((t: any) => t.id === task.id)
    assert.strictEqual(movedTask.progress, 2)
  })

  test('POST /api/setSubtask should create and update a subtask', async () => {
    const subtaskId = 'subtask-1'
    // Create
    await agent
      .post('/api/setSubtask')
      .send({
        projId: project.id,
        taskId: task.id,
        subtaskId,
        info: { name: 'New Subtask', completed: false }
      })
      .expect(200)

    // Update
    await agent
      .post('/api/setSubtask')
      .send({
        projId: project.id,
        taskId: task.id,
        subtaskId,
        info: { name: 'Updated Subtask', completed: true }
      })
      .expect(200)

    const getProjectResponse = await agent
      .post('/api/getProjectById')
      .send({ id: project.id })
      .expect(200)
    const updatedTask = getProjectResponse.body.project.tasks.find(
      (t: any) => t.id === task.id
    )
    assert.strictEqual(updatedTask.subTasks.length, 1)
    assert.strictEqual(updatedTask.subTasks[0].name, 'Updated Subtask')
    assert.strictEqual(updatedTask.subTasks[0].completed, true)
  })

  test('POST /api/setComment should create and update a comment', async () => {
    const commentId = 'comment-1'
    // Create
    await agent
      .post('/api/setComment')
      .send({
        projId: project.id,
        taskId: task.id,
        commentId,
        description: 'New Comment'
      })
      .expect(200)

    // Update
    await agent
      .post('/api/setComment')
      .send({
        projId: project.id,
        taskId: task.id,
        commentId,
        description: 'Updated Comment'
      })
      .expect(200)

    const getProjectResponse = await agent
      .post('/api/getProjectById')
      .send({ id: project.id })
      .expect(200)
    const updatedTask = getProjectResponse.body.project.tasks.find(
      (t: any) => t.id === task.id
    )
    assert.strictEqual(updatedTask.comments.length, 1)
    assert.strictEqual(updatedTask.comments[0].comment, 'Updated Comment')
  })

  test('POST /api/assignUserToTask should assign a user to a task', async () => {
    await agent
      .post('/api/assignUserToTask')
      .send({
        projId: project.id,
        taskId: task.id,
        userId: user.id
      })
      .expect(200)

    const getProjectResponse = await agent
      .post('/api/getProjectById')
      .send({ id: project.id })
      .expect(200)
    const updatedTask = getProjectResponse.body.project.tasks.find(
      (t: any) => t.id === task.id
    )
    assert.ok(updatedTask.assignedTo.includes(user.id))
  })
})
