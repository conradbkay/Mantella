import { TList, TProject, TSubtask, TTask } from '../types/project'
import { id } from '../utils/utilities'
import { defaultState } from './defaultState'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from './store'
import { cloneDeep } from 'lodash'

const projectSlice = createSlice({
  name: 'projects',
  initialState: defaultState.projects,
  reducers: {
    SET_PROJECTS: (projects, { payload }: PayloadAction<TProject[]>) => {
      return payload
    },
    SET_PROJECT: (
      projects,
      { payload }: PayloadAction<{ project?: TProject; id: string }>
    ) => {
      if (payload.project) {
        if (projects.findIndex((project) => project.id === payload.id) === -1) {
          projects.push(payload.project)
        } else {
          projects[id(projects, payload.id)] = payload.project
        }
      } else {
        projects.splice(id(projects, payload.id), 1)
      }
    },

    SET_LIST: (
      projects,
      {
        payload
      }: PayloadAction<{
        projectId: string
        newList?: Partial<TList>
        id: string
      }>
    ) => {
      let changing = projects[id(projects, payload.projectId)].lists

      if (payload.newList) {
        if (changing.filter((list) => list.id === payload.id).length) {
          changing[id(changing, payload.id)] = {
            ...changing[id(changing, payload.id)],
            ...payload.newList
          }
        } else {
          changing.push({
            taskIds: (payload.newList.taskIds as any) || [[], [], []],
            name: payload.newList.name || 'List',
            id: payload.id
          })
        }
      } else {
        changing.splice(id(changing, payload.id), 1)
      }
    },

    SET_LIST_IDX: (
      projects,
      {
        payload
      }: PayloadAction<{ projectId: string; id: string; offset: number }>
    ) => {
      let changing = projects[id(projects, payload.projectId)].lists

      const fromIndex = id(changing, payload.id)

      const element = changing.splice(fromIndex, 1)[0]

      changing.splice(fromIndex + payload.offset, 0, element)
    },
    SET_TASK: (
      projects,
      {
        payload
      }: PayloadAction<{
        projectId: string
        newTask?: Partial<TTask>
        id: string
      }>
    ) => {
      const project = projects[id(projects, payload.projectId)]
      const tasks = project.tasks

      if (!payload.newTask) {
        // REFERENCE CLEANUP

        project.lists.forEach((list) => {
          list.taskIds.forEach((taskIds, i) => {
            if (taskIds.includes(payload.id)) {
              list.taskIds[i].splice(taskIds.indexOf(payload.id), 1)
            }
          })
        })

        project.tasks.splice(
          project.tasks.findIndex((tsk) => tsk.id === payload.id),
          1
        )
      } else {
        tasks[id(tasks, payload.id)] = {
          ...tasks[id(tasks, payload.id)],
          ...cloneDeep(payload.newTask)!
        }
      }
    },

    SET_SUBTASK: (
      projects,
      {
        payload
      }: PayloadAction<{
        projectId: string
        taskId: string
        id: string
        newSubtask: TSubtask
      }>
    ) => {
      const project = projects[id(projects, payload.projectId)]
      const task = project.tasks[id(project.tasks, payload.taskId)]

      task.subTasks[id(task.subTasks, payload.id)] = payload.newSubtask
      project.tasks[id(project.tasks, payload.taskId)] = task
    },

    TICK: (
      projects,
      {
        payload
      }: PayloadAction<{ taskId: string; projectId: string; seconds: number }>
    ) => {
      if (payload.taskId && payload.projectId) {
        const proj = projects[id(projects, payload.projectId)]
        proj.tasks[id(proj.tasks, payload.taskId)].timeWorkedOn +=
          payload.seconds
      }
    }
  }
})

export const {
  SET_PROJECTS,
  SET_PROJECT,
  SET_LIST,
  SET_LIST_IDX,
  TICK,
  SET_SUBTASK,
  SET_TASK
} = projectSlice.actions

export const selectProjects = (state: RootState) => state.projects

export default projectSlice.reducer
