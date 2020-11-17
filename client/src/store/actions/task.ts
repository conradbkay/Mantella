import { cloneDeep } from 'lodash'
import { TSubtask, TTask } from './../../types/project'

export const setTaskA = (args: {
  id: string
  newTask: TTask | null
  projectId: string
}) => ({
  type: 'SET_TASK',
  id: args.id,
  projectId: args.projectId,
  newTask: args.newTask ? cloneDeep({ ...args.newTask }) : null
})

export const setSubtaskA = (args: {id: string, newSubtask: TSubtask, projectId: string, taskId: string}) => ({
  type: 'SET_SUBTASK',
  id: args.id, projectId: args.projectId,
  newSubtask: args.newSubtask, taskId: args.taskId
})

export type TaskAction = ReturnType<typeof setTaskA> | ReturnType<typeof setSubtaskA>
