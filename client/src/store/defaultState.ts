import { TSnackbar } from '../types/state'

import { TState } from '../types/state'

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
    stopWatch: {
      pastTimes: [],
      time: 0,
      paused: true,
      highest: 0
    }
  },
  snackbar: defaultSnackbar,
  isLoading: false,
  projects: [],
  filter: {
    dueDate: [null, null],
    color: ['all'],
    points: [0, 50]
  }
}
