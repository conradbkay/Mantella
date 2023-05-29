import { defaultState } from './defaultState'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from './store'

const pomodoroSlice = createSlice({
  name: 'pomodoro',
  initialState: defaultState.pomodoro,
  reducers: {
    TICK: (pom) => {
      if (pom.currSeconds > 0 && !pom.paused) {
        pom.currSeconds -= 1
      } else {
        pom.paused = true
        pom.working = !pom.working
        pom.currSeconds = pom.working ? pom.workSeconds : pom.breakSeconds
      }
    },
    TOGGLE_TIMER: (pom) => {
      pom.paused = !pom.paused
    },

    RESET_POMODORO: () => defaultState.pomodoro,

    SELECT_POMODORO_TASK: (pom, { payload }: PayloadAction<string>) => {
      pom.selectingTask = false

      if (payload === pom.selectedTaskId) {
        pom.selectedTaskId = null // deselect
      } else {
        pom.selectedTaskId = payload
      }
    },

    TOGGLE_SELECTING_TASK: (pom) => {
      pom.selectingTask = !pom.selectingTask
    },

    TICK_STOPWATCH: (pom) => {
      pom.stopWatch.time += 1
      pom.stopWatch.highest = Math.max(
        pom.stopWatch.time,
        pom.stopWatch.highest
      )
    },

    TOGGLE_STOPWATCH: (pom) => {
      pom.stopWatch.paused = !pom.stopWatch.paused
    },

    RESET_STOPWATCH: (pom) => {
      // don't reset highscore!
      pom.stopWatch.time = 0
      pom.stopWatch.paused = true
    },

    SET_LENGTH_MINUTES: (
      pom,
      {
        payload
      }: PayloadAction<{
        operationType: 'WORK' | 'BREAK'
        minutes: number
      }>
    ) => {
      const slice =
        payload.operationType === 'WORK' ? 'workSeconds' : 'breakSeconds'

      const changingCurrent =
        (payload.operationType === 'WORK' && pom.working) ||
        (payload.operationType === 'BREAK' && !pom.working)

      const result = pom[slice] + payload.minutes * 60

      if (result > 0) {
        const newSeconds = changingCurrent
          ? pom.currSeconds + payload.minutes * 60
          : pom.currSeconds

        pom.currSeconds = newSeconds
        pom[slice] = result
      }
    }
  }
})

export const {
  TICK,
  TOGGLE_TIMER,
  RESET_POMODORO,
  SELECT_POMODORO_TASK,
  TOGGLE_SELECTING_TASK,
  TICK_STOPWATCH,
  TOGGLE_STOPWATCH,
  RESET_STOPWATCH,
  SET_LENGTH_MINUTES
} = pomodoroSlice.actions

export const selectPomodoro = (state: RootState) => state.pomodoro

export default pomodoroSlice.reducer
