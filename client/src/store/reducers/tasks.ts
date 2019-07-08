import { ReducerCases } from '../actions/types'
import { setTaskA } from '../actions/task'
import { tickA } from '../actions/pomodoro'
import { TProjects } from '../../types/project'

const SET_TASK = (projects: TProjects, action: ReturnType<typeof setTaskA>) => {
  const project = projects[action.projectId]
  const tasks = project.tasks
  if (action.newTask === null) {
    // REFERENCE CLEANUP

    Object.keys(project.columns).map(columnKey => {
      const column = project.columns[columnKey]

      if (column.taskIds.includes(action.id)) {
        column.taskIds.splice(column.taskIds.indexOf(action.id), 1)
      }
    })

    Object.keys(project.swimlanes).map(swimlaneKey => {
      const swimlane = project.swimlanes[swimlaneKey]

      if (swimlane.taskIds.includes(action.id)) {
        swimlane.taskIds.splice(swimlane.taskIds.indexOf(action.id), 1)
      }
    })

    delete project.tasks[action.id]
  } else {
    tasks[action.id] = {
      ...action.newTask
    }
  }
}

// const SET_SUBTASK = (projects: TProjects, action) => {}
// const SET_COLUMN = () => {}

const TICK = (projects: TProjects, action: ReturnType<typeof tickA>) => {
  if (action.taskId && action.projectId) {
    projects[action.projectId].tasks[action.taskId].timeWorkedOn += 1
  }
}

export const taskCases = {
  TICK,
  SET_TASK
} as ReducerCases<TProjects>
