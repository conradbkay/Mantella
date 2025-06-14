import { defaultState } from './defaultState'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from './store'

const pomodoroSlice = createSlice({
  name: 'pomodoro',
  initialState: defaultState.pomodoro,
  reducers: {
    SYNC_TIMER: (
      pom,
      { payload }: PayloadAction<{ elapsedMs: number; now: number }>
    ) => {
      if (pom.isPaused) {
        return
      }

      pom.timeLeftMs = Math.max(0, pom.timeLeftMs! - payload.elapsedMs)
      pom.lastTickMs = payload.now

      if (pom.timeLeftMs! <= 0) {
        pom.isPaused = true
      }
    },
    TOGGLE_TIMER: (pom) => {
      if (pom.isPaused) {
        // resuming/starting
        pom.isPaused = false
        pom.lastStartMs = Date.now()
        pom.lastTickMs = Date.now()
      } else {
        // pausing
        pom.isPaused = true
        pom.lastStartMs = undefined
        pom.lastTickMs = undefined
      }
    },
    PAUSE_TIMER: (pom) => {
      pom.isPaused = true
      pom.lastStartMs = undefined
      pom.lastTickMs = undefined
    },
    SWITCH_SESSION: (pom) => {
      pom.isBreak = !pom.isBreak
      pom.timeLeftMs =
        (pom.isBreak ? pom.breakDurationSec : pom.workDurationSec) * 1000
      pom.isPaused = false
      pom.lastStartMs = Date.now()
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
      if (!pom.isPaused) return

      if (payload.operationType === 'WORK') {
        const newWorkDuration = pom.workDurationSec + payload.minutes * 60
        if (newWorkDuration > 0) {
          pom.workDurationSec = newWorkDuration
          if (!pom.isBreak) {
            pom.timeLeftMs = newWorkDuration * 1000
          }
        }
      } else {
        const newBreakDuration = pom.breakDurationSec + payload.minutes * 60
        if (newBreakDuration > 0) {
          pom.breakDurationSec = newBreakDuration
          if (pom.isBreak) {
            pom.timeLeftMs = newBreakDuration * 1000
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
  SWITCH_SESSION,
  PAUSE_TIMER
} = pomodoroSlice.actions

export const selectPomodoro = (state: RootState) => state.pomodoro

export default pomodoroSlice.reducer
