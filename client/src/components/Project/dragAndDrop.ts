import { APIAssignUserToTask } from '../../API/task'
import { setTaskA } from '../../store/actions/task'
import { store } from '../../store/store'

const { dispatch } = store

export const dragUser = async (result: any, projId: string) => {
  if (result.combine) {
    const newTask = await APIAssignUserToTask({
      taskId: result.combine!.draggableId,
      projId,
      userId: result.draggableId.slice(4)
    })

    dispatch(
      setTaskA({
        id: newTask.id,
        newTask,
        projectId: projId
      })
    )
  }
  // do in caller
  /*if (isDraggingUser) {
    setIsDraggingUser(false)
  }*/
}

export const dragFromTask = async (result: any, projId: string) => {
  // assume they want to remove the user from the task if they don't drag it to another task
  if (!result.destination || result.destination.droppableId === 'users') {
    const [, taskId, userId] = result.draggableId.split('|')

    const newTask = await APIAssignUserToTask({
      taskId: taskId,
      projId,
      userId: userId
    })

    dispatch(
      setTaskA({
        id: newTask.id,
        newTask,
        projectId: projId
      })
    )
  } else {
  }
}
