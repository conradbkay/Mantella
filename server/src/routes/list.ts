import { createList as createListDb } from '../db/project'
import { shiftListOrder, updateListOrder } from '../db/listUtils'
import { Request, Response, NextFunction } from 'express'
import { db } from '../db/db'
import { z } from 'zod'
import { getFullProject } from '../db/toApi'
import { validateRequest } from '../middleware/validate'

// Zod validation schemas
const editListSchema = z.object({
  projId: z.string().min(1, 'Project ID is required'),
  listId: z.string().min(1, 'List ID is required'),
  newList: z.object({
    name: z.string().min(1, 'List name is required')
  })
})

const createListSchema = z.object({
  projId: z.string().min(1, 'Project ID is required'),
  name: z.string().min(1, 'List name is required')
})

const deleteListSchema = z.object({
  projId: z.string().min(1, 'Project ID is required'),
  id: z.string().min(1, 'List ID is required')
})

const setListIdxSchema = z.object({
  projId: z.string().min(1, 'Project ID is required'),
  listId: z.string().min(1, 'List ID is required'),
  offset: z.number()
})

export const validateEditList = validateRequest(editListSchema)
export const validateCreateList = validateRequest(createListSchema)
export const validateDeleteList = validateRequest(deleteListSchema)
export const validateSetListIdx = validateRequest(setListIdxSchema)

export const editList = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { projId, listId, newList } = editListSchema.parse(req.body)

    await db
      .updateTable('lists')
      .set({ name: newList.name })
      .where('id', '=', listId)
      .execute()

    const project = await getFullProject(projId)
    const updatedList = project?.lists.find((l) => l.id === listId)

    res.json({
      project,
      list: updatedList
    })
  } catch (error) {
    next(error)
  }
}

export const createList = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { projId, name } = createListSchema.parse(req.body)
    await createListDb(projId, name || 'New List')
    const project = await getFullProject(projId)
    // Assuming the new list is the last one created
    const newList = project?.lists[project.lists.length - 1]

    res.json({
      project,
      list: newList
    })
  } catch (error) {
    next(error)
  }
}

export const deleteList = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { projId, id } = deleteListSchema.parse(req.body)
    await db.deleteFrom('lists').where('id', '=', id).execute()
    const project = await getFullProject(projId)
    res.json({
      project
    })
  } catch (error) {
    next(error)
  }
}

export const setListIdx = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { projId, listId, offset } = setListIdxSchema.parse(req.body)

    // Get the current list to find its current order index
    const currentList = await db
      .selectFrom('lists')
      .select(['orderIndex'])
      .where('id', '=', listId)
      .where('projectId', '=', projId)
      .executeTakeFirst()

    if (!currentList || currentList.orderIndex === null) {
      return res.status(404).json({ error: 'List not found' })
    }

    const currentIndex = currentList.orderIndex
    const newIndex = currentIndex + offset

    // Get all lists in the project to validate bounds
    const allLists = await db
      .selectFrom('lists')
      .select(['id', 'orderIndex'])
      .where('projectId', '=', projId)
      .orderBy('orderIndex', 'asc')
      .execute()

    // Validate bounds
    if (newIndex < 0 || newIndex >= allLists.length) {
      return res
        .status(400)
        .json({ error: 'Invalid offset - would move list out of bounds' })
    }

    // Shift all lists between current and target position
    await shiftListOrder(projId, currentIndex, newIndex)
    // Then move the current list to its new position
    await updateListOrder(listId, newIndex)

    const project = await getFullProject(projId)
    res.json({ project })
  } catch (error) {
    next(error)
  }
}
