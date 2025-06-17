import { db } from './db'
import { type DB } from '../shared/types-gen'
import { type Selectable, type Insertable, type Updateable } from 'kysely'
import { nanoid } from 'nanoid'
import { ApiList, ApiTask } from '../shared/types'

export interface CreateProjectInput {
  name: string
  ownerId: string
  colors?: string[]
  securityPublic?: boolean
}

// Use Kysely's generated types
export type Project = Selectable<DB['projects']>
export type NewProject = Insertable<DB['projects']>
export type ProjectUpdate = Updateable<DB['projects']>

export type Task = Selectable<DB['tasks']>
export type NewTask = Insertable<DB['tasks']>
export type TaskUpdate = Updateable<DB['tasks']>

// Create a new project
export async function createProject(
  projectData: CreateProjectInput
): Promise<Project> {
  const id = nanoid()
  const now = new Date().toISOString()

  const project = await db
    .insertInto('projects')
    .values({
      id,
      name: projectData.name,
      ownerId: projectData.ownerId,
      colors: JSON.stringify(projectData.colors || []),
      securityPublic: projectData.securityPublic ? 1 : 0,
      createdAt: now,
      updatedAt: now
    })
    .returningAll()
    .executeTakeFirstOrThrow()

  return project
}

// Find project by ID
export async function findProjectById(
  id: string
): Promise<Project | undefined> {
  return await db
    .selectFrom('projects')
    .selectAll()
    .where('id', '=', id)
    .executeTakeFirst()
}

// Find projects by user ID
export async function findProjectsByUserId(userId: string): Promise<Project[]> {
  return await db
    .selectFrom('projects')
    .innerJoin('projectUsers', 'projects.id', 'projectUsers.projectId')
    .selectAll('projects')
    .where('projectUsers.userId', '=', userId)
    .execute()
}

// Add user to project
export async function addUserToProject(
  projectId: string,
  userId: string
): Promise<void> {
  const existing = await db
    .selectFrom('projectUsers')
    .selectAll()
    .where('projectId', '=', projectId)
    .where('userId', '=', userId)
    .executeTakeFirst()

  if (existing) {
    return
  }
  await db
    .insertInto('projectUsers')
    .values({
      projectId,
      userId,
      createdAt: new Date().toISOString()
    })
    .execute()
}

// Get project tasks with extras
export async function getProjectTasks(projectId: string): Promise<ApiTask[]> {
  const tasks = await db
    .selectFrom('tasks')
    .selectAll()
    .where('projectId', '=', projectId)
    .execute()

  const tasksWithExtras: ApiTask[] = []

  for (const task of tasks) {
    // Get assigned users
    const assignments = await db
      .selectFrom('taskAssignments')
      .select('userId')
      .where('taskId', '=', task.id)
      .execute()

    // Get comments
    const comments = await db
      .selectFrom('comments')
      .selectAll()
      .where('taskId', '=', task.id)
      .orderBy('dateAdded', 'desc')
      .execute()

    // Get subtasks
    const subtasks = await db
      .selectFrom('subtasks')
      .selectAll()
      .where('taskId', '=', task.id)
      .orderBy('orderIndex', 'asc')
      .execute()

    tasksWithExtras.push({
      ...task,
      id: task.id!,
      assignedTo: assignments.map((a) => a.userId),
      comments: comments.map((c) => ({
        id: c.id!,
        comment: c.comment,
        dateAdded: c.dateAdded?.toString() || '',
        lastEdited: c.lastEdited?.toString() || undefined
      })),
      subTasks: subtasks.map((s) => ({
        id: s.id!,
        name: s.name,
        completed: Boolean(s.completed),
        orderIndex: s.orderIndex || 0
      }))
    })
  }

  return tasksWithExtras
}

// Get project lists
export async function getProjectLists(projectId: string): Promise<ApiList[]> {
  const lists = await db
    .selectFrom('lists')
    .selectAll()
    .where('projectId', '=', projectId)
    .orderBy('orderIndex', 'asc')
    .execute()

  if (lists.length === 0) {
    return []
  }

  const listIds = lists.map((list) => list.id)

  const taskPositions = await db
    .selectFrom('taskPositions')
    .select(['taskId', 'listId', 'columnIndex', 'positionIndex'])
    .where('listId', 'in', listIds)
    .orderBy('listId', 'asc')
    .orderBy('columnIndex', 'asc')
    .orderBy('positionIndex', 'asc')
    .execute()

  const listsWithTasks: ApiList[] = lists.map((list) => ({
    ...list,
    taskIds: [[], [], []] as string[][]
  }))

  const listMap = new Map<string, ApiList>(listsWithTasks.map((l) => [l.id, l]))

  for (const pos of taskPositions) {
    if (
      pos.columnIndex !== null &&
      pos.columnIndex >= 0 &&
      pos.columnIndex < 3 &&
      pos.positionIndex !== null
    ) {
      const list = listMap.get(pos.listId)
      if (list) {
        // Ensure the array is large enough for this position
        while (list.taskIds[pos.columnIndex].length <= pos.positionIndex) {
          list.taskIds[pos.columnIndex].push('')
        }
        list.taskIds[pos.columnIndex][pos.positionIndex] = pos.taskId
      }
    }
  }

  // Clean up any empty strings from the arrays
  listsWithTasks.forEach((list) => {
    list.taskIds.forEach((column) => {
      for (let i = column.length - 1; i >= 0; i--) {
        if (column[i] === '') {
          column.splice(i, 1)
        }
      }
    })
  })

  return listsWithTasks
}

// Create a list
export async function createList(
  projectId: string,
  name: string
): Promise<void> {
  const id = nanoid()
  const now = new Date().toISOString()
  const maxOrder = await db
    .selectFrom('lists')
    .select(db.fn.max('orderIndex').as('maxOrder'))
    .where('projectId', '=', projectId)
    .executeTakeFirst()

  await db
    .insertInto('lists')
    .values({
      id,
      projectId,
      name,
      orderIndex: (maxOrder?.maxOrder || 0) + 1,
      createdAt: now,
      updatedAt: now
    })
    .execute()
}

// Create a task
export async function createTask(
  projectId: string,
  taskData: Partial<NewTask>
): Promise<Task> {
  const id = nanoid()
  const now = new Date().toISOString()

  const task = await db
    .insertInto('tasks')
    .values({
      id,
      projectId,
      name: taskData.name || 'New Task',
      description: taskData.description || null,
      points: taskData.points || 0,
      color: taskData.color || '#ffffff',
      workedOnMs: taskData.workedOnMs || 0,
      createdAt: now,
      updatedAt: now
    })
    .returningAll()
    .executeTakeFirstOrThrow()

  return task
}

// Update a task
export async function updateTask(
  taskId: string,
  updates: Partial<TaskUpdate>
): Promise<Task> {
  const task = await db
    .updateTable('tasks')
    .set({
      ...updates,
      updatedAt: new Date().toISOString()
    })
    .where('id', '=', taskId)
    .returningAll()
    .executeTakeFirstOrThrow()

  return task
}

// Move task to different position/column
export async function moveTask(
  taskId: string,
  listId: string,
  columnIndex: number,
  positionIndex: number
): Promise<void> {
  await db
    .insertInto('taskPositions')
    .values({
      taskId,
      listId,
      columnIndex,
      positionIndex,
      updatedAt: new Date().toISOString()
    })
    .onConflict((oc) =>
      oc.column('taskId').doUpdateSet({
        listId,
        columnIndex,
        positionIndex,
        updatedAt: new Date().toISOString()
      })
    )
    .execute()
}

// Delete project
export async function deleteProject(id: string): Promise<void> {
  await db.deleteFrom('projects').where('id', '=', id).execute()
}

// Update project
export async function updateProject(
  id: string,
  updates: Partial<ProjectUpdate>
): Promise<Project> {
  const project = await db
    .updateTable('projects')
    .set({
      ...updates,
      updatedAt: new Date().toISOString()
    })
    .where('id', '=', id)
    .returningAll()
    .executeTakeFirstOrThrow()

  return project
}

// Create a complete project with default structure
export async function createProjectWithDefaults(
  projectData: CreateProjectInput,
  user: {
    id: string
    email: string
    username: string
    profileImg: string
  }
): Promise<any> {
  // Import generateDefaultProject here to avoid circular dependency issues
  const { generateDefaultProject, generateIds } = await import('../data')

  const [projectId] = generateIds(1)
  const defaultProjectStruct = generateDefaultProject(user, projectId)

  const { lists, tasks, history, security } = defaultProjectStruct

  const now = new Date().toISOString()

  // Create the project
  const newProject = await db
    .insertInto('projects')
    .values({
      id: projectId,
      name: projectData.name,
      ownerId: projectData.ownerId,
      colors: JSON.stringify(defaultProjectStruct.colors || []),
      securityPublic: defaultProjectStruct.security?.public ? 1 : 0,
      createdAt: now,
      updatedAt: now
    })
    .returningAll()
    .executeTakeFirstOrThrow()

  // Add owner to project
  await addUserToProject(newProject.id, projectData.ownerId)

  // Add lists
  const listPromises = lists.map(async (list: any) => {
    await db
      .insertInto('lists')
      .values({
        id: list.id!,
        projectId: newProject.id!,
        name: list.name,
        orderIndex: lists.indexOf(list),
        createdAt: now,
        updatedAt: now
      })
      .execute()
  })
  await Promise.all(listPromises)

  // Add tasks
  const taskPromises = tasks.map(async (task: any) => {
    const newTask = await db
      .insertInto('tasks')
      .values({
        id: task.id!,
        projectId: newProject.id!,
        name: task.name,
        description: task.description || null,
        points: task.points || 0,
        color: task.color || '#ffffff',
        workedOnMs: task.workedOnMs || 0,
        createdAt: now,
        updatedAt: now
      })
      .returningAll()
      .executeTakeFirstOrThrow()

    // Set task position
    let listId = lists[0]?.id
    let columnIndex = 0

    // Find which list and column this task belongs to
    for (const list of lists) {
      for (let colIdx = 0; colIdx < list.taskIds.length; colIdx++) {
        if (list.taskIds[colIdx].includes(task.id)) {
          listId = list.id
          columnIndex = colIdx
          break
        }
      }
    }

    if (listId) {
      const positionIndex =
        lists
          .find((l) => l.id === listId)
          ?.taskIds[columnIndex]?.indexOf(task.id) || 0

      await db
        .insertInto('taskPositions')
        .values({
          taskId: newTask.id,
          listId,
          columnIndex,
          positionIndex,
          updatedAt: now
        })
        .execute()
    }

    return newTask
  })
  await Promise.all(taskPromises)

  // Return the project with all the structure
  return {
    ...newProject,
    lists,
    tasks,
    users: defaultProjectStruct.users,
    history: history || [],
    security,
    colors: defaultProjectStruct.colors
  }
}
