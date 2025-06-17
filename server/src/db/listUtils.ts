import { db } from './db'

/**
 * Update a list's order index
 */
export async function updateListOrder(
  listId: string,
  newOrderIndex: number
): Promise<void> {
  await db
    .updateTable('lists')
    .set({ orderIndex: newOrderIndex })
    .where('id', '=', listId)
    .execute()
}

/**
 * Shift list order indices to make room for a new position
 */
export async function shiftListOrder(
  projectId: string,
  fromIndex: number,
  toIndex: number
): Promise<void> {
  if (fromIndex < toIndex) {
    // Moving down: shift items up
    const listsToShift = await db
      .selectFrom('lists')
      .select(['id', 'orderIndex'])
      .where('projectId', '=', projectId)
      .where('orderIndex', '>', fromIndex)
      .where('orderIndex', '<=', toIndex)
      .execute()

    for (const list of listsToShift) {
      if (list.orderIndex !== null) {
        await db
          .updateTable('lists')
          .set({ orderIndex: list.orderIndex - 1 })
          .where('id', '=', list.id)
          .execute()
      }
    }
  } else {
    // Moving up: shift items down
    const listsToShift = await db
      .selectFrom('lists')
      .select(['id', 'orderIndex'])
      .where('projectId', '=', projectId)
      .where('orderIndex', '>=', toIndex)
      .where('orderIndex', '<', fromIndex)
      .execute()

    for (const list of listsToShift) {
      if (list.orderIndex !== null) {
        await db
          .updateTable('lists')
          .set({ orderIndex: list.orderIndex + 1 })
          .where('id', '=', list.id)
          .execute()
      }
    }
  }
}
