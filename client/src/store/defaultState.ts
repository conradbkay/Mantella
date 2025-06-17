import { TSnackbar, TState } from '../types/state'

export const defaultSnackbar: TSnackbar = {
  open: false,
  message: '',
  variant: 'success'
}

export const defaultState: TState = {
  pomodoro: {
    isPaused: true,
    isBreak: false,
    selectingTask: false,
    selectedTaskId: null,
    breakDurationSec: 60 * 5,
    workDurationSec: 60 * 25,
    timeLeftMs: 60 * 25 * 1000,
    lastTickMs: undefined
  },
  snackbar: defaultSnackbar,
  filter: {
    dueDate: [null, null],
    color: ['all'],
    points: [0, 50]
  }
}
