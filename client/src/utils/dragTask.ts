import { cloneDeep } from 'lodash'
import { DropResult } from 'react-beautiful-dnd'
import { TProject } from '../types/project'
import { id } from './utilities'

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

  const [[fromListId], [toListId, toProgress]] = [
    source.droppableId.split('DIVIDER'),
    destination.droppableId.split('DIVIDER')
  ]

  const editProject = cloneDeep(project)

  const [fromList, toList] = [
    editProject.lists[id(editProject.lists, fromListId)],
    editProject.lists[id(editProject.lists, toListId)]
  ]

  // react-beautiful-dnd will not give accurate index, because each droppable has only the tasks with the same progress/column
  let actualIndex =
    destination.index +
    project.tasks.reduce((accum, task) => {
      if (
        task.progress < parseInt(toProgress, 10) &&
        toList.taskIds.includes(task.id)
      ) {
        return accum + 1
      }
      return accum
    }, 0)

  if (
    fromList.id === toList.id &&
    project.tasks[id(project.tasks, draggableId)].progress !==
      parseInt(toProgress, 10)
  ) {
    const addingLater =
      actualIndex >
      fromList.taskIds.findIndex((taskId: string) => taskId === draggableId)

    if (addingLater) {
      actualIndex -= 1
    }
  }

  if (actualIndex < 0) {
    actualIndex = 0
  }

  fromList.taskIds = fromList.taskIds.filter((taskId) => taskId !== draggableId)
  toList.taskIds.splice(actualIndex, 0, draggableId)

  const newColumn = parseInt(toProgress, 10)
  editProject.tasks[id(editProject.tasks, draggableId)].progress = newColumn

  return { editProject, fromListId, toListId, actualIndex, newColumn }
}
