import { defaultState } from './defaultState'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from './store'

const pomodoroSlice = createSlice({
  name: 'pomodoro',
  initialState: defaultState.pomodoro,
  reducers: {
    SYNC_TIMER: (pom, { payload: now }: PayloadAction<number>) => {
      if (pom.paused || pom.startTime === 0) {
        return
      }

      const elapsedSeconds = Math.floor((now - pom.startTime) / 1000)

      if (elapsedSeconds >= pom.currSeconds) {
        // Timer finished. Switch session.
        const newSessionIsWork = !pom.working
        const timeOver = elapsedSeconds - pom.currSeconds
        const newDuration = newSessionIsWork
          ? pom.workSeconds
          : pom.breakSeconds

        pom.working = newSessionIsWork
        pom.currSeconds = newDuration - timeOver
        pom.startTime = now - timeOver * 1000
      }
    },
    SET_TIME: (pom, { payload }: PayloadAction<string>) => {
      pom.time = payload
    },
    TOGGLE_TIMER: (pom, { payload: now }: PayloadAction<number>) => {
      if (pom.paused) {
        // un-pausing
        pom.startTime = now
      } else {
        // pausing
        const elapsedSeconds = Math.round((now - pom.startTime) / 1000)
        pom.currSeconds -= elapsedSeconds
        if (pom.currSeconds < 0) pom.currSeconds = 0
        pom.startTime = 0
      }
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

      // only allow changing if paused
      if (pom.paused) {
        const result = pom[slice] + payload.minutes * 60

        if (result > 0) {
          pom[slice] = result
          if (changingCurrent) {
            pom.currSeconds = result
          }
        }
      }
    }
  }
})

export const {
  SYNC_TIMER,
  TOGGLE_TIMER,
  RESET_POMODORO,
  SELECT_POMODORO_TASK,
  TOGGLE_SELECTING_TASK,
  SET_LENGTH_MINUTES,
  SET_TIME
} = pomodoroSlice.actions

export const selectPomodoro = (state: RootState) => state.pomodoro

export default pomodoroSlice.reducer
