import { cloneDeep } from 'lodash'
import { DropResult } from 'react-beautiful-dnd'
import { TList, TProject } from '../types/project'
import { id } from './utilities'

const getRealIndex = (
  index: number,
  project: TProject,
  newProgress: number,
  newListIds: string[],
  draggingTaskId: string,
  fromList: TList,
  toListId: string
): number => {
  const tasksAtNewList = project.tasks.filter((task) =>
    newListIds.includes(task.id)
  )

  const newListTasksWithLowerColumn = tasksAtNewList.filter(
    (task) => task.progress < newProgress
  )

  index += newListTasksWithLowerColumn.length

  const draggingToSameList = fromList.id === toListId
  const draggingTask = project.tasks[id(project.tasks, draggingTaskId)]
  const draggingToSameColumn = draggingTask.progress === newProgress

  if (draggingToSameList && !draggingToSameColumn) {
    const draggingTaskCurIndex = fromList.taskIds.findIndex(
      (taskId: string) => taskId === draggingTaskId
    )

    const addingLater = index > draggingTaskCurIndex

    if (addingLater) {
      index = Math.max(0, index - 1)
    }
  }

  return index
}

export const onDragEnd = (
  { destination, source, draggableId }: DropResult,
  project: TProject
) => {
  if (!destination) {
    return null
  }
  if (
    source.droppableId === destination.droppableId &&
    source.index === destination.index
  ) {
    return null
  }

  const [[fromListId], [toListId, newProgressStr]] = [
    source.droppableId.split('|'),
    destination.droppableId.split('|')
  ]
  const newProgress = parseInt(newProgressStr, 10)

  const editProject = cloneDeep(project)

  const [fromList, toList] = [
    editProject.lists[id(editProject.lists, fromListId)],
    editProject.lists[id(editProject.lists, toListId)]
  ]

  // react-beautiful-dnd will not give an accurate index, because each droppable has only the tasks with the same progress and column combination
  let realIndex = getRealIndex(
    destination.index,
    project,
    newProgress,
    toList.taskIds,
    draggableId,
    fromList,
    toList.id
  )

  fromList.taskIds = fromList.taskIds.filter((taskId) => taskId !== draggableId)
  toList.taskIds.splice(realIndex, 0, draggableId)

  editProject.tasks[id(editProject.tasks, draggableId)].progress = newProgress

  return {
    editProject,
    fromListId,
    toListId,
    realIndex,
    newColumn: newProgress
  }
}
