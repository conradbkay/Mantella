import { DragEndEvent, DragOverEvent } from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import { ApiProject } from '@shared/types'

export const getDragEventData = ({
  active,
  over
}: DragOverEvent | DragEndEvent) => {
  if (over && active.data.current) {
    const taskId = active.id as string
    const fromIdx = active.data.current.sortable.index
    const [fromListId, fromProgress] =
      active.data.current.sortable.containerId.split('|')
    const [toListId, toProgress] = (over.id as string).includes('|')
      ? (over.id as string).split('|')
      : over.data.current!.sortable.containerId.split('|')

    const toIdx = over.data.current ? over.data.current.sortable.index : 0

    return {
      taskId,
      toIdx,
      fromIdx,
      fromListId,
      toListId,
      toProgress: parseInt(toProgress),
      fromProgress: parseInt(fromProgress)
    }
  }
  return null
}

/** mutates input project */
export const dragTask = ({
  project,
  taskId,
  fromListId,
  fromProgress,
  fromIdx,
  toListId,
  toProgress,
  toIdx
}: {
  project: ApiProject
} & ReturnType<typeof getDragEventData>) => {
  const fromListIndex = project.lists.findIndex(
    (list) => list.id === fromListId
  )
  const toListIndex = project.lists.findIndex((list) => list.id === toListId)

  if (fromListIndex === -1 || toListIndex === -1) {
    return
  }

  // reorder within same row+col
  if (fromListId === toListId && fromProgress === toProgress) {
    project.lists[fromListIndex].taskIds[fromProgress] = arrayMove(
      project.lists[fromListIndex].taskIds[fromProgress],
      fromIdx,
      toIdx
    )
  } else {
    project.lists[fromListIndex].taskIds[fromProgress].splice(fromIdx, 1)
    project.lists[toListIndex].taskIds[toProgress].splice(
      fromIdx > toIdx ? toIdx + 1 : toIdx,
      0,
      taskId
    )
  }
}
