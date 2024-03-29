import { TFilterData } from '../components/Project/types'
import { TProject } from './project'

export type TStopWatch = {
  pastTimes: number[]
  time: number
  paused: boolean
  highest: number
}

export type TPomodoro = {
  paused: boolean
  working: boolean
  currSeconds: number
  breakSeconds: number
  workSeconds: number
  selectingTask: boolean
  selectedTaskId: null | string
  stopWatch: TStopWatch
}

export type TProfile = {
  id: string
  guest?: boolean
  profileImg: string
  username: string
  joinedIds: string[]
  email: string
}

export type TProfiles = {
  [id: string]: TProfile
}

export type TVariant = 'success' | 'warning' | 'error' | 'standard' | 'undo'

export type TSnackbar = {
  open: boolean
  message: string
  variant: TVariant
}

export type TAuthUser = TProfile

export type TState = {
  snackbar: TSnackbar
  loading: boolean
  pomodoro: TPomodoro
  user: TAuthUser | null
  projects: TProject[]
  filter: TFilterData
}
