import { defaultState } from './defaultState'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from './store'
import { TAuthUser } from '../types/state'

const userSlice = createSlice({
  name: 'user',
  initialState: defaultState.user,
  reducers: {
    LOGIN: (state, action: PayloadAction<{ user: TAuthUser }>) => {
      return action.payload.user
    },
    REGISTER: (state, action: PayloadAction<{ user: TAuthUser }>) => {
      return action.payload.user
    }
  }
})

export const { LOGIN, REGISTER } = userSlice.actions

export const selectUser = (state: RootState) => state.user

export default userSlice.reducer
