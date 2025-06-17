import {
  findProjectById,
  createTask as createTaskDb,
  updateTask as updateTaskDb
} from '../db/project'
import { nanoid } from 'nanoid'
import { moveTaskToPosition, addTaskToColumn } from '../db/taskPositions'
import { Request, Response, NextFunction } from 'express'
import { getFullProject } from '../db/toApi'
import { db } from '../db/db'
import { z } from 'zod'
import { validateRequest } from '../middleware/validate'

// Zod validation schemas
const createTaskSchema = z.object({
  projId: z.string().min(1, 'Project ID is required'),
  listId: z.string().min(1, 'List ID is required'),
  taskInfo: z.object({
    name: z.string().optional(),
    points: z.number().optional(),
    color: z.string().optional(),
    dueDate: z.string().optional(),
    description: z.string().optional(),
    subTasks: z.array(z.any()).optional()
  })
})

const editTaskSchema = z.object({
  projId: z.string().min(1, 'Project ID is required'),
  taskId: z.string().min(1, 'Task ID is required'),
  task: z.any()
})

const deleteTaskSchema = z.object({
  projId: z.string().min(1, 'Project ID is required'),
  id: z.string().min(1, 'Task ID is required')
})
const dragTaskSchema = z.object({
  projectId: z.string().min(1, 'Project ID is required'),
  taskId: z.string().min(1, 'Task ID is required'),
  fromListId: z.string().min(1, 'List ID is required'),
  toListId: z.string().min(1, 'List ID is required'),
  fromProgress: z.number().min(0, 'From progress is required'),
  toProgress: z.number().min(0, 'To progress is required'),
  fromIdx: z.number().min(0, 'From index is required'),
  toIdx: z.number().min(0, 'To index is required')
})

const setSubtaskSchema = z.object({
  projId: z.string().min(1, 'Project ID is required'),
  taskId: z.string().min(1, 'Task ID is required'),
  subtaskId: z.string().min(1, 'Subtask ID is required'),
  info: z
    .object({
      name: z.string().optional(),
      completed: z.boolean().optional(),
      orderIndex: z.number().optional()
    })
    .optional()
})

const setCommentSchema = z.object({
  projId: z.string().min(1, 'Project ID is required'),
  taskId: z.string().min(1, 'Task ID is required'),
  commentId: z.string().min(1, 'Comment ID is required'),
  description: z.string().min(1, 'Description is required')
})

const assignUserToTaskSchema = z.object({
  projId: z.string().min(1, 'Project ID is required'),
  taskId: z.string().min(1, 'Task ID is required'),
  userId: z.string().min(1, 'User ID is required')
})

export const validateCreateTask = validateRequest(createTaskSchema)
export const validateEditTask = validateRequest(editTaskSchema)
export const validateDeleteTask = validateRequest(deleteTaskSchema)
export const validateDragTask = validateRequest(dragTaskSchema)
export const validateSetSubtask = validateRequest(setSubtaskSchema)
export const validateSetComment = validateRequest(setCommentSchema)
export const validateAssignUserToTask = validateRequest(assignUserToTaskSchema)

export const createTask = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { projId, listId, taskInfo } = createTaskSchema.parse(req.body)

    const project = await findProjectById(projId)
    if (!project) {
      res.status(404).json({ error: 'Project not found' })
      return
    }

    const taskId = nanoid()
    const task = await createTaskDb(projId, {
      id: taskId,
      name: taskInfo.name || 'Unnamed Task',
      points: taskInfo.points || 0,
      workedOnMs: 0,
      color: taskInfo.color || '#FFFFFF',
      dueDate: taskInfo.dueDate
        ? new Date(taskInfo.dueDate).toISOString()
        : null,
      description: taskInfo.description || null
    })

    if (taskInfo.subTasks && taskInfo.subTasks.length > 0) {
      const now = new Date().toISOString()
      const subtaskPromises = taskInfo.subTasks.map(
        (subT: any, index: number) =>
          db
            .insertInto('subtasks')
            .values({
              id: subT.id || nanoid(),
              taskId: task.id!,
              name: subT.name,
              completed: subT.completed ? 1 : 0,
              orderIndex: index,
              createdAt: now,
              updatedAt: now
            })
            .execute()
      )
      await Promise.all(subtaskPromises)
    }

    await addTaskToColumn(task.id!, listId, 0) // Add to "todo" column by default

    const updatedProject = await getFullProject(projId as string)
    if (!updatedProject) {
      res.status(404).json({ error: 'Project not found after update' })
      return
    }
    const newTask = updatedProject.tasks.find((t: any) => t.id === taskId)

    res.json({ project: updatedProject, task: newTask })
  } catch (error) {
    next(error)
  }
}

export const editTask = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { projId, taskId, task } = editTaskSchema.parse(req.body)

    const updatedTask = await updateTaskDb(taskId, task)
    const updatedProject = await getFullProject(projId as string)
    if (!updatedProject) {
      res.status(404).json({ error: 'Project not found after update' })
      return
    }

    res.json({ project: updatedProject, task: updatedTask })
  } catch (error) {
    next(error)
  }
}

export const deleteTask = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { projId, id } = deleteTaskSchema.parse(req.body)
    await db.deleteFrom('tasks').where('id', '=', id).execute() // Cascade delete will handle related data
    const updatedProject = await getFullProject(projId as string)
    if (!updatedProject) {
      res.status(404).json({ error: 'Project not found after update' })
      return
    }
    res.json({ project: updatedProject, task: null })
  } catch (error) {
    next(error)
  }
}

export const dragTask = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const args = dragTaskSchema.parse(req.body)
    await moveTaskToPosition(
      args.taskId,
      args.toListId,
      args.toProgress,
      args.toIdx
    )
    const updatedProject = await getFullProject(args.projectId as string)
    if (!updatedProject) {
      res.status(404).json({ error: 'Project not found after update' })
      return
    }
    res.json({ project: updatedProject })
  } catch (error) {
    next(error)
  }
}

export const setSubtask = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { projId, taskId, subtaskId, info } = setSubtaskSchema.parse(req.body)

    const existingSubtask = await db
      .selectFrom('subtasks')
      .selectAll()
      .where('id', '=', subtaskId)
      .executeTakeFirst()

    if (info) {
      const now = new Date().toISOString()
      if (existingSubtask) {
        await db
          .updateTable('subtasks')
          .set({
            name: info.name,
            completed: info.completed ? 1 : 0,
            updatedAt: now
          })
          .where('id', '=', subtaskId)
          .execute()
      } else {
        await db
          .insertInto('subtasks')
          .values({
            id: subtaskId,
            name: info.name || 'New subtask',
            completed: info.completed ? 1 : 0,
            taskId: taskId,
            orderIndex: info.orderIndex || 0,
            createdAt: now,
            updatedAt: now
          })
          .execute()
      }
    } else {
      await db.deleteFrom('subtasks').where('id', '=', subtaskId).execute()
    }

    const updatedProject = await getFullProject(projId as string)
    if (!updatedProject) {
      res.status(404).json({ error: 'Project not found after update' })
      return
    }
    const updatedTask = updatedProject.tasks.find((t: any) => t.id === taskId)

    res.json({ project: updatedProject, task: updatedTask })
  } catch (error) {
    next(error)
  }
}

export const setComment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { projId, taskId, commentId, description } = setCommentSchema.parse(
      req.body
    )

    const now = new Date().toISOString()

    // Upsert comment
    await db
      .insertInto('comments')
      .values({
        id: commentId,
        taskId,
        comment: description,
        dateAdded: now,
        lastEdited: now,
        createdAt: now
      })
      .onConflict((oc) =>
        oc.column('id').doUpdateSet({
          comment: description,
          lastEdited: now
        })
      )
      .execute()

    const updatedProject = await getFullProject(projId as string)
    if (!updatedProject) {
      res.status(404).json({ error: 'Project not found after update' })
      return
    }
    const updatedTask = updatedProject.tasks.find((t: any) => t.id === taskId)

    res.json({ project: updatedProject, task: updatedTask })
  } catch (error) {
    next(error)
  }
}

export const assignUserToTask = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { projId, taskId, userId } = assignUserToTaskSchema.parse(req.body)

    // Check if assignment already exists
    const existing = await db
      .selectFrom('taskAssignments')
      .where('taskId', '=', taskId)
      .where('userId', '=', userId)
      .select('id')
      .executeTakeFirst()

    if (!existing) {
      await db
        .insertInto('taskAssignments')
        .values({
          taskId,
          userId,
          createdAt: new Date().toISOString()
        })
        .execute()
    }
    // Note: No functionality to un-assign in this endpoint

    const updatedProject = await getFullProject(projId as string)
    if (!updatedProject) {
      res.status(404).json({ error: 'Project not found after update' })
      return
    }
    const updatedTask = updatedProject.tasks.find((t: any) => t.id === taskId)

    res.json({ project: updatedProject, task: updatedTask })
  } catch (error) {
    next(error)
  }
}
