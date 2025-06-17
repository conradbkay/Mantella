import { db } from './db'

export interface ListTaskIds {
  id: string
  name: string
  taskIds: string[][]
}

/**
 * Get all task positions for a project, organized by lists
 */
export async function getProjectTaskPositions(
  projectId: string
): Promise<ListTaskIds[]> {
  // Get all lists for the project
  const lists = await db
    .selectFrom('lists')
    .selectAll()
    .where('projectId', '=', projectId)
    .orderBy('orderIndex', 'asc')
    .execute()

  // Get all task positions for the project
  const taskPositions = await db
    .selectFrom('taskPositions')
    .innerJoin('tasks', 'taskPositions.taskId', 'tasks.id')
    .innerJoin('lists', 'taskPositions.listId', 'lists.id')
    .select([
      'taskPositions.taskId',
      'taskPositions.listId',
      'taskPositions.columnIndex',
      'taskPositions.positionIndex'
    ])
    .where('tasks.projectId', '=', projectId)
    .orderBy('taskPositions.listId', 'asc')
    .orderBy('taskPositions.columnIndex', 'asc')
    .orderBy('taskPositions.positionIndex', 'asc')
    .execute()

  // Organize tasks by list and column
  const result: ListTaskIds[] = lists.map((list) => {
    const listTasks = taskPositions.filter((pos) => pos.listId === list.id)
    const taskIds: string[][] = [[], [], []] // 3 columns: todo, in_progress, done

    listTasks.forEach((pos) => {
      if (pos.positionIndex !== null) {
        taskIds[pos.columnIndex][pos.positionIndex] = pos.taskId
      }
    })

    return {
      id: list.id!,
      name: list.name,
      taskIds
    }
  })

  return result
}

/**
 * Move a task to a new position
 */
export async function moveTaskToPosition(
  taskId: string,
  toListId: string,
  toProgress: number,
  toIdx: number
): Promise<void> {
  // Start a transaction to ensure data consistency
  await db.transaction().execute(async (trx) => {
    // Get current task position
    const currentPosition = await trx
      .selectFrom('taskPositions')
      .selectAll()
      .where('taskId', '=', taskId)
      .executeTakeFirst()

    if (!currentPosition) {
      // Task doesn't have a position yet, create one
      await trx
        .insertInto('taskPositions')
        .values({
          taskId,
          listId: toListId,
          columnIndex: toProgress,
          positionIndex: toIdx,
          updatedAt: new Date().toISOString()
        })
        .execute()
      return
    }

    const fromListId = currentPosition.listId
    const fromColumnIndex = currentPosition.columnIndex
    const fromPositionIndex = currentPosition.positionIndex

    // Check if moving within the same list and column
    if (fromListId === toListId && fromColumnIndex === toProgress) {
      // Moving within the same column - reorder positions
      if (fromPositionIndex === toIdx) {
        // No change needed
        return
      }

      if (fromPositionIndex < toIdx) {
        // Moving down: shift tasks between old and new position up
        await trx
          .updateTable('taskPositions')
          .set((eb) => ({
            positionIndex: eb('positionIndex', '-', 1),
            updatedAt: new Date().toISOString()
          }))
          .where('listId', '=', toListId)
          .where('columnIndex', '=', toProgress)
          .where('positionIndex', '>', fromPositionIndex)
          .where('positionIndex', '<=', toIdx)
          .execute()
      } else {
        // Moving up: shift tasks between new and old position down
        await trx
          .updateTable('taskPositions')
          .set((eb) => ({
            positionIndex: eb('positionIndex', '+', 1),
            updatedAt: new Date().toISOString()
          }))
          .where('listId', '=', toListId)
          .where('columnIndex', '=', toProgress)
          .where('positionIndex', '>=', toIdx)
          .where('positionIndex', '<', fromPositionIndex)
          .execute()
      }

      // Update the task's position
      await trx
        .updateTable('taskPositions')
        .set({
          positionIndex: toIdx,
          updatedAt: new Date().toISOString()
        })
        .where('taskId', '=', taskId)
        .execute()
    } else {
      // Moving between different lists or columns

      // First, shift up all tasks that were after the old position
      await trx
        .updateTable('taskPositions')
        .set((eb) => ({
          positionIndex: eb('positionIndex', '-', 1),
          updatedAt: new Date().toISOString()
        }))
        .where('listId', '=', fromListId)
        .where('columnIndex', '=', fromColumnIndex)
        .where('positionIndex', '>', fromPositionIndex)
        .execute()

      // Then, shift down all tasks at or after the target position
      await trx
        .updateTable('taskPositions')
        .set((eb) => ({
          positionIndex: eb('positionIndex', '+', 1),
          updatedAt: new Date().toISOString()
        }))
        .where('listId', '=', toListId)
        .where('columnIndex', '=', toProgress)
        .where('positionIndex', '>=', toIdx)
        .execute()

      // Finally, update the task's position to the new location
      await trx
        .updateTable('taskPositions')
        .set({
          listId: toListId,
          columnIndex: toProgress,
          positionIndex: toIdx,
          updatedAt: new Date().toISOString()
        })
        .where('taskId', '=', taskId)
        .execute()
    }
  })
}

/**
 * Add a task to the end of a specific column
 */
export async function addTaskToColumn(
  taskId: string,
  listId: string,
  columnIndex: number
): Promise<void> {
  // Get the highest position index in this column
  const maxPosition = await db
    .selectFrom('taskPositions')
    .select(db.fn.max('positionIndex').as('maxPos'))
    .where('listId', '=', listId)
    .where('columnIndex', '=', columnIndex)
    .executeTakeFirst()

  const nextPosition = (maxPosition?.maxPos ?? -1) + 1

  await db
    .insertInto('taskPositions')
    .values({
      taskId,
      listId,
      columnIndex,
      positionIndex: nextPosition,
      updatedAt: new Date().toISOString()
    })
    .execute()
}
