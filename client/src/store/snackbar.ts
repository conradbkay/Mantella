import { defaultState } from './defaultState'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from './store'
import { TVariant } from '../types/state'

const filterSlice = createSlice({
  name: 'snackbar',
  initialState: defaultState.snackbar,
  reducers: {
    OPEN_SNACKBAR: (
      state,
      action: PayloadAction<{ message: string; variant: TVariant }>
    ) => {
      state.open = true
      state.message = action.payload.message
      state.variant = action.payload.variant
    },
    CLOSE_SNACKBAR: (state) => {
      state.open = false
    }
  }
})

export const { OPEN_SNACKBAR, CLOSE_SNACKBAR } = filterSlice.actions

export const selectSnackbar = (state: RootState) => state.snackbar

export default filterSlice.reducer
