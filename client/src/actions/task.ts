import {
  APIAssignUserToTask,
  APICreateTask,
  APIDeleteTask,
  APIDragTask
} from '../API/task'
import { SET_PROJECT, SET_TASK } from '../store/projects'
import { OPEN_SNACKBAR } from '../store/snackbar'
import { AppDispatch } from '../store/store'
import { TList, TProject, TTask } from '../types/project'
import { id } from '../utils/utils'

export const createTask = async (
  dispatch: AppDispatch,
  task: TTask,
  listId: string,
  projectId: string
) => {
  try {
    const res = await APICreateTask(projectId, listId, {
      points: task.points,
      color: task.color,
      name: task.name,
      description: task.description,
      dueDate: task.dueDate ? task.dueDate.toString() : undefined
    })
    if (res && res.project) {
      dispatch(
        SET_PROJECT({
          id: res.project.id,
          project: res.project
        })
      )
    }
  } catch (err) {
    dispatch(
      OPEN_SNACKBAR({
        message: 'Task Could Not Be Created',
        variant: 'warning'
      })
    )
  }
}

export const dragTask = async (
  dispatch: AppDispatch,
  project: TProject,
  progress: number,
  ownerList: TList,
  toId: string,
  taskId: string
) => {
  const data = await APIDragTask({
    projectId: project.id,
    from: [
      ownerList.id,
      progress,
      project.lists[id(project.lists, ownerList.id)].taskIds[progress].filter(
        (id) => id !== taskId
      )
    ],
    to: [
      toId,
      progress,
      [taskId, ...project.lists[id(project.lists, toId)].taskIds[progress]]
    ]
  })

  dispatch(SET_PROJECT({ id: project.id, project: data.project }))
}

export const deleteTask = (
  dispatch: AppDispatch,
  id: string,
  projectId: string
) => {
  dispatch(OPEN_SNACKBAR({ message: 'Task deleted', variant: 'undo' }))

  dispatch(
    SET_TASK({
      id,
      projectId,
      newTask: undefined
    })
  )

  setTimeout(() => {
    APIDeleteTask(id, projectId)
  }, 5500)
}

export const assignUserToTask = async (
  dispatch: AppDispatch,
  {
    project,
    userId,
    taskId
  }: {
    project: TProject
    userId: string
    taskId: string
  }
) => {
  let newAssigned = [...project.tasks[id(project.tasks, taskId)].assignedTo]
  const idx = newAssigned.indexOf(userId)

  if (idx >= 0) {
    newAssigned.splice(idx, 1)
  } else {
    newAssigned.push(userId)
  }

  dispatch(
    SET_TASK({
      id: taskId,
      projectId: project.id,
      newTask: {
        assignedTo: newAssigned
      }
    })
  )

  await APIAssignUserToTask({
    userId,
    taskId,
    projId: project.id
  })
}
