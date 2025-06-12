import { TSnackbar, TState } from '../types/state'
import { toDaysHHMMSS } from '../utils/utilities'

export const defaultSnackbar: TSnackbar = {
  open: false,
  message: '',
  variant: 'success'
}

export const defaultState: TState = {
  user: null,
  pomodoro: {
    paused: true,
    working: true,
    selectingTask: false,
    selectedTaskId: null,
    currSeconds: 60 * 25,
    breakSeconds: 60 * 5,
    workSeconds: 60 * 25,
    startTime: 0,
    time: toDaysHHMMSS(60 * 25)
  },
  snackbar: defaultSnackbar,
  loading: false,
  projects: [],
  filter: {
    dueDate: [null, null],
    color: ['all'],
    points: [0, 50]
  }
}
