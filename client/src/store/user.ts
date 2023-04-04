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
    },
    SET_NAME: (state, action: PayloadAction<{ name: string }>) => {
      state!.username = action.payload.name
    },
    SET_EMAIL: (state, action: PayloadAction<{ email: string }>) => {
      state!.email = action.payload.email
    }
  }
})

export const { LOGIN, REGISTER, SET_NAME, SET_EMAIL } = userSlice.actions

export const selectUser = (state: RootState) => state.user

export default userSlice.reducer
