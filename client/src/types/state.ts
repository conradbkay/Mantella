import { TFilterData } from '../components/Project/types'
import { ApiUser } from '@shared/types'

// temp
export type TProfile = ApiUser
export type TAuthUser = ApiUser

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

export type TVariant = 'success' | 'warning' | 'error' | 'standard' | 'undo'

export type TSnackbar = {
  open: boolean
  message: string
  variant: TVariant
}

export type TState = {
  snackbar: TSnackbar
  pomodoro: TPomodoro
  filter: TFilterData
}
