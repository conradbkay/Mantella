import { useDispatch } from 'react-redux'
import { AppDispatch } from '../store/store'
import { OPEN_SNACKBAR } from '../store/snackbar'
import { TTask } from '../types/project'
import { useCreateTaskMutation, useDeleteTaskMutation } from '../store/api'

export const useCreateTaskAction = () => {
  const dispatch = useDispatch<AppDispatch>()
  const [createTaskMutation] = useCreateTaskMutation()

  return async (task: TTask, listId: string, projectId: string) => {
    try {
      await createTaskMutation({
        projId: projectId,
        listId,
        taskInfo: {
          points: task.points,
          timeEstimateValue: task.timeEstimateValue,
          color: task.color,
          name: task.name,
          description: task.description,
          dueDate: task.dueDate ? task.dueDate.toString() : undefined
        }
      }).unwrap()
    } catch (err) {
      dispatch(
        OPEN_SNACKBAR({
          message: 'Task Could Not Be Created',
          variant: 'warning'
        })
      )
    }
  }
}

export const useDeleteTaskAction = () => {
  const dispatch = useDispatch<AppDispatch>()
  const [deleteTaskMutation] = useDeleteTaskMutation()

  return (taskId: string, projectId: string) => {
    dispatch(OPEN_SNACKBAR({ message: 'Task deleted', variant: 'undo' }))

    // Perform the deletion with a delay to allow for undo
    setTimeout(() => {
      deleteTaskMutation({ taskId, projectId })
    }, 5500)
  }
}
