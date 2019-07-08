import { TProject } from '../../types/project'
import { defaultState } from '../defaultState'
import { createReducer } from './createReducer'
import { TState } from '../../types/state'
import { setProjectA, setSwimlaneA, setProjectsA } from '../actions/project'
import { setColumnA } from '../actions/column'
import { ReducerCases } from '../actions/types'
import { taskCases } from './tasks'
import { id } from '../../utils/utilities'

const SET_PROJECT = (
  projects: TProject[],
  action: ReturnType<typeof setProjectA>
) => {
  if (projects[id(projects, action.id)] && action.project !== null) {
    projects[id(projects, action.id)] = Object.assign(
      projects[id(projects, action.id)],
      action.project
    )
  } else if (action.project) {
    projects[id(projects, action.id)] = action.project
  } else {
    delete projects[id(projects, action.id)]
  }
}

const SET_COLUMN = (
  projects: TProject[],
  action: ReturnType<typeof setColumnA>
) => {
  const changing = projects[id(projects, action.projectId)].columns

  if (action.newColumn) {
    if (changing[id(changing, action.id)] === undefined) {
      projects[id(projects, action.projectId)].columnOrder.push(action.id)
    }
    changing[id(changing, action.id)] = {
      ...action.newColumn
    } as any
  } else {
    projects[id(projects, action.projectId)].columnOrder = projects[
      id(projects, action.projectId)
    ].columnOrder.filter(colId => colId !== action.id)

    changing.splice(id(changing, action.id), 1)
  }
}

const SET_SWIMLANE = (
  projects: TProject[],
  action: ReturnType<typeof setSwimlaneA>
) => {
  const changing = projects[id(projects, action.projectId)].swimlanes

  if (action.swimlane) {
    changing[id(changing, action.id)] = {
      ...action.swimlane,
      id: action.id
    }
  } else {
    changing.splice(id(changing, action.id), 1)
  }
}

const projectCases: ReducerCases<TProject[]> = {
  SET_PROJECT,
  SET_COLUMN,
  SET_SWIMLANE,
  SET_PROJECTS: (projects, action: ReturnType<typeof setProjectsA>) => {
    return action.projects
  }
}

export const projectsReducer = createReducer<TState['projects']>(
  defaultState.projects,
  {
    ...projectCases,
    ...taskCases
  } as ReducerCases<TState['projects']>
)
