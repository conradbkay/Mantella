import { defaultState } from './defaultState'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from './store'

const loadingSlice = createSlice({
  name: 'loading',
  initialState: defaultState.loading,
  reducers: {
    SET_LOADING: (state, action: PayloadAction<boolean>) => {
      return action.payload
    }
  }
})

export const { SET_LOADING } = loadingSlice.actions

export const selectLoading = (state: RootState) => state.loading

export default loadingSlice.reducer
