import { defaultState } from './defaultState'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from './store'
import { TFilterData } from '../components/Project/types'

const filterSlice = createSlice({
  name: 'filter',
  initialState: defaultState.filter,
  reducers: {
    SET_FILTER: (state, action: PayloadAction<TFilterData>) => {
      return action.payload
    }
  }
})

export const { SET_FILTER } = filterSlice.actions

export const selectFilter = (state: RootState) => state.filter

export default filterSlice.reducer
