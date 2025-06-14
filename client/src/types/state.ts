import { TFilterData } from '../components/Project/types'
import { TProject } from './project'

export type TPomodoro = {
  isPaused: boolean
  isBreak: boolean
  timeLeftMs?: number
  lastStartMs?: number
  lastTickMs?: number
  breakDurationSec: number
  workDurationSec: number
  selectingTask: boolean
  selectedTaskId: null | string
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
