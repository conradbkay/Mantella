import { configureStore } from '@reduxjs/toolkit'
import snackbarReducer from './snackbar'
import userReducer from './user'
import filterReducer from './filter'
import loadingReducer from './loading'
import pomodoroReducer from './pomodoro'
import projectsReducer from './projects'

export const store = configureStore({
  reducer: {
    user: userReducer,
    filter: filterReducer,
    loading: loadingReducer,
    pomodoro: pomodoroReducer,
    projects: projectsReducer,
    snackbar: snackbarReducer
  }
})

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch
