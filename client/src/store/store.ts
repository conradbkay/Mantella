import { configureStore } from '@reduxjs/toolkit'
import snackbarReducer from './snackbar'
import filterReducer from './filter'
import pomodoroReducer from './pomodoro'
import { api } from './api'

export const store = configureStore({
  reducer: {
    filter: filterReducer,
    pomodoro: pomodoroReducer,
    snackbar: snackbarReducer,
    [api.reducerPath]: api.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware)
})

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch
